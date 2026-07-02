import { useState, useEffect, useRef, useMemo } from 'react';
import { BookOpen, CheckCircle2, XCircle, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { QUIZ_DATA } from '@/data/academyData';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizModuleProps {
  moduleId: string;
  isGraduation?: boolean;
  storageScope?: string;
  onComplete: () => void;
  onScore?: (score: { correct: number; total: number }, passed: boolean) => void | Promise<void>;
}

const CELEBRATION_EMOJIS = ['🎉', '🔥', '🚀', '⭐', '💪', '🏆', '🎯', '👏', '💥', '✨', '🎊', '🥇'];

function EmojiRain({ duration }: { duration: number }) {
  const [emojis, setEmojis] = useState<{ id: number; emoji: string; left: number; delay: number; size: number }[]>([]);
  useEffect(() => {
    setEmojis(Array.from({ length: 60 }, (_, i) => ({
      id: i,
      emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * duration * 0.8,
      size: 20 + Math.random() * 24,
    })));
  }, [duration]);
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {emojis.map(e => (
        <span key={e.id} className="absolute animate-[emojifall_3s_ease-in_forwards]"
          style={{ left: `${e.left}%`, top: '-40px', fontSize: `${e.size}px`, animationDelay: `${e.delay}s` }}>
          {e.emoji}
        </span>
      ))}
    </div>
  );
}

function ScreenFlash({ duration }: { duration: number }) {
  const [flashes, setFlashes] = useState<{ id: number; color: string; delay: number }[]>([]);
  useEffect(() => {
    const colors = ['rgba(59,130,246,0.15)', 'rgba(34,197,94,0.15)', 'rgba(250,204,21,0.15)', 'rgba(239,68,68,0.15)', 'rgba(168,85,247,0.15)', 'rgba(236,72,153,0.15)'];
    setFlashes(Array.from({ length: 20 }, (_, i) => ({ id: i, color: colors[i % colors.length], delay: i * 0.5 })));
  }, [duration]);
  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]">
      {flashes.map(f => (
        <div key={f.id} className="absolute inset-0 animate-[screenflash_0.5s_ease-in-out_forwards]"
          style={{ backgroundColor: f.color, animationDelay: `${f.delay}s`, opacity: 0 }} />
      ))}
    </div>
  );
}

interface AnswerRecord {
  questionText: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number;
  explanation: string;
  wasCorrect: boolean;
}

interface PersistedQuizProgress {
  version: number;
  moduleId: string;
  questionCount: number;
  currentQ: number;
  selected: number | null;
  submitted: boolean;
  score: number;
  finished: boolean;
  answers: AnswerRecord[];
  showDetailedResults: boolean;
  shuffleMaps: number[][];
}

const QUIZ_PROGRESS_VERSION = 1;

const getQuizProgressKey = (moduleId: string, storageScope?: string) =>
  `rz_academy_quiz_progress_${storageScope || 'anonymous'}_${moduleId}`;

// Fisher-Yates shuffle
function shuffleIndices(len: number): number[] {
  const indices = Array.from({ length: len }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

function buildShuffledQuestions(
  questions: { question: string; options: string[]; correct: number; explanation: string }[],
  savedMaps?: number[][],
) {
  return questions.map((q, idx) => {
    const savedMap = savedMaps?.[idx];
    const indices = Array.isArray(savedMap)
      && savedMap.length === q.options.length
      && new Set(savedMap).size === q.options.length
      && savedMap.every(i => Number.isInteger(i) && i >= 0 && i < q.options.length)
      ? savedMap
      : shuffleIndices(q.options.length);
    return {
      ...q,
      shuffledOptions: indices.map(i => q.options[i]),
      shuffleMap: indices,
    };
  });
}

function loadSavedQuizProgress(storageKey: string | null, moduleId: string, questionCount: number): PersistedQuizProgress | null {
  if (!storageKey || typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const saved = JSON.parse(raw) as PersistedQuizProgress;
    if (
      saved?.version !== QUIZ_PROGRESS_VERSION
      || saved.moduleId !== moduleId
      || saved.questionCount !== questionCount
      || !Array.isArray(saved.shuffleMaps)
      || !Array.isArray(saved.answers)
      || saved.currentQ < 0
      || saved.currentQ >= questionCount
    ) {
      window.localStorage.removeItem(storageKey);
      return null;
    }
    return saved;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

export function QuizModule({ moduleId, isGraduation, storageScope, onComplete, onScore }: QuizModuleProps) {
  const questions = QUIZ_DATA[moduleId] || QUIZ_DATA["1-17"] || [];
  const isWeekFinal = moduleId === '5-w1-exam';
  const passThreshold = (isGraduation || isWeekFinal) ? 0.8 : 0;
  const storageKey = useMemo(() => storageScope ? getQuizProgressKey(moduleId, storageScope) : null, [moduleId, storageScope]);
  const initialQuizRef = useRef<{
    saved: PersistedQuizProgress | null;
    shuffledQuestions: ReturnType<typeof buildShuffledQuestions>;
  } | null>(null);

  if (!initialQuizRef.current) {
    const saved = loadSavedQuizProgress(storageKey, moduleId, questions.length);
    initialQuizRef.current = {
      saved,
      shuffledQuestions: buildShuffledQuestions(questions, saved?.shuffleMaps),
    };
  }
  const initialQuiz = initialQuizRef.current;

  const [shuffledQuestions, setShuffledQuestions] = useState(initialQuiz.shuffledQuestions);
  const [currentQ, setCurrentQ] = useState(initialQuiz.saved?.currentQ ?? 0);
  const [selected, setSelected] = useState<number | null>(initialQuiz.saved?.selected ?? null);
  const [submitted, setSubmitted] = useState(initialQuiz.saved?.submitted ?? false);
  const [score, setScore] = useState(initialQuiz.saved?.score ?? 0);
  const [finished, setFinished] = useState(initialQuiz.saved?.finished ?? false);
  const [showFeedback, setShowFeedback] = useState(initialQuiz.saved?.submitted ?? false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>(initialQuiz.saved?.answers ?? []);
  const [showDetailedResults, setShowDetailedResults] = useState(initialQuiz.saved?.showDetailedResults ?? false);
  const confettiInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const didHydrateRef = useRef(false);

  useEffect(() => {
    return () => {
      if (confettiInterval.current) clearInterval(confettiInterval.current);
      try { confetti.reset(); } catch {}
    };
  }, []);

  useEffect(() => {
    if (!didHydrateRef.current) {
      didHydrateRef.current = true;
      return;
    }
    const saved = loadSavedQuizProgress(storageKey, moduleId, questions.length);
    const nextShuffledQuestions = buildShuffledQuestions(questions, saved?.shuffleMaps);
    setShuffledQuestions(nextShuffledQuestions);
    setCurrentQ(saved?.currentQ ?? 0);
    setSelected(saved?.selected ?? null);
    setSubmitted(saved?.submitted ?? false);
    setScore(saved?.score ?? 0);
    setFinished(saved?.finished ?? false);
    setShowFeedback(saved?.submitted ?? false);
    setShowCelebration(false);
    setAnswers(saved?.answers ?? []);
    setShowDetailedResults(saved?.showDetailedResults ?? false);
  }, [moduleId, questions, storageKey]);

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined' || questions.length === 0) return;
    const progress: PersistedQuizProgress = {
      version: QUIZ_PROGRESS_VERSION,
      moduleId,
      questionCount: questions.length,
      currentQ,
      selected,
      submitted,
      score,
      finished,
      answers,
      showDetailedResults,
      shuffleMaps: shuffledQuestions.map(q => q.shuffleMap),
    };
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [answers, currentQ, finished, moduleId, questions.length, score, selected, showDetailedResults, shuffledQuestions, storageKey, submitted]);

  const sq = shuffledQuestions[currentQ];
  if (!sq) return null;

  // Map selected display index back to original index
  const originalSelected = selected !== null ? sq.shuffleMap[selected] : null;
  const originalCorrect = sq.correct;
  // Find which display index corresponds to the correct original index
  const correctDisplayIdx = sq.shuffleMap.indexOf(originalCorrect);

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
    const isCorrect = originalSelected === originalCorrect;

    if (isCorrect) {
      setScore(prev => prev + 1);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.65 }, colors: ['#22c55e', '#16a34a', '#4ade80', '#86efac'] });
    }

    setAnswers(prev => [...prev, {
      questionText: sq.question,
      options: sq.options, // original order for display in summary
      selectedIndex: originalSelected,
      correctIndex: originalCorrect,
      explanation: sq.explanation,
      wasCorrect: isCorrect,
    }]);

    setShowFeedback(true);
  };

  const launchMegaCelebration = () => {
    setShowCelebration(true);
    const end = Date.now() + 10000;
    confettiInterval.current = setInterval(() => {
      if (Date.now() > end) { if (confettiInterval.current) clearInterval(confettiInterval.current); return; }
      confetti({ particleCount: Math.floor(Math.random() * 80) + 40, spread: Math.random() * 100 + 60, origin: { x: Math.random(), y: Math.random() * 0.5 }, colors: ['#3b82f6', '#22c55e', '#facc15', '#ef4444', '#a855f7', '#ec4899', '#f97316'], startVelocity: 30 + Math.random() * 30, gravity: 0.8 + Math.random() * 0.5, scalar: 0.9 + Math.random() * 0.4 });
    }, 200);
    setTimeout(() => setShowCelebration(false), 10500);
  };

  const handleNext = async () => {
    setShowFeedback(false);
    try { confetti.reset(); } catch {}
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setSubmitted(false);
    } else {
      setFinished(true);
      const finalScore = answers.filter(a => a.wasCorrect).length;
      setScore(finalScore);
      const pct = Math.round((finalScore / questions.length) * 100);
      const passed = passThreshold > 0 ? pct >= passThreshold * 100 : true;
      // Auto-expand the answer review whenever they didn't ace it, so they see
      // exactly what they missed and how to score 100% on retake.
      if (pct < 100) setShowDetailedResults(true);
      if (passed) {
        launchMegaCelebration();
        // CRITICAL: persist the score BEFORE marking complete so the
        // completion upsert never races ahead with a null score.
        await onScore?.({ correct: finalScore, total: questions.length }, true);
        onComplete();
      } else {
        await onScore?.({ correct: finalScore, total: questions.length }, false);
      }
    }
  };

  const handleRetake = () => {
    try { confetti.reset(); } catch {}
    if (confettiInterval.current) { clearInterval(confettiInterval.current); confettiInterval.current = null; }
    setShowCelebration(false);
    setCurrentQ(0);
    setSelected(null);
    setSubmitted(false);
    setScore(0);
    setFinished(false);
    setShowFeedback(false);
    setAnswers([]);
    setShowDetailedResults(false);
    setShuffledQuestions(buildShuffledQuestions(questions));
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = passThreshold > 0 ? pct >= passThreshold * 100 : true;

    return (
      <>
        {showCelebration && (<><EmojiRain duration={10} /><ScreenFlash duration={10} /></>)}
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="card-surface p-10 text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${passed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
            {passed ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
          </div>
          <h2 className="text-2xl font-extrabold text-foreground mb-2">
            {passed ? (isWeekFinal ? '🎓 Week 1 Complete!' : isGraduation ? '🎓 Congratulations!' : '🎉 YOU ROCK! 🥳') : '❤️ Keep Growing!'}
          </h2>
          <p className="text-muted-foreground mb-2">You scored {score}/{questions.length} ({pct}%)</p>
          {isWeekFinal && passed && <p className="text-primary font-bold mb-2">You've passed the Week 1 Final Exam! Week 2 is now unlocked! 🚀</p>}
          {isGraduation && passed && !isWeekFinal && <p className="text-primary font-bold mb-2">You've passed the exam!</p>}
          {pct < 100 && (
            <div className="mt-4 mx-auto max-w-xl text-left p-4 rounded-xl bg-primary/5 border border-primary/20">
              <p className="text-sm font-bold text-primary mb-1">🎯 How to score 100% on a retake</p>
              <p className="text-xs text-muted-foreground">
                You missed {questions.length - score} question{questions.length - score === 1 ? '' : 's'}. Each one is shown below with the correct answer highlighted in green and a short explanation. Read every explanation, then retake the {isGraduation || isWeekFinal ? 'exam' : 'quiz'} — answer order is randomized so you'll need to recognize the concept, not the position.
              </p>
            </div>
          )}
          {!passed && passThreshold > 0 && (
            <p className="text-destructive font-semibold mb-4 mt-3">You need {Math.round(passThreshold * 100)}% to pass. Review the results below, then retake the exam.</p>
          )}

          {/* Toggle detailed results */}
          <button onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="flex items-center gap-2 mx-auto mt-4 text-sm font-bold text-primary hover:text-primary-hover transition-colors">
            {showDetailedResults ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showDetailedResults ? 'Hide Detailed Results' : 'View Detailed Results'}
          </button>

          <AnimatePresence>
            {showDetailedResults && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-6 text-left space-y-4 max-h-[60vh] overflow-y-auto">
                {answers.map((a, i) => (
                  <div key={i} className={`p-4 rounded-xl border-2 ${a.wasCorrect ? 'border-success/30 bg-success/5' : 'border-destructive/30 bg-destructive/5'}`}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`shrink-0 mt-0.5 ${a.wasCorrect ? 'text-success' : 'text-destructive'}`}>
                        {a.wasCorrect ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                      </span>
                      <p className="font-bold text-sm text-foreground">Q{i + 1}: {a.questionText}</p>
                    </div>
                    <div className="ml-7 space-y-1">
                      {a.options.map((opt, oi) => {
                        let color = 'text-muted-foreground';
                        let prefix = '';
                        if (oi === a.correctIndex) { color = 'text-success font-semibold'; prefix = '✓ '; }
                        if (oi === a.selectedIndex && !a.wasCorrect) { color = 'text-destructive line-through'; prefix = '✗ '; }
                        return <p key={oi} className={`text-xs ${color}`}>{prefix}{opt}</p>;
                      })}
                      <p className="text-xs text-muted-foreground mt-2 italic">{a.explanation}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Retake button for failed graduation/final exams */}
          {!passed && passThreshold > 0 && (
            <button onClick={handleRetake}
              className="mt-6 flex items-center gap-2 mx-auto bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95">
              <RotateCcw size={16} /> Retake Exam
            </button>
          )}
        </motion.div>
      </>
    );
  }

  const wasCorrect = submitted && originalSelected === originalCorrect;

  return (
    <div className="bg-primary/5 p-8 sm:p-10 rounded-2xl border-2 border-primary/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary text-primary-foreground rounded-lg"><BookOpen size={18} /></div>
        <h3 className="text-lg font-bold text-foreground">
          {isWeekFinal ? '⭐ Week 1 Final Exam' : isGraduation ? 'Final Exam' : 'Knowledge Check'}
        </h3>
        <span className="ml-auto text-sm text-muted-foreground font-medium">{currentQ + 1}/{questions.length}</span>
      </div>

      {isWeekFinal && currentQ === 0 && !submitted && (
        <div className="mb-6 p-4 bg-primary/10 rounded-xl border border-primary/20">
          <p className="text-sm font-bold text-primary">📋 50 Questions • 80% Required to Pass • Answers Randomized</p>
          <p className="text-xs text-muted-foreground mt-1">This exam covers all 5 days of Week 1. You must score 40/50 or higher to unlock Week 2.</p>
        </div>
      )}

      <AnimatePresence>
        {showFeedback && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }} className="mb-4">
            <p className={`font-extrabold text-xl ${wasCorrect ? 'text-success' : 'text-destructive'}`}>
              {wasCorrect ? 'YOU ROCK! 🥳' : 'CHANCE TO GROW! 💪'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="font-bold text-foreground mb-6 text-lg">{sq.question}</p>

      <div className="space-y-3">
        {sq.shuffledOptions.map((opt, i) => {
          let styles = 'bg-card/50 border-transparent hover:border-border text-muted-foreground';
          if (submitted) {
            if (i === correctDisplayIdx) styles = 'bg-success/10 border-success text-success shadow-sm';
            else if (i === selected) styles = 'bg-destructive/10 border-destructive text-destructive shadow-sm';
          } else if (i === selected) {
            styles = 'bg-card border-primary text-primary shadow-sm';
          }
          return (
            <button key={i} onClick={() => !submitted && setSelected(i)} disabled={submitted}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-medium ${styles}`}>
              {opt}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showFeedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.15 }}
            className="mt-5 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Explanation:</span> {sq.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">Score: {score}/{currentQ + (submitted ? 1 : 0)}</span>
        {!submitted ? (
          <button onClick={handleSubmit} disabled={selected === null}
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed">
            Submit Answer
          </button>
        ) : (
          <button onClick={handleNext}
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-sm transition-all">
            {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Exam'}
          </button>
        )}
      </div>
    </div>
  );
}
