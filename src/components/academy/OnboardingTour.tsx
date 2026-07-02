import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingTourProps {
  userId: string | undefined;
  alreadyCompleted: boolean;
  forceOpen?: boolean;
  onClose?: () => void;
}

const STEPS = [
  {
    title: 'Welcome to Referrizer Academy',
    body: "You're about to master the Referrizer ecosystem in 10 days. Here's a 30-second tour of how this platform works.",
    icon: '👋',
  },
  {
    title: 'The Sidebar Is Your Roadmap',
    body: 'Each day unlocks once the previous is complete. The colored chips next to a module show your best score so far — only your highest attempt counts.',
    icon: '🗺️',
  },
  {
    title: 'XP & Levels',
    body: 'Every completed module awards XP. Hit 250 XP to level up. Quizzes, coaching, and the ReferRiser exam all stack toward your total.',
    icon: '⚡',
  },
  {
    title: 'Coaching: Always 4 Responses',
    body: 'The AI sales coach grades you on a full 4-response session — one weak answer never ends it early. After response 4 you get a final score and the perfect 4 answers to study for a 10/10 retake.',
    icon: '🎯',
  },
  {
    title: 'The Final Exam: ReferRiser',
    body: '100 rapid-fire questions test mastery of everything. You have 3 lives. Make it through and you graduate as a Referrizer Legend.',
    icon: '🏆',
  },
];

const NEVER_SHOW_TOUR_KEY = 'rz_never_show_onboarding_tour';

export function OnboardingTour({ userId, alreadyCompleted, forceOpen, onClose }: OnboardingTourProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setStep(0);
      setOpen(true);
      return;
    }
    if (typeof window !== 'undefined' && localStorage.getItem(NEVER_SHOW_TOUR_KEY) === '1') {
      return;
    }
    if (!alreadyCompleted && userId) {
      const t = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(t);
    }
  }, [userId, alreadyCompleted, forceOpen]);

  const neverShowAgain = async () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(NEVER_SHOW_TOUR_KEY, '1');
    }
    await finish();
  };

  const finish = async () => {
    setOpen(false);
    onClose?.();
    if (userId && !alreadyCompleted) {
      try {
        await supabase
          .from('profiles')
          .update({ onboarding_completed_at: new Date().toISOString() })
          .eq('id', userId);
      } catch (err) {
        console.warn('Onboarding flag save failed:', err);
      }
    }
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else finish();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tour-title"
        >
          <motion.div
            key={step}
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="card-surface relative max-w-md w-full p-8 border border-border shadow-2xl"
          >
            <button
              onClick={finish}
              aria-label="Skip tour"
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-primary rounded-md p-1"
            >
              <X size={18} />
            </button>

            <div className="text-5xl mb-4" aria-hidden="true">{STEPS[step].icon}</div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                Step {step + 1} of {STEPS.length}
              </span>
            </div>
            <h2 id="tour-title" className="text-2xl font-bold text-foreground mb-3">
              {STEPS[step].title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {STEPS[step].body}
            </p>

            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i === step ? 'w-6 bg-primary' : i < step ? 'w-1.5 bg-primary/60' : 'w-1.5 bg-muted'
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={finish}
                  className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Skip
                </button>
                <button
                  onClick={neverShowAgain}
                  className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Never see this again
                </button>
                <button
                  onClick={next}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {step === STEPS.length - 1 ? "Let's go" : 'Next'}
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
