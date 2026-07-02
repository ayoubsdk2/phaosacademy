import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Day, Module, CompanyBrand } from '@/data/academyData';
import { BRAND_CONFIG } from '@/data/academyData';
import { VideoPlayer } from './modules/VideoPlayer';
import { ReadingModule } from './modules/ReadingModule';
import { AudioPlayer } from './modules/AudioPlayer';
import { FlipCards } from './modules/FlipCards';
import { QuizModule } from './modules/QuizModule';
import { RoleplayModule } from './modules/RoleplayModule';
import { ReviewModule } from './modules/ReviewModule';
import { AvatarPlayer } from './modules/AvatarPlayer';
import { CoachChatModule } from './modules/CoachChatModule';
// Lazy-load the ReferRiser game bundle (~150KB) — most students won't reach it on first paint.
const ReferRisersGame = lazy(() => import('./modules/referrisers/ReferRisersGame').then(m => ({ default: m.ReferRisersGame })));
import { LMSProvider } from '@/contexts/LMSContext';

import { ChatbotInterview } from './modules/ChatbotInterview';
import { WelcomeLetter } from './modules/WelcomeLetter';
import { DanielLetter } from './modules/DanielLetter';
import { AndreCultureLetter } from './modules/AndreCultureLetter';
import { CompletionNextButton } from './CompletionNextButton';
import { useAuth } from '@/hooks/useAuth';
import type { ReviewScore } from '@/hooks/useAcademy';

interface ModuleViewerProps {
  day: Day;
  moduleIndex: number;
  module: Module;
  completedModules: Set<string>;
  dayProgress: number;
  onComplete: (moduleId: string) => void;
  onNext: () => void;
  onPrev: () => void;
  isGraduation?: boolean;
  reviewScores: Record<string, ReviewScore>;
  onReviewScore: (moduleId: string, score: ReviewScore, markCompleted?: boolean) => void | Promise<void>;
  userEmail: string;
  onSaveTowerScore?: (floor: number, livesUsed?: number, timeSeconds?: number) => void;
}

const BYPASS_EMAIL = 'daniel@referrizer.com';

const brandBarColors: Record<CompanyBrand, string> = {
  referrizer: 'bg-brand-referrizer',
  wrh: 'bg-brand-wrh',
  tc: 'bg-brand-tc',
  group: 'bg-brand-referrizer',
};

const brandTextColors: Record<CompanyBrand, string> = {
  referrizer: 'text-brand-referrizer',
  wrh: 'text-brand-wrh',
  tc: 'text-brand-tc',
  group: 'text-brand-referrizer',
};

export function ModuleViewer({ day, moduleIndex, module, completedModules, dayProgress, onComplete, onNext, onPrev, isGraduation, reviewScores, onReviewScore, userEmail, onSaveTowerScore }: ModuleViewerProps) {
  const { profile } = useAuth();
  const [mediaFinished, setMediaFinished] = useState(false);
  const isCompleted = completedModules.has(module.id);
  const isLastModule = moduleIndex === day.modules.length - 1;
  const moduleBrand = module.brand || day.brand;
  const isInteractiveModule = module.type === 'roleplay' || module.type === 'chatbot' || module.type === 'quiz' || module.type === 'review' || module.type === 'coach-chat' || module.type === 'tower-game';
  const canBypass = userEmail.toLowerCase() === BYPASS_EMAIL;

  // For review modules, only show next if passed (or bypass user)
  const reviewPassed = module.type === 'review' ? (isCompleted || canBypass) : true;
  const showCompletionCta = !isLastModule && (mediaFinished || (isInteractiveModule && isCompleted));

  useEffect(() => {
    setMediaFinished(false);
    // Defensive cleanup: clear any lingering confetti particles when switching modules
    try { confetti.reset(); } catch {}
  }, [module.id]);

  const handleCompleteAndNext = () => {
    onComplete(module.id);
    if (!isLastModule) {
      setTimeout(onNext, 300);
    }
  };

  const handleMediaFinished = useCallback(() => {
    setMediaFinished(true);
    onComplete(module.id);
  }, [module.id, onComplete]);

  const handleReviewComplete = useCallback(async (score: ReviewScore) => {
    // Persist the score first so the completion upsert never beats it to the DB.
    await Promise.resolve(onReviewScore(module.id, score));
    onComplete(module.id);
  }, [module.id, onComplete, onReviewScore]);

  const renderModule = () => {
    switch (module.type) {
      case 'video': return <VideoPlayer title={module.title} brand={moduleBrand} description={module.description} moduleId={module.id} onFinished={handleMediaFinished} />;
      case 'reading': return <ReadingModule title={module.title} brand={moduleBrand} moduleId={module.id} />;
      case 'audio': return <AudioPlayer title={module.title} brand={moduleBrand} voice={module.voice} description={module.description} moduleId={module.id} onFinished={handleMediaFinished} />;
      case 'flipcards': return <FlipCards brand={moduleBrand} moduleId={module.id} />;
      case 'quiz': return <QuizModule moduleId={module.id} isGraduation={isGraduation && isLastModule} storageScope={userEmail || 'academy'} onComplete={() => onComplete(module.id)} onScore={(score, passed) => onReviewScore(module.id, score, passed)} />;
      case 'roleplay': return <RoleplayModule title={module.title} onComplete={() => onComplete(module.id)} description={module.description} idealAnswer={module.idealAnswer} moduleId={module.id} onVerdict={(passed) => onReviewScore(module.id, { correct: passed ? 10 : 0, total: 10 }, passed)} />;
      case 'review': return <ReviewModule moduleId={module.id} onComplete={handleReviewComplete} />;
      case 'avatar': return <AvatarPlayer title={module.title} voice={module.voice || day.voice} brand={moduleBrand} description={module.description} moduleId={module.id} onFinished={handleMediaFinished} />;
      
      case 'chatbot': return <ChatbotInterview onComplete={() => onComplete(module.id)} />;
      case 'coach-chat': return <CoachChatModule moduleId={module.id} prompt={module.description || ''} title={module.title} onComplete={() => onComplete(module.id)} onScore={(score, markCompleted = false) => onReviewScore(module.id, score, markCompleted)} />;
      case 'letter': return <WelcomeLetter profile={profile} />;
      case 'letter-daniel': return <DanielLetter profile={profile} />;
      case 'letter-andre': return <AndreCultureLetter profile={profile} />;
      case 'tower-game': {
        // Pass real LMS data: full academy curriculum + completed day IDs
        const allDays = [day, ...[]]; // The tower uses ACADEMY_DATA default + completed days from progress
        const completedDayIds = Array.from(completedModules)
          .map(id => {
            const parts = id.split('-');
            return parseInt(parts[0], 10);
          })
          .filter((v, i, a) => !isNaN(v) && a.indexOf(v) === i);
        const userName = profile?.full_name || 'Trainee';
        return (
          <LMSProvider completedDayIds={completedDayIds} userName={userName}>
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
              <ReferRisersGame onComplete={() => onComplete(module.id)} onSaveTowerScore={onSaveTowerScore} />
            </Suspense>
          </LMSProvider>
        );
      }
      default: return null;
    }
  };

  return (
    <motion.div
      key={module.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${brandBarColors[moduleBrand]}`} />
            <span className={`${brandTextColors[moduleBrand]} font-bold text-sm uppercase tracking-widest`}>
              {day.title}: {day.subtitle}
            </span>
            {moduleBrand !== 'group' && (
              <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full font-semibold">
                {BRAND_CONFIG[moduleBrand].name}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">{module.title}</h1>
          {module.description && (
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{module.description}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-bold text-muted-foreground uppercase">
            Module {moduleIndex + 1} of {day.modules.length}
          </p>
          <div className="w-32 mt-2">
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dayProgress}%` }}
                className={`h-full ${brandBarColors[day.brand]} rounded-full`}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {moduleIndex === 0 && day.briefing && (
        <div className="mb-8 p-5 bg-secondary/50 border border-border rounded-xl">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">📋 Daily Briefing</h3>
          <p className="text-sm text-foreground leading-relaxed">{day.briefing}</p>
        </div>
      )}

      <div className="space-y-8 pb-28">
        {renderModule()}
      </div>

      {/* Non-interactive modules: show Complete & Continue */}
      {!isInteractiveModule && !mediaFinished && (
        <div className="pt-10 pb-20 border-t border-border mt-10 flex justify-between items-center">
          <button
            onClick={onPrev}
            disabled={moduleIndex === 0}
            className="flex items-center gap-2 text-muted-foreground font-semibold hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} /> Previous
          </button>
          <button
            onClick={handleCompleteAndNext}
            className={`${brandBarColors[moduleBrand]} hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95`}
          >
            {isCompleted ? 'Continue' : 'Complete & Continue'}
          </button>
        </div>
      )}

      {/* Bypass button for daniel@ on review modules that aren't passed */}
      {module.type === 'review' && !isCompleted && canBypass && !isLastModule && (
        <div className="pt-4 pb-20 flex justify-end">
          <button
            onClick={handleCompleteAndNext}
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Skip (admin bypass)
          </button>
        </div>
      )}

      {showCompletionCta && reviewPassed && <CompletionNextButton onClick={onNext} />}
    </motion.div>
  );
}
