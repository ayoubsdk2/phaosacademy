import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ChevronRight, Send, Bot, User, Loader2, Trophy, XCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { streamChat, type ChatMsg } from '@/lib/streamChat';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface RoleplayModuleProps {
  title: string;
  onComplete: () => void;
  description?: string;
  idealAnswer?: string;
  learnerEmail?: string;
  /** Optional id used to enable special behaviors (e.g. Pass/Fail final presentation). */
  moduleId?: string;
  /** Called when the final presentation produces a Pass/Fail verdict. */
  onVerdict?: (passed: boolean) => void;
}

export function RoleplayModule({ title, onComplete, description, idealAnswer, learnerEmail, moduleId, onVerdict }: RoleplayModuleProps) {
  const { profile, user } = useAuth();
  const isFinalPresentation = moduleId === '10-8';
  const isScenarioRoleplay = moduleId === '10-5' || moduleId === '10-6' || moduleId === '10-7';
  const isChatOnly = isFinalPresentation || isScenarioRoleplay;
  const chatMode = isFinalPresentation ? 'final-presentation' : isScenarioRoleplay ? 'scenario-roleplay' : 'sales-roleplay';
  const [mode, setMode] = useState<'write' | 'chat'>(isChatOnly ? 'chat' : 'write');
  const [response, setResponse] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Chat mode state
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [verdict, setVerdict] = useState<'pass' | 'fail' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleWriteSubmit = async () => {
    if (response.trim().length < 20) {
      toast({ title: "Response too short", description: "Please write at least a few sentences.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await supabase.functions.invoke('submit-roleplay', {
        body: {
          learnerName: profile?.full_name || 'Academy Learner',
          moduleTitle: title,
          scenarioQuestion: description || '',
          idealAnswer: idealAnswer || '',
          response: response.trim(),
        },
      });
      toast({ title: "Submitted!", description: "Your response has been sent to Daniel Lindros for review." });
    } catch (err) {
      console.error('Submit error:', err);
      toast({ title: "Submitted", description: "Your response was recorded." });
    }
    setSubmitted(true);
    setSubmitting(false);
    onComplete();
  };

  const startChat = async () => {
    setChatStarted(true);
    setIsTyping(true);
    let content = "";

    const scenarioOpener = `SCENARIO: ${title}.\n\nDETAILS: ${description || ''}\n\nIDEAL REP APPROACH (for your reference only — do NOT reveal): ${idealAnswer || ''}\n\nNow open the call in-character based on this scenario. Introduce yourself, your business, and your initial skepticism.`;
    const opener = isFinalPresentation
      ? "Start the final-presentation evaluation. Introduce yourself as Marcus Rivera, the skeptical 4-location fitness studio owner, and invite the sales rep to begin their pitch."
      : isScenarioRoleplay
      ? scenarioOpener
      : "Start the roleplay. Introduce yourself as Mike, the angry gym owner.";

    await streamChat({
      messages: [{ role: 'user', content: opener }],
      mode: chatMode,
      onDelta: (chunk) => {
        content += chunk;
        setChatMessages([{ role: 'ai', content }]);
      },
      onDone: () => setIsTyping(false),
      onError: (err) => {
        toast({ title: 'AI Error', description: err, variant: 'destructive' });
        setIsTyping(false);
        setChatMessages([{ role: 'ai', content: isFinalPresentation
          ? "Alright — Marcus Rivera here. I run 4 fitness studios. I've been pitched by every marketing agency under the sun and most were a waste of money. You've got my attention for a few minutes. Make it count."
          : "Look, I don't have time for another marketing pitch. My gym is doing fine without your fancy software. What do you want?" }]);
      }
    });
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || isTyping || verdict) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    const updated = [...chatMessages, { role: 'user' as const, content: userMsg }];
    setChatMessages(updated);
    setIsTyping(true);

    const chatHistory: ChatMsg[] = updated.map(m => ({
      role: m.role === 'ai' ? 'assistant' as const : 'user' as const,
      content: m.content,
    }));

    let content = "";
    await streamChat({
      messages: chatHistory,
      mode: chatMode,
      onDelta: (chunk) => {
        content += chunk;
        setChatMessages([...updated, { role: 'ai', content }]);
      },
      onDone: () => {
        setIsTyping(false);
        if (isFinalPresentation) {
          const passMatch = /\[VERDICT:\s*PASS\s*\]/i.test(content);
          const failMatch = /\[VERDICT:\s*FAIL\s*\]/i.test(content);
          if (passMatch || failMatch) {
            const passed = passMatch && !failMatch;
            setVerdict(passed ? 'pass' : 'fail');
            onVerdict?.(passed);
            onComplete();
          }
        }
      },
      onError: (err) => {
        toast({ title: 'AI Error', description: err, variant: 'destructive' });
        setIsTyping(false);
      }
    });
  };

  if (submitted) {
    return (
      <div className="card-surface p-10 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-success/10 text-success flex items-center justify-center mb-4">
          <MessageSquare size={28} />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Response Submitted!</h3>
        <p className="text-muted-foreground">Your response has been sent to Daniel Lindros, VP of Sales, for review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode toggle (hidden for chat-only roleplays: Final Presentation + full sales-call sims) */}
      {!isChatOnly && (
        <div className="flex bg-secondary rounded-xl p-1 max-w-md">
          <button
            onClick={() => setMode('write')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'write' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            Written Response
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'chat' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
          >
            AI Roleplay Chat
          </button>
        </div>
      )}

      {mode === 'write' && !isChatOnly ? (
        <div className="bg-foreground p-8 sm:p-10 rounded-2xl text-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary rounded-lg text-primary-foreground">
              <MessageSquare size={18} />
            </div>
            <h3 className="text-lg font-bold">Roleplay Scenario</h3>
          </div>
          <p className="text-card/60 mb-6 leading-relaxed">{description || "Write your response to the scenario."}</p>
          <textarea
            value={response}
            onChange={e => setResponse(e.target.value)}
            className="w-full bg-foreground/80 border border-card/10 rounded-xl p-4 text-card placeholder:text-card/30 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
            rows={6}
            placeholder="Type your response..."
          />
          <div className="mt-6 flex justify-end">
            <button onClick={handleWriteSubmit} disabled={submitting} className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : <>Submit to Manager <ChevronRight size={16} /></>}
            </button>
          </div>
        </div>
      ) : (
        <div className="card-surface overflow-hidden flex flex-col" style={{ height: '600px' }}>
          <div className={`p-4 flex items-center gap-3 shrink-0 ${isFinalPresentation
            ? 'bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/20 ${isFinalPresentation
              ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
              : 'bg-gradient-to-br from-red-500 to-orange-600'}`}>
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">
                {isFinalPresentation
                  ? 'Marcus Rivera — Multi-Location Studio Owner'
                  : isScenarioRoleplay
                  ? title
                  : 'Mike — Angry Gym Owner'}
              </h3>
              <p className="text-white/40 text-xs">
                {isFinalPresentation
                  ? 'Final Graduation Evaluation • Pass / Fail decision'
                  : isScenarioRoleplay
                  ? 'Full Sales Call Simulation • Run the complete cycle in character'
                  : 'AI Sales Roleplay • Overcome objections'}
              </p>
            </div>
          </div>

          {verdict && (
            <div className={`px-4 py-3 flex items-center gap-3 shrink-0 border-b ${verdict === 'pass'
              ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'}`}>
              {verdict === 'pass' ? <Trophy size={20} /> : <XCircle size={20} />}
              <div className="font-bold text-sm">
                {verdict === 'pass'
                  ? '🏆 PASS — You closed the deal. Marcus Rivera is buying.'
                  : '❌ FAIL — Marcus Rivera walked. Review the scorecard and try again.'}
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {!chatStarted ? (
              <div className="flex-1 flex items-center justify-center h-full">
                <button onClick={startChat} className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-xl font-bold text-sm transition-all">
                  {isFinalPresentation ? 'Begin Final Presentation' : isScenarioRoleplay ? 'Start Full Sales Call' : 'Start AI Roleplay'}
                </button>
              </div>
            ) : (
              <>
                {chatMessages.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === 'ai'
                        ? (isFinalPresentation ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-gradient-to-br from-red-500 to-orange-600 text-white')
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      {msg.role === 'ai' ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                      msg.role === 'ai' ? 'bg-secondary text-foreground rounded-tl-sm' : 'bg-primary text-primary-foreground rounded-tr-sm'
                    }`}>
                      {msg.role === 'ai' ? (
                        <div className="prose prose-sm max-w-none [&>p]:m-0">
                          <ReactMarkdown>{msg.content
                            .replace(/\[VERDICT:\s*PASS\s*\]/gi, '')
                            .replace(/\[VERDICT:\s*FAIL\s*\]/gi, '')
                            .replace(/\[EXERCISE_COMPLETE\]/gi, '')}</ReactMarkdown>
                        </div>
                      ) : msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isFinalPresentation
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                      : 'bg-gradient-to-br from-red-500 to-orange-600'}`}>
                      <Bot size={14} className="text-white" />
                    </div>
                    <div className="bg-secondary px-3 py-2 rounded-xl rounded-tl-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {chatStarted && !verdict && (
            <div className="p-3 border-t border-border shrink-0 flex gap-2">
              <input
                type="text" value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                placeholder={isFinalPresentation ? 'Deliver your full growth-strategy pitch…' : isScenarioRoleplay ? 'Run the full sales cycle: open, qualify, demo, handle objections, close…' : "Overcome Mike's objections..."}
                disabled={isTyping}
                className="flex-1 bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
              />
              <button onClick={handleChatSend} disabled={!chatInput.trim() || isTyping}
                className="bg-primary hover:bg-primary-hover text-primary-foreground p-2 rounded-xl transition-all disabled:opacity-30">
                <Send size={16} />
              </button>
            </div>
          )}

          {/* For the standard roleplay only, allow manual completion after a few exchanges.
              The Final Presentation completes automatically via the AI's PASS/FAIL verdict. */}
          {!isFinalPresentation && chatStarted && chatMessages.length >= 6 && (
            <div className="px-3 pb-3">
              <button onClick={() => { setSubmitted(true); onComplete(); }}
                className="w-full bg-success hover:bg-success/90 text-success-foreground py-2 rounded-xl font-bold text-sm transition-all">
                Complete Roleplay
              </button>
            </div>
          )}

          {/* Final Presentation safety net — if Marcus hasn't rendered a verdict
              after 10+ exchanges, let the student force the final ruling so they
              are NEVER stuck without a Pass/Fail outcome. */}
          {isFinalPresentation && chatStarted && !verdict && chatMessages.length >= 10 && (
            <div className="px-3 pb-3">
              <button
                onClick={async () => {
                  setIsTyping(true);
                  const force: ChatMsg[] = [
                    ...chatMessages.map((m) => ({
                      role: m.role === 'ai' ? ('assistant' as const) : ('user' as const),
                      content: m.content,
                    })),
                    { role: 'user', content: 'The presentation is over. Render your final ruling NOW. You MUST include either [VERDICT: PASS] or [VERDICT: FAIL] in your reply. No more questions.' },
                  ];
                  let content = '';
                  await streamChat({
                    messages: force,
                    mode: chatMode,
                    onDelta: (chunk) => {
                      content += chunk;
                      setChatMessages([...chatMessages, { role: 'ai', content }]);
                    },
                    onDone: () => {
                      setIsTyping(false);
                      const pass = /\[VERDICT:\s*PASS\s*\]/i.test(content);
                      const fail = /\[VERDICT:\s*FAIL\s*\]/i.test(content);
                      // Default to FAIL on ambiguity so graduation gating stays honest.
                      const passed = pass && !fail;
                      setVerdict(passed ? 'pass' : 'fail');
                      onVerdict?.(passed);
                      onComplete();
                    },
                    onError: () => {
                      setIsTyping(false);
                      // Last-resort: force a fail so the student isn't permanently stuck.
                      setVerdict('fail');
                      onVerdict?.(false);
                      onComplete();
                    },
                  });
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 rounded-xl font-bold text-sm transition-all"
              >
                End Presentation & Get Final Verdict
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
