// Block B-#6: LLM-as-judge JSON validation pass on the FINAL coaching score only.
// The streaming `academy-chat` function still produces the human-friendly wrap-up
// and the regex-extracted preview score. This function returns a strict JSON
// re-grade that the frontend reconciles by taking the higher of the two.
//
// Why a separate function:
//  - Streaming + structured-output don't mix cleanly.
//  - We only want this cost on the FINAL response (4th trainee turn), not every turn.
//  - JSON-mode + Zod gives us a guaranteed score in [0,10] with no regex ambiguity.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.23.8/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};


const BodySchema = z.object({
  moduleTitle: z.string().min(1).max(300),
  modulePrompt: z.string().min(1).max(4000),
  transcript: z
    .array(
      z.object({
        role: z.enum(["user", "coach", "assistant"]),
        content: z.string().min(1).max(10000),
      }),
    )
    .min(2)
    .max(40),
  heuristicScore: z.number().int().min(0).max(10).nullable().optional(),
  answerKey: z.array(z.string().min(8).max(1200)).length(4).nullable().optional(),
});

const JudgeSchema = z.object({
  score: z.number().int().min(0).max(10),
  verdict: z.enum(["exceptional", "strong", "average", "weak", "poor"]),
  reasoning: z.string().min(1).max(800),
  response_scores: z.array(z.object({
    response: z.number().int().min(1).max(4),
    points: z.number().min(0).max(2.5),
    reason: z.string().min(1).max(300),
  })).length(4),
  perfect_responses: z.array(z.string().min(8).max(900)).length(4),
});

type TranscriptMessage = z.infer<typeof BodySchema>["transcript"][number];

const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
const hasAny = (text: string, patterns: RegExp[]) => patterns.some((pattern) => pattern.test(text));

const normalizeAnswerText = (value: string) => value
  .toLowerCase()
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/\*\*/g, '')
  .replace(/^\s*\d+[.)]\s*/gm, '')
  .replace(/[^a-z0-9$%]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const answerTokens = (value: string) => normalizeAnswerText(value).split(' ').filter((token) => token.length > 2 || /\d/.test(token));

function answersAreEquivalent(actual: string, expected: string): boolean {
  const actualText = normalizeAnswerText(actual);
  const expectedText = normalizeAnswerText(expected);
  if (!actualText || !expectedText) return false;
  if (actualText.length > 60 && expectedText.length > 60 && (actualText.includes(expectedText) || expectedText.includes(actualText))) return true;
  const actualSet = new Set(answerTokens(actualText));
  const expectedSet = new Set(answerTokens(expectedText));
  if (actualSet.size < 8 || expectedSet.size < 8) return false;
  let overlap = 0;
  actualSet.forEach((token) => { if (expectedSet.has(token)) overlap += 1; });
  return overlap / Math.min(actualSet.size, expectedSet.size) >= 0.84 && overlap / expectedSet.size >= 0.55;
}

function responsesMatchAnswerKey(transcript: TranscriptMessage[], answerKey?: string[] | null): boolean {
  if (!answerKey || answerKey.length !== 4) return false;
  const traineeTurns = transcript.filter((m) => m.role === "user").map((m) => m.content.trim()).filter(Boolean).slice(-4);
  if (traineeTurns.length !== 4) return false;
  return answerKey.every((expected, index) => answersAreEquivalent(traineeTurns[index], expected));
}

const buildAnswerKeyMatchedFeedback = (answerKey: string[]) => `**📊 Response-by-Response Score:**\n${answerKey.map((_, index) => `- Response ${index + 1}: 2.5/2.5, matched the recommended answer key for this module.`).join("\n")}\n\n**🏆 Why This Earned 10/10:**\n- The trainee used the recommended four-response answer key for this exact coaching module. I would not change this four-response set.\n\n**Perfect 4 Responses to Score 10/10:**\n${answerKey.map((response, index) => `${index + 1}. ${response}`).join("\n")}\n\n[SCORE:10/10] [EXERCISE_COMPLETE]`;

function deterministicScoreCap(moduleTitle: string, modulePrompt: string, transcript: TranscriptMessage[]): { cap: number; reasons: string[] } {
  const traineeTurns = transcript.filter((m) => m.role === "user").map((m) => m.content.trim()).filter(Boolean).slice(-4);
  const reasons: string[] = [];
  if (traineeTurns.length < 4) return { cap: 5, reasons: ["Fewer than four trainee responses were available to grade."] };
  const all = traineeTurns.join("\n").toLowerCase();
  const moduleContext = `${moduleTitle}\n${modulePrompt}`.toLowerCase();
  const lowEffortCount = traineeTurns.filter((turn) => {
    const lower = turn.toLowerCase().trim();
    return wordCount(turn) < 4
      || /\b(asdf|test|123|lol)\b/i.test(lower)
      || /^(ok|okay|yes|no)\.?$/i.test(lower)
      || /^[^a-z0-9]*$/i.test(turn)
      || /^(do you want more customers|would you like more leads|how is business|tell me about your business)\??$/i.test(lower);
  }).length;
  if (lowEffortCount >= 3) return { cap: 3, reasons: [`${lowEffortCount} of 4 responses were low-effort or gibberish.`] };
  if (lowEffortCount === 2) return { cap: 5, reasons: ["Two of the four responses were low-effort, so the session cannot be scored as strong."] };
  if (lowEffortCount === 1) reasons.push("One response was low-effort, which must reduce the final score.");

  let cap = lowEffortCount === 1 ? 8 : 10;
  const questionBased = moduleContext.includes("ask one question") || moduleContext.includes("ask her one question") || moduleContext.includes("ask one") || moduleContext.includes("question that");
  if (questionBased && !traineeTurns.some((turn) => turn.includes("?"))) {
    cap = Math.min(cap, 6);
    reasons.push("This module requires question-based execution, but no clear question was submitted.");
  }
  if ((moduleContext.includes("roi") || moduleContext.includes("299") || moduleContext.includes("price")) && !hasAny(all, [/\$\s?\d+/, /\d+\s*(new\s*)?(member|members|customer|customers|client|clients)/, /lifetime value|ltv|roi|return|pays? for|break even|investment/])) {
    cap = Math.min(cap, 7);
    reasons.push("The ROI/price module requires specific math or investment logic.");
  }
  if ((moduleContext.includes("6 steps") || moduleContext.includes("6-step")) && !hasAny(all, [/hear|understand|appreciate/]) && !hasAny(all, [/isolate|only concern|besides that/])) {
    cap = Math.min(cap, 6);
    reasons.push("The 6-step framework was not clearly executed.");
  }
  return { cap, reasons };
}

const JUDGE_SYSTEM = `You are an impartial, senior sales-coaching judge. You are NOT the coach who ran the session. Your only job is to read the trainee's 4 responses against the module objective and return a strict JSON object scoring the trainee's performance.

Hard rules:
- Score 0-10 integer only.
- Score the four trainee responses separately first. Each response is worth up to 2.5 points. The final score is the rounded sum of those four section scores.
- 10 = all four responses, taken together, fully execute the requested skill with specific, methodology-aligned, scenario-relevant phrasing usable on a real call.
- 5 = generic. Anyone could have said it. No methodology evidence.
- 1-2 = gibberish, keyboard mashing, off-topic, refusal to engage, single-word answers.
- Effort or exchange count is NOT worth points. Quality only.
- If the trainee uses recommended best-practice phrasing that fits the module, reward that section. Do not penalize script mastery, but do not give the whole session 10/10 unless all four responses earn it.
- Do NOT require quantified dollars unless the module is about ROI / price / pain quantification.
- Do NOT require named methodologies unless the module asks for a framework.
- Always generate exactly four perfect responses, and only in this final grading result.

Return JSON only matching: { "score": int 0-10, "verdict": "exceptional"|"strong"|"average"|"weak"|"poor", "reasoning": string under 600 chars quoting specific trainee phrases, "response_scores": [{"response": 1, "points": number 0-2.5, "reason": string}], "perfect_responses": [four ideal responses] }.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Require authenticated caller
  const authHeader = req.headers.get("Authorization") || "";
  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: `Bearer ${token}` } } },
  );
  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const { moduleTitle, modulePrompt, transcript, heuristicScore, answerKey } = parsed.data;

    if (responsesMatchAnswerKey(transcript, answerKey)) {
      return new Response(
        JSON.stringify({
          judge_score: 10,
          verdict: "exceptional",
          reasoning: "The trainee matched the recommended four-response answer key for this module.",
          heuristic_score: heuristicScore ?? null,
          final_score: 10,
          response_scores: answerKey!.map((_, index) => ({ response: index + 1, points: 2.5, reason: "Matched the recommended answer key." })),
          perfect_responses: answerKey,
          final_feedback: buildAnswerKeyMatchedFeedback(answerKey!),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const scoreCap = deterministicScoreCap(moduleTitle, modulePrompt, transcript);

    const traineeTurns = transcript
      .filter((m) => m.role === "user")
      .map((m, i) => `TRAINEE RESPONSE ${i + 1}:\n${m.content}`)
      .join("\n\n");

    const coachTurns = transcript
      .filter((m) => m.role !== "user")
      .map((m, i) => `COACH PROMPT ${i + 1}:\n${m.content}`)
      .join("\n\n");

    const userPrompt = `MODULE TITLE: ${moduleTitle}\n\nMODULE OBJECTIVE / PROMPT:\n${modulePrompt}\n\nDETERMINISTIC SCORE CAP: ${scoreCap.cap}/10\nCAP REASONS: ${scoreCap.reasons.length ? scoreCap.reasons.join(" ") : "No hard cap beyond the rubric."}\n\n${answerKey?.length === 4 ? `RECOMMENDED ANSWER KEY FROM PRIOR FEEDBACK:\n${answerKey.map((response, index) => `${index + 1}. ${response}`).join("\n")}\n\nIf a trainee response is substantially the same as its matching answer-key item, give that response full credit.\n\n` : ""}--- COACH PROMPTS ---\n${coachTurns}\n\n--- TRAINEE RESPONSES (these are what you grade) ---\n${traineeTurns}\n\nGrade exactly four trainee responses. Return JSON only.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: JUDGE_SYSTEM },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "rate_limited" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "credits_exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await resp.text();
      console.error("judge gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "judge_unavailable" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    let parsedJudge: unknown;
    try {
      parsedJudge = JSON.parse(raw);
    } catch {
      return new Response(JSON.stringify({ error: "judge_invalid_json" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const judge = JudgeSchema.safeParse(parsedJudge);
    if (!judge.success) {
      return new Response(JSON.stringify({ error: "judge_schema_invalid", detail: judge.error.flatten() }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cappedJudgeScore = Math.min(scoreCap.cap, judge.data.score);
    const finalScore = Math.max(0, Math.min(10, Math.round(cappedJudgeScore)));
    const responseScores = judge.data.response_scores
      .map((item) => `- Response ${item.response}: ${item.points}/2.5, ${item.reason}`)
      .join("\n");
    const perfectResponses = judge.data.perfect_responses
      .map((response, index) => `${index + 1}. ${response}`)
      .join("\n");
    const capNote = scoreCap.reasons.length
      ? `\n\n**Accuracy Guardrail Applied:**\n- ${scoreCap.reasons.join("\n- ")}`
      : "";
    const finalFeedback = `**📊 Response-by-Response Score:**\n${responseScores}${capNote}\n\n${finalScore === 10 ? "**🏆 Why This Earned 10/10:**" : `**📊 Why You Earned ${finalScore}/10:**`}\n- ${judge.data.reasoning}\n\n${finalScore < 10 ? "**🎯 How to Score 10/10 on a Retake:**\n- Compare each of your four answers to the model responses below and retake with the same structure, specificity, and scenario fit.\n\n" : ""}**Perfect 4 Responses to Score 10/10:**\n${perfectResponses}\n\n[SCORE:${finalScore}/10] [EXERCISE_COMPLETE]`;

    return new Response(
      JSON.stringify({
        judge_score: cappedJudgeScore,
        verdict: judge.data.verdict,
        reasoning: judge.data.reasoning,
        heuristic_score: heuristicScore ?? null,
        final_score: finalScore,
        response_scores: judge.data.response_scores,
        perfect_responses: judge.data.perfect_responses,
        final_feedback: finalFeedback,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("grade-coaching-final error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
