import { useState, useCallback, useEffect, useRef } from 'react';
import { MessageSquare, CheckCircle2, RefreshCw } from 'lucide-react';
import { REVIEW_QUESTIONS, type ReviewQuestion } from '@/data/reviewQuestions';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

const CELEBRATION_EMOJIS = ['🎉', '🔥', '🚀', '⭐', '💪', '🏆', '🎯', '👏', '💥', '✨', '🎊', '🥇'];

interface ReviewModuleProps {
  moduleId: string;
  onComplete: (score: { correct: number; total: number }) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type FeedbackState = 'idle' | 'correct' | 'incorrect' | 'transitioning';

export function ReviewModule({ moduleId, onComplete }: ReviewModuleProps) {
  const [retakeKey, setRetakeKey] = useState(0);

  return (
    <ReviewModuleInner
      key={retakeKey}
      moduleId={moduleId}
      onComplete={onComplete}
      onRetake={() => setRetakeKey(k => k + 1)}
    />
  );
}

function EmojiRain({ duration }: { duration: number }) {
  const [emojis, setEmojis] = useState<{ id: number; emoji: string; left: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const items = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * duration * 0.8,
      size: 20 + Math.random() * 24,
    }));
    setEmojis(items);
  }, [duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {emojis.map(e => (
        <span
          key={e.id}
          className="absolute animate-[emojifall_3s_ease-in_forwards]"
          style={{
            left: `${e.left}%`,
            top: '-40px',
            fontSize: `${e.size}px`,
            animationDelay: `${e.delay}s`,
          }}
        >
          {e.emoji}
        </span>
      ))}
    </div>
  );
}

function ScreenFlash({ duration }: { duration: number }) {
  const [flashes, setFlashes] = useState<{ id: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    const colors = [
      'rgba(59,130,246,0.15)', 'rgba(34,197,94,0.15)', 'rgba(250,204,21,0.15)',
      'rgba(239,68,68,0.15)', 'rgba(168,85,247,0.15)', 'rgba(236,72,153,0.15)',
    ];
    const items = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      delay: i * 0.5,
    }));
    setFlashes(items);
  }, [duration]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {flashes.map(f => (
        <div
          key={f.id}
          className="absolute inset-0 animate-[screenflash_0.5s_ease-in-out_forwards]"
          style={{ backgroundColor: f.color, animationDelay: `${f.delay}s`, opacity: 0 }}
        />
      ))}
    </div>
  );
}

function ReviewModuleInner({ moduleId, onComplete, onRetake }: ReviewModuleProps & { onRetake: () => void }) {
  const allQuestions = REVIEW_QUESTIONS[moduleId] || [];

  const [questionPool] = useState<ReviewQuestion[]>(() => shuffleArray(allQuestions));
  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAsked, setTotalAsked] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [passed, setPassed] = useState(false);
  const [showExplanation, setShowExplanation] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const confettiInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (confettiInterval.current) clearInterval(confettiInterval.current);
      try { confetti.reset(); } catch {}
    };
  }, []);

  const currentQ = questionPool[currentQIdx % questionPool.length];
  const REQUIRED_CORRECT = 3;

  // Particle explosion effect for correct answers
  const triggerExplosion = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    // Green explosion burst
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { x, y },
      colors: ['#22c55e', '#4ade80', '#86efac', '#16a34a', '#15803d'],
      startVelocity: 35,
      gravity: 0.8,
      scalar: 1.1,
      ticks: 80,
    });

    // Second wave
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 140,
        origin: { x, y },
        colors: ['#22c55e', '#bbf7d0', '#dcfce7'],
        startVelocity: 20,
        gravity: 1,
        scalar: 0.8,
        ticks: 60,
      });
    }, 150);
  }, []);

  const launchMegaCelebration = useCallback(() => {
    setShowCelebration(true);
    const end = Date.now() + 10000;
    confettiInterval.current = setInterval(() => {
      if (Date.now() > end) {
        if (confettiInterval.current) clearInterval(confettiInterval.current);
        return;
      }
      confetti({
        particleCount: Math.floor(Math.random() * 80) + 40,
        spread: Math.random() * 100 + 60,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
        colors: ['#3b82f6', '#22c55e', '#facc15', '#ef4444', '#a855f7', '#ec4899', '#f97316'],
        startVelocity: 30 + Math.random() * 30,
        gravity: 0.8 + Math.random() * 0.5,
        scalar: 0.9 + Math.random() * 0.4,
      });
    }, 200);
    setTimeout(() => setShowCelebration(false), 10500);
  }, []);

  const handleSubmit = useCallback(() => {
    if (selected === null || !currentQ) return;

    const isCorrect = selected === currentQ.correct;
    const newCorrect = isCorrect ? correctCount + 1 : correctCount;
    const newTotal = totalAsked + 1;

    setCorrectCount(newCorrect);
    setTotalAsked(newTotal);
    setShowExplanation(
      isCorrect
        ? currentQ.explanation
        : `The answer is: ${currentQ.options[currentQ.correct]}. ${currentQ.explanation}`
    );

    if (isCorrect) {
      setFeedback('correct');
      triggerExplosion();

      setTimeout(() => {
        if (newCorrect >= REQUIRED_CORRECT) {
          setPassed(true);
          launchMegaCelebration();
          onComplete({ correct: REQUIRED_CORRECT, total: newTotal });
        } else {
          setFeedback('transitioning');
          setTimeout(() => {
            setCurrentQIdx(prev => prev + 1);
            setSelected(null);
            setFeedback('idle');
            setShowExplanation('');
          }, 300);
        }
      }, 1800);
    } else {
      setFeedback('incorrect');

      setTimeout(() => {
        setFeedback('transitioning');
        setTimeout(() => {
          setCurrentQIdx(prev => prev + 1);
          setSelected(null);
          setFeedback('idle');
          setShowExplanation('');
        }, 300);
      }, 2200);
    }
  }, [selected, currentQ, correctCount, totalAsked, onComplete, triggerExplosion]);

  if (!currentQ) return null;

  return (
    <div className="bg-primary/5 rounded-2xl border-2 border-primary/10 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-primary/10 flex items-center gap-3">
        <div className="p-2 bg-primary text-primary-foreground rounded-lg">
          <MessageSquare size={18} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Interactive Review</h3>
          <p className="text-xs text-muted-foreground">Answer 3 questions correctly to continue</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {Array.from({ length: REQUIRED_CORRECT }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i < correctCount ? 'bg-green-500 scale-110' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question area */}
      {!passed && (
        <div ref={containerRef} className="relative px-6 py-6 min-h-[320px]">
          {/* Correct answer overlay */}
          {feedback === 'correct' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-[scale-in_0.3s_ease-out]">
              <div className="text-center">
                <div className="text-5xl font-black text-green-500 drop-shadow-lg animate-[xp-pop_0.4s_ease-out]">
                  YOU ROCK! 🔥
                </div>
                {showExplanation && (
                  <p className="mt-3 text-sm text-green-600 max-w-sm mx-auto font-medium">{showExplanation}</p>
                )}
              </div>
            </div>
          )}

          {/* Incorrect answer overlay */}
          {feedback === 'incorrect' && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none animate-[fade-in_0.4s_ease-out]">
              <div className="text-center">
                <div className="text-4xl font-black text-destructive drop-shadow-lg">
                  CHANCE TO GROW! 💪
                </div>
                {showExplanation && (
                  <p className="mt-3 text-sm text-destructive max-w-sm mx-auto font-medium">{showExplanation}</p>
                )}
              </div>
            </div>
          )}

          {/* Question card */}
          <div
            className={`transition-all duration-500 ${
              feedback === 'correct'
                ? 'scale-95 opacity-0 blur-sm'
                : feedback === 'incorrect'
                ? 'opacity-20 blur-[2px]'
                : feedback === 'transitioning'
                ? 'opacity-0 translate-y-4'
                : 'opacity-100 translate-y-0'
            }`}
          >
            <p className="font-bold text-foreground text-base mb-4">
              <span className="text-muted-foreground text-sm font-normal mr-2">Q{totalAsked + 1}</span>
              {currentQ.question}
            </p>

            <div className="space-y-2">
              {currentQ.options.map((opt, i) => {
                let styles = 'bg-card/80 border-transparent hover:border-primary/30 text-muted-foreground';
                if (feedback !== 'idle' && feedback !== 'transitioning') {
                  if (i === currentQ.correct) styles = 'bg-green-500/10 border-green-500 text-green-700 dark:text-green-300';
                  else if (i === selected) styles = 'bg-destructive/10 border-destructive text-destructive';
                  else styles = 'bg-card/50 border-transparent text-muted-foreground/50';
                } else if (i === selected) {
                  styles = 'bg-primary/10 border-primary text-primary';
                }

                return (
                  <button
                    key={i}
                    onClick={() => feedback === 'idle' && setSelected(i)}
                    disabled={feedback !== 'idle'}
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all text-sm font-medium ${styles}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {feedback === 'idle' && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={selected === null}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mega celebration overlays */}
      {showCelebration && (
        <>
          <EmojiRain duration={10} />
          <ScreenFlash duration={10} />
        </>
      )}

      {/* Completion state */}
      {passed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="px-6 py-10 space-y-3 text-center"
        >
          <div className="text-5xl font-black text-green-500 mb-2 animate-[xp-pop_0.4s_ease-out]">
            YOU ROCK! 🔥
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
            totalAsked === REQUIRED_CORRECT
              ? 'bg-green-500/10 text-green-700 dark:text-green-300'
              : 'bg-destructive/10 text-destructive'
          }`}>
            <CheckCircle2 size={16} /> Section Complete — {REQUIRED_CORRECT}/{totalAsked}
          </div>
          {totalAsked > REQUIRED_CORRECT && (
            <div>
              <button
                onClick={onRetake}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                <RefreshCw size={14} /> Retake to improve score
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
