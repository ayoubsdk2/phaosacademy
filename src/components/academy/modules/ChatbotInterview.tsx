import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, User, Bot, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import confetti from 'canvas-confetti';
import { streamChat, type ChatMsg } from '@/lib/streamChat';
import { toast } from '@/hooks/use-toast';

interface Message {
  role: 'ceo' | 'user';
  content: string;
}

export function ChatbotInterview({ onComplete }: { onComplete: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    return () => { try { confetti.reset(); } catch {} };
  }, []);

  // Start interview with AI
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    setIsTyping(true);
    let assistantContent = "";

    streamChat({
      messages: [],
      mode: "ceo-interview",
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages([{ role: 'ceo', content: assistantContent }]);
      },
      onDone: () => {
        setIsTyping(false);
        setQuestionCount(1);
      },
      onError: (err) => {
        toast({ title: 'AI Error', description: err, variant: 'destructive' });
        setIsTyping(false);
        // Fallback to hardcoded first question
        setMessages([{ role: 'ceo', content: "Welcome to your final interview. I'm Andre Cvijovic, CEO of Referrizer. Let's start: Tell me, in your own words, what is the 'Ultimate Marketing Loop' and why does it matter for local businesses?" }]);
        setQuestionCount(1);
      }
    });
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isTyping || isFinished) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setIsTyping(true);

    // Convert to ChatMsg format for AI
    const chatHistory: ChatMsg[] = updatedMessages.map(m => ({
      role: m.role === 'ceo' ? 'assistant' as const : 'user' as const,
      content: m.content,
    }));

    let assistantContent = "";
    const newQ = questionCount + 1;

    await streamChat({
      messages: chatHistory,
      mode: "ceo-interview",
      onDelta: (chunk) => {
        assistantContent += chunk;
        setMessages([...updatedMessages, { role: 'ceo', content: assistantContent }]);
      },
      onDone: () => {
        setIsTyping(false);
        setQuestionCount(newQ);

        // After 5 user responses (questions + final assessment)
        if (newQ > 5) {
          setIsFinished(true);
          confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 }, colors: ['#3b82f6', '#2563eb', '#22c55e', '#f97316'] });
          onComplete();
        }
      },
      onError: (err) => {
        toast({ title: 'AI Error', description: err, variant: 'destructive' });
        setIsTyping(false);
      }
    });
  };

  return (
    <div className="card-surface overflow-hidden flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-5 flex items-center gap-4 shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center border-2 border-white/20 shadow-lg">
          <User size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold flex items-center gap-2">
            Andre Cvijovic <Sparkles size={14} className="text-yellow-400" />
          </h3>
          <p className="text-white/50 text-xs">CEO, Referrizer • AI Interview</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-white/40 text-xs font-semibold">Question {Math.min(questionCount, 5)} of 5</p>
          <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-brand-referrizer rounded-full transition-all duration-500"
              style={{ width: `${(Math.min(questionCount, 5) / 5) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'ceo'
                ? 'bg-gradient-to-br from-violet-500 to-blue-600 text-white'
                : 'bg-primary text-primary-foreground'
            }`}>
              {msg.role === 'ceo' ? <Bot size={16} /> : <User size={16} />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'ceo'
                ? 'bg-secondary text-foreground rounded-tl-sm'
                : 'bg-primary text-primary-foreground rounded-tr-sm'
            }`}>
              {msg.role === 'ceo' ? (
                <div className="prose prose-sm max-w-none [&>p]:m-0">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
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

      {/* Input */}
      <div className="p-4 border-t border-border shrink-0">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={isFinished ? "Interview complete! 🎓" : "Type your response to the CEO..."}
            disabled={isFinished || isTyping}
            className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-primary outline-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isFinished || isTyping}
            className="bg-primary hover:bg-primary-hover text-primary-foreground p-3 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
