import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamChat, type ChatMsg } from '@/lib/streamChat';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { COACHING_ANSWER_KEYS } from '@/data/coachingAnswerKeys';

const buildPerfectResponseFallback = (title: string, prompt: string) => `

**Perfect 4 Responses to Score 10/10:**
1. **Open with control and context:** "I appreciate you being direct. Before I recommend anything, I want to understand what is actually happening in your business around ${title.toLowerCase()}. What is the real issue behind this for you right now?"
2. **Diagnose the impact:** "When that problem shows up, what does it cost you in lost leads, repeat visits, reviews, referrals, or staff time over a normal month?"
3. **Reframe with value:** "That is exactly why I would not look at Referrizer as another marketing expense. If the system helps recover even one meaningful customer relationship or turns one happy customer into referrals, the investment starts paying for itself."
4. **Confirm the next step:** "If we can show you a clear path from this problem to measurable growth without adding manual work to your team, would it make sense to take the next step together?"

Module focus: ${prompt}`;

const stripFinalArtifacts = (content: string) => content
  .replace(/\[EXERCISE_COMPLETE\]/gi, '')
  .replace(/\[SCORE:\s*\d{1,2}\s*\/\s*10\]/gi, '')
  .replace(/\n{0,2}\*\*Perfect\s+4\s+Responses\s+to\s+Score\s+10\/10:\*\*[\s\S]*$/i, '')
  .replace(/\n{0,2}Perfect\s+4\s+Responses\s+to\s+Score\s+10\/10:[\s\S]*$/i, '')
  .trim();

const getPerfectResponseStorageKey = (moduleId?: string) => moduleId ? `rz_coaching_perfect_responses_${moduleId}` : null;

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

const answersAreEquivalent = (actual: string, expected: string) => {
  const actualText = normalizeAnswerText(actual);
  const expectedText = normalizeAnswerText(expected);
  if (!actualText || !expectedText) return false;
  if (actualText.length > 60 && expectedText.length > 60 && (actualText.includes(expectedText) || expectedText.includes(actualText))) return true;

  const actualSet = new Set(answerTokens(actualText));
  const expectedSet = new Set(answerTokens(expectedText));
  if (actualSet.size < 8 || expectedSet.size < 8) return false;
  let overlap = 0;
  actualSet.forEach((token) => { if (expectedSet.has(token)) overlap += 1; });
  const smallerCoverage = overlap / Math.min(actualSet.size, expectedSet.size);
  const expectedCoverage = overlap / expectedSet.size;
  return smallerCoverage >= 0.84 && expectedCoverage >= 0.55;
};

const responsesMatchAnswerKey = (responses: string[], answerKey: string[] | null) => {
  if (!answerKey || answerKey.length !== 4 || responses.length < 4) return false;
  const latestResponses = responses.slice(-4);
  return answerKey.every((expected, index) => answersAreEquivalent(latestResponses[index], expected));
};

const getStoredPerfectResponses = (moduleId?: string): string[] | null => {
  const key = getPerfectResponseStorageKey(moduleId);
  if (!key || typeof window === 'undefined') return null;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || 'null');
    return Array.isArray(parsed) && parsed.length === 4 && parsed.every((item) => typeof item === 'string') ? parsed : null;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
};

const savePerfectResponses = (moduleId: string | undefined, responses: string[] | null) => {
  const key = getPerfectResponseStorageKey(moduleId);
  if (!key || !responses || responses.length !== 4 || typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(responses));
};

const extractPerfectResponses = (content: string): string[] | null => {
  const marker = content.search(/Perfect\s+4\s+Responses\s+to\s+Score\s+10\/10:?/i);
  if (marker < 0) return null;
  const responses: string[] = [];
  let current = '';
  const lines = content.slice(marker).split('\n').slice(1);
  for (const line of lines) {
    if (/\[SCORE:|\[EXERCISE_COMPLETE\]/i.test(line)) break;
    const numbered = line.match(/^\s*(?:[-*]\s*)?(\d)[.)]\s*(.+)$/);
    if (numbered && Number(numbered[1]) >= 1 && Number(numbered[1]) <= 4) {
      if (current.trim()) responses.push(current.trim());
      current = numbered[2].trim();
    } else if (current && line.trim()) {
      current += ` ${line.trim()}`;
    }
  }
  if (current.trim()) responses.push(current.trim());
  return responses.length === 4 ? responses : null;
};

const buildAnswerKeyMatchedFeedback = (answerKey: string[]) => `**📊 Response-by-Response Score:**
- Response 1: 2.5/2.5, matched the recommended answer key for this module.
- Response 2: 2.5/2.5, matched the recommended answer key for this module.
- Response 3: 2.5/2.5, matched the recommended answer key for this module.
- Response 4: 2.5/2.5, matched the recommended answer key for this module.

**🏆 Why This Earned 10/10:**
- You used the exact recommended four-response structure for this coaching module. I would not change this four-response set.

**Perfect 4 Responses to Score 10/10:**
${answerKey.map((response, index) => `${index + 1}. ${response}`).join('\n')}

[SCORE:10/10] [EXERCISE_COMPLETE]`;

interface CoachChatModuleProps {
  moduleId?: string;
  prompt: string;
  title: string;
  onComplete: () => void;
  onScore?: (score: { correct: number; total: number }, markCompleted?: boolean) => void | Promise<void>;
}

export function CoachChatModule({ moduleId, prompt, title, onComplete, onScore }: CoachChatModuleProps) {
  const [messages, setMessages] = useState<{ role: 'coach' | 'user'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);
  const [userTurnCount, setUserTurnCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const perfectResponseKeyRef = useRef<string[] | null>(moduleId ? COACHING_ANSWER_KEYS[moduleId] ?? getStoredPerfectResponses(moduleId) : null);

  const moduleGuidance = `\n\nMODULE-SPECIFIC GRADING CONTEXT:\n- Module title: ${title}\n- Module prompt: ${prompt}\n- Grade only the skill requested by this module.\n- The trainee MUST be allowed to complete exactly 4 trainee responses before final scoring. One wrong answer, gibberish answer, or weak answer must NEVER end the coaching session early.\n- For trainee responses 1-3, coach the answer briefly, then ask the next scenario-specific prompt. Do NOT include [SCORE:X/10], [EXERCISE_COMPLETE], or the "Perfect 4 Responses to Score 10/10" section before response 4.\n- After trainee response 4, grade all 4 trainee responses as four separate sections that each contribute to the final 10-point score. One strong response cannot turn the whole session into 10/10.\n- After response 4 only, give final feedback, include the final score, and include a section titled "Perfect 4 Responses to Score 10/10" with four numbered ideal responses tailored to this module.\n- A 10/10 requires all four trainee responses, taken together, to fully satisfy this prompt with specific, usable phrasing.\n- If the trainee uses recommended/perfect phrasing from a prior attempt and it fits the exact prompt, reward it, but still score the full four-response session accurately rather than automatically giving 10/10.`;

  // Silent persistence — saves the transcript + score so it can never be lost,
  // but does NOT mark the day complete and does NOT navigate. The student must
  // press the Continue button to advance.
  const persistScore = async (markCompleted = false) => {
    let transcriptSaved = false;
    let scoreSaved = false;
    if (finalScore == null) return { transcriptSaved, scoreSaved };
    if (moduleId) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.from('coaching_transcripts').insert({
            user_id: user.id,
            module_id: moduleId,
            transcript: messages as any,
            score: finalScore,
            verdict: finalScore >= 8 ? 'pass' : finalScore >= 5 ? 'partial' : 'fail',
          });
          if (error) throw error;
          transcriptSaved = true;
        }
      } catch (err) {
        console.warn('Transcript cache failed (non-fatal):', err);
      }
    }
    if (onScore) {
      try {
        await onScore({ correct: finalScore, total: 10 }, markCompleted);
        scoreSaved = true;
      } catch (err) {
        console.warn('Progress score save failed:', err);
      }
    }
    return { transcriptSaved, scoreSaved };
  };

  const handleFinish = async () => {
    if (completed || saving || finalScore == null) return;
    setSaving(true);
    try {
      const { transcriptSaved, scoreSaved } = await persistScore(true);
      if (!transcriptSaved && !scoreSaved && !autoSaved) {
        toast({
          title: 'Score not saved',
          description: 'Please try Continue again. Your score has not been marked complete yet.',
          variant: 'destructive',
        });
        return;
      }
      setCompleted(true);
      onComplete();
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [messages]);

  // Auto-PERSIST the score the moment coaching finalizes so it's never lost,
  // even if the student closes the tab. This does NOT mark the module complete
  // or navigate — the student must still press the Continue button below.
  useEffect(() => {
    if (isFinished && finalScore != null && !autoSaved && !saving) {
      (async () => {
        setSaving(true);
        try {
          const { transcriptSaved, scoreSaved } = await persistScore(false);
          if (transcriptSaved || scoreSaved) setAutoSaved(true);
        } finally {
          setSaving(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, finalScore]);


  // Start with coach prompt
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    setIsTyping(true);
    let content = "";

    streamChat({
      messages: [{ role: 'user', content: `Start this coaching exercise. The scenario prompt is: "${prompt}". Introduce the scenario and ask the Account Executive to respond.` }],
      mode: "demo-coach",
      context: moduleGuidance,
      onDelta: (chunk) => {
        content += chunk;
        setMessages([{ role: 'coach', content }]);
      },
      onDone: () => {
        setIsTyping(false);
        setExchangeCount(1);
      },
      onError: (err) => {
        toast({ title: 'AI Error', description: err, variant: 'destructive' });
        setIsTyping(false);
        setMessages([{ role: 'coach', content: prompt }]);
        setExchangeCount(1);
      },
    }).catch(() => {
      setIsTyping(false);
      setMessages([{ role: 'coach', content: prompt }]);
      setExchangeCount(1);
    });
  }, [prompt, moduleGuidance]);

  const handleSend = async () => {
    if (!input.trim() || isTyping || isFinished) return;

    const userMsg = input.trim();
    setInput('');
    const updated = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(updated);
    setIsTyping(true);

    const newUserTurnCount = userTurnCount + 1;
    const chatHistory: ChatMsg[] = updated.map(m => ({
      role: m.role === 'coach' ? 'assistant' as const : 'user' as const,
      content: m.content,
    }));

    let content = "";
    const newCount = exchangeCount + 1;

    try {
      await streamChat({
        messages: chatHistory,
        mode: "demo-coach",
        context: `${moduleGuidance}\n\nSESSION PROGRESS: The trainee has now submitted response ${newUserTurnCount} of 4. ${newUserTurnCount < 4 ? 'Do not finalize. Coach this response and ask for the next response.' : 'Finalize now with the score and the Perfect 4 Responses to Score 10/10 section.'}`,
        onDelta: (chunk) => {
          content += chunk;
          setMessages([...updated, { role: 'coach', content }]);
        },
        onDone: async () => {
          setIsTyping(false);
          setExchangeCount(newCount);
          setUserTurnCount(newUserTurnCount);

          const hasCompleteTag = content.includes('[EXERCISE_COMPLETE]');

          // BEFORE response 4 — only act if the model tried to finalize early.
          if (newUserTurnCount < 4) {
            if (hasCompleteTag) {
              const cleaned = stripFinalArtifacts(content);
              setMessages([...updated, {
                role: 'coach',
                content: `${cleaned}\n\nLet's keep going. Give me response ${newUserTurnCount + 1} of 4 before I score the full coaching session.`,
              }]);
            }
            return;
          }

          // AFTER response 4 — ALWAYS finalize, even if the LLM forgot
          // [EXERCISE_COMPLETE]. This is the critical save path; never leave the
          // student stuck without a Finish button.
          let scoreVal: number | null = null;
          const strict = content.match(/\[SCORE:\s*(\d{1,2})\s*\/\s*10\]/i);
          if (strict) scoreVal = parseInt(strict[1], 10);
          if (scoreVal == null) {
            const loose = content.match(/score[^0-9]{0,15}(\d{1,2})\s*\/\s*10/i);
            if (loose) scoreVal = parseInt(loose[1], 10);
          }
          if (scoreVal == null) {
            const any10 = content.match(/\b(\d{1,2})\s*\/\s*10\b/);
            if (any10) scoreVal = parseInt(any10[1], 10);
          }
          // Final safety net — default to a passing partial so the student is
          // NEVER stuck. The LLM judge below can still raise it.
          if (scoreVal == null || isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
            scoreVal = 6;
          }

          if (!/Perfect\s+4\s+Responses\s+to\s+Score\s+10\/10/i.test(content)) {
            const answerKey = perfectResponseKeyRef.current;
            content += answerKey ? `\n\n**Perfect 4 Responses to Score 10/10:**\n${answerKey.map((response, index) => `${index + 1}. ${response}`).join('\n')}` : buildPerfectResponseFallback(title, prompt);
            setMessages([...updated, { role: 'coach', content }]);
          }

          const traineeResponses = updated.filter((m) => m.role === 'user').map((m) => m.content);
          let finalReconciled = scoreVal;
          const existingAnswerKey = perfectResponseKeyRef.current;

          if (responsesMatchAnswerKey(traineeResponses, existingAnswerKey)) {
            finalReconciled = 10;
            content = buildAnswerKeyMatchedFeedback(existingAnswerKey!);
            setMessages([...updated, { role: 'coach', content }]);
          } else {
            // LLM-as-judge with hard 8s timeout so a slow/down judge can never
            // block the save flow.
            try {
              const transcriptPayload = [...updated, { role: 'coach' as const, content }].map((m) => ({
                role: m.role === 'coach' ? ('assistant' as const) : ('user' as const),
                content: m.content,
              }));
              const judgePromise = supabase.functions.invoke('grade-coaching-final', {
                body: {
                  moduleTitle: title,
                  modulePrompt: prompt,
                  transcript: transcriptPayload,
                  heuristicScore: scoreVal,
                  answerKey: existingAnswerKey,
                },
              });
              const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
                setTimeout(() => resolve({ data: null, error: new Error('judge timeout') }), 8000),
              );
              const { data: judgeData, error: judgeErr } = (await Promise.race([
                judgePromise,
                timeoutPromise,
              ])) as { data: any; error: any };
              if (!judgeErr && judgeData && typeof judgeData.final_score === 'number') {
                finalReconciled = Math.max(0, Math.min(10, Math.round(judgeData.final_score)));
                if (typeof judgeData.final_feedback === 'string' && judgeData.final_feedback.trim()) {
                  content = judgeData.final_feedback.trim();
                  if (!/Perfect\s+4\s+Responses\s+to\s+Score\s+10\/10/i.test(content)) {
                    content += buildPerfectResponseFallback(title, prompt);
                  }
                  if (!/\[SCORE:\s*\d{1,2}\s*\/\s*10\]/i.test(content)) {
                    content += `\n\n[SCORE:${finalReconciled}/10] [EXERCISE_COMPLETE]`;
                  }
                  setMessages([...updated, { role: 'coach', content }]);
                }
              }
            } catch (judgeException) {
              console.warn('[coaching judge] fell back to heuristic:', judgeException);
            }
          }

          const generatedAnswerKey = extractPerfectResponses(content);
          if (generatedAnswerKey && !(moduleId && COACHING_ANSWER_KEYS[moduleId])) {
            perfectResponseKeyRef.current = generatedAnswerKey;
            savePerfectResponses(moduleId, generatedAnswerKey);
          }

          setIsFinished(true);
          setFinalScore(finalReconciled);
        },
        onError: (err) => {
          toast({ title: 'AI Error', description: err, variant: 'destructive' });
          setIsTyping(false);
        },
      });
    } catch {
      setIsTyping(false);
      toast({ title: 'Connection Error', description: 'Failed to reach the coach. Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="card-surface overflow-hidden flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-5 flex items-center gap-4 shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center border-2 border-white/20 shadow-lg">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            Sales Coach <Bot size={14} className="text-blue-300" />
          </h3>
          <p className="text-white/50 text-xs">{title}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-white/40 text-xs font-semibold">
            {isFinished ? 'Complete ✓' : `Exchange ${exchangeCount}`}
          </p>
        </div>
      </div>

      {/* Messages — aria-live so screen readers announce streaming coach replies */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin" aria-live="polite" aria-atomic="false" role="log">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'coach'
                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                : 'bg-primary text-primary-foreground'
            }`}>
              {msg.role === 'coach' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'coach'
                ? 'bg-secondary text-foreground rounded-tl-sm'
                : 'bg-primary text-primary-foreground rounded-tr-sm'
            }`}>
              {msg.role === 'coach' ? (
                <div className="prose prose-sm max-w-none [&>p]:m-0">
                  <ReactMarkdown>{msg.content.replace(/\[EXERCISE_COMPLETE\]/gi, '').replace(/\[SCORE:\s*\d+\s*\/\s*10\]/gi, '')}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-secondary px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
              <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input or Finish CTA */}
      <div className="p-4 border-t border-border shrink-0">
        {isFinished ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1 text-sm">
              <p className="font-bold text-foreground">
                Coaching complete — Final score: {finalScore}/10
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {autoSaved
                  ? 'Your score is saved. Review the feedback above, then press Continue when you are ready.'
                  : "Review the coach's feedback above, then continue when you're ready."}
              </p>
            </div>
            <button
              onClick={handleFinish}
              disabled={completed || saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
            >
              {completed ? 'Continuing…' : saving ? 'Saving…' : 'Continue to next module'}
            </button>
          </div>
        ) : (
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your response..."
              disabled={isTyping}
              className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              aria-label="Send response"
              className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Send size={18} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
