import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.99.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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
  const { data: isManager } = await userClient.rpc('has_role', {
    _user_id: userData.user.id,
    _role: 'manager',
  });
  if (!isManager) {
    return new Response(JSON.stringify({ error: "Forbidden: manager only" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { text, day_id, brand } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a training content generator for the Referrizer Academy. Given source material, generate structured training content. Return a JSON object with these fields:
- summary: A 500-word conversational daily briefing
- quiz_questions: Array of 10 objects with {question, options (4 strings), correct (index 0-3), explanation}
- action_items: Array of 5 key takeaways/action items
- script: A 2-minute executive script suitable for AI avatar narration

Brand context: ${brand || 'group'}, Day: ${day_id || 'general'}`
          },
          { role: "user", content: `Generate training content from this source material:\n\n${text}` }
        ],
        tools: [{
          type: "function",
          function: {
            name: "generate_training_content",
            description: "Generate structured training content from source material",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string", description: "500-word conversational daily briefing" },
                quiz_questions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      options: { type: "array", items: { type: "string" } },
                      correct: { type: "number" },
                      explanation: { type: "string" }
                    },
                    required: ["question", "options", "correct", "explanation"]
                  }
                },
                action_items: { type: "array", items: { type: "string" } },
                script: { type: "string", description: "2-minute executive narration script" }
              },
              required: ["summary", "quiz_questions", "action_items", "script"]
            }
          }
        }],
        tool_choice: { type: "function", function: { name: "generate_training_content" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("Content ingest error:", response.status, t);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let content;
    if (toolCall?.function?.arguments) {
      content = JSON.parse(toolCall.function.arguments);
    } else {
      content = { error: "Failed to generate structured content", raw: data };
    }

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("content-ingest error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
