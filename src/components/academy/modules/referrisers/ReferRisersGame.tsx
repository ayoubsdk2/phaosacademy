import { useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLMSContext } from '@/contexts/LMSContext';
import { useReferRisers, TIMER_SECONDS, LEVELS } from '@/hooks/useReferRisers';
import { ReferRisersIntro } from './ReferRisersIntro';
import { ReferRisersHUD } from './ReferRisersHUD';
import { ReferRisersLevelUp } from './ReferRisersLevelUp';
import { ReferRisersLifeLost } from './ReferRisersLifeLost';
import { ReferRisersGameOver } from './ReferRisersGameOver';
import { ReferRisersVictory } from './ReferRisersVictory';
import { ReferRisersClouds } from './ReferRisersClouds';
import { playCorrectChime, playFallingWhistle, startBackgroundMusic, stopBackgroundMusic, updateMusicLevel } from './ReferRisersAudio';
import { STARTING_LIVES } from '@/hooks/useReferRisers';

interface ReferRisersGameProps {
  onComplete: () => void;
  onSaveTowerScore?: (floor: number, livesUsed?: number, timeSeconds?: number) => void;
}

export function ReferRisersGame({ onComplete, onSaveTowerScore }: ReferRisersGameProps) {
  const { towerStack } = useLMSContext();
  const { state, actions, currentQ } = useReferRisers(towerStack);
  const { phase, questionIndex, lives, score, selected, remaining, deathInfo, currentLevel, levelJustCompleted } = state;
  const prevPhaseRef = useRef(phase);

  // Save score on game over / victory
  useEffect(() => {
    if ((phase === 'gameOver' || phase === 'victory') && onSaveTowerScore) {
      const elapsed = state.elapsedSeconds;
      const floor = phase === 'victory' ? 100 : questionIndex;
      onSaveTowerScore(floor, state.totalLivesUsed, elapsed);
    }
  }, [phase, questionIndex, onSaveTowerScore, state.totalLivesUsed, state.elapsedSeconds]);

  // Music management
  useEffect(() => {
    if (phase === 'playing') {
      updateMusicLevel(currentLevel.level);
    }
    if (phase === 'gameOver' || phase === 'victory') {
      stopBackgroundMusic();
    }
  }, [phase, currentLevel.level]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { stopBackgroundMusic(); };
  }, []);

  // Sound effects & confetti on phase changes
  useEffect(() => {
    if (phase === 'correct' && prevPhaseRef.current === 'playing') {
      playCorrectChime();
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ['#60a5fa', '#fbbf24', '#f9fafb'],
      });
    }
    if ((phase === 'lifeLost' || phase === 'gameOver') && prevPhaseRef.current === 'playing') {
      playFallingWhistle();
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  // Timer bar
  const timerPct = (remaining / TIMER_SECONDS) * 100;
  const timerColor = remaining <= 5 ? '#ef4444' : remaining <= 10 ? '#f59e0b' : '#60a5fa';
  const levelProgress = ((questionIndex % 10) / 10) * 100;

  // Shuffle answer options per question
  const shuffledQ = useMemo(() => {
    if (!currentQ) return null;
    const indices = currentQ.options.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    return {
      options: indices.map(i => currentQ.options[i]),
      correctShuffled: indices.indexOf(currentQ.correct),
      originalToShuffled: indices,
    };
  }, [questionIndex]);

  // ── Intro ──
  if (phase === 'intro') {
    return <ReferRisersIntro onStart={actions.start} />;
  }

  // ── Game Over — no lockout, just restart ──
  if (phase === 'gameOver') {
    return <ReferRisersGameOver onRestart={actions.restart} />;
  }

  // ── Victory ──
  if (phase === 'victory') {
    return <ReferRisersVictory onComplete={onComplete} score={score} />;
  }

  // ── Level Up ──
  if (phase === 'levelUp' && levelJustCompleted) {
    const nextLevel = LEVELS[Math.min(levelJustCompleted.level, LEVELS.length - 1)];
    return (
      <ReferRisersLevelUp
        completedLevel={levelJustCompleted}
        nextLevel={nextLevel}
        onContinue={actions.continueAfterLevelUp}
      />
    );
  }

  // ── Life Lost ──
  if (phase === 'lifeLost') {
    return (
      <ReferRisersLifeLost
        livesRemaining={lives}
        correctAnswer={deathInfo.correctAnswer}
        wasTimeout={deathInfo.wasTimeout}
        onContinue={actions.continueAfterLifeLost}
        deathCount={STARTING_LIVES - lives}
      />
    );
  }

  // ── Gameplay ──
  return (
    <div className="relative rounded-2xl overflow-hidden" style={{
      background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 30%, #7dd3fc 60%, #38bdf8 100%)',
      minHeight: 550,
    }}>
      <ReferRisersClouds level={currentLevel.level} />

      <div className="absolute top-4 right-8 w-20 h-20 rounded-full opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(251,191,36,0.3), transparent)', filter: 'blur(8px)' }}
      />

      <div className="relative z-10 p-4 sm:p-6 space-y-4">
        <ReferRisersHUD lives={lives} score={score} level={currentLevel} questionIndex={questionIndex} />

        {/* Level progress bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between text-xs font-bold mb-1" style={{ color: '#1e3a5f' }}>
            <span>{currentLevel.name}</span>
            <span>Q{(questionIndex % 10) + 1}/10</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.4)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}
              animate={{ width: `${levelProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="max-w-2xl mx-auto">
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.3)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }}>
            <motion.div
              className="h-full rounded-full transition-colors"
              style={{ width: `${timerPct}%`, background: timerColor }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <motion.span
              className="text-sm font-black font-mono"
              style={{ color: remaining <= 5 ? '#ef4444' : '#1e3a5f' }}
              animate={remaining <= 5 ? { scale: [1, 1.15, 1] } : {}}
              transition={remaining <= 5 ? { duration: 0.3, repeat: Infinity } : {}}
            >
              {remaining.toFixed(1)}s
            </motion.span>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>
              {remaining <= 5 ? '⏰ HURRY!' : '⏰ Time'}
            </span>
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-xl p-5 mb-4" style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08), 0 0 0 1px rgba(255,255,255,0.5)',
            }}>
              <p className="font-bold text-lg text-center" style={{ color: '#0f172a' }}>
                {currentQ?.question}
              </p>
              <p className="text-[10px] text-center mt-2 font-semibold uppercase tracking-widest" style={{ color: '#94a3b8' }}>
                {currentQ?.module}
              </p>
            </div>

            <div className="space-y-2.5">
              {shuffledQ?.options.map((opt, i) => {
                const isAnswered = selected !== null;
                const originalIdx = shuffledQ.originalToShuffled[i];
                const isCorrectOpt = originalIdx === currentQ.correct;
                const selectedShuffledIdx = selected !== null ? shuffledQ.originalToShuffled.indexOf(selected) : null;
                const isSelectedOpt = i === selectedShuffledIdx;

                let btnStyle: React.CSSProperties;
                if (isAnswered) {
                  if (isCorrectOpt) {
                    btnStyle = { background: 'linear-gradient(135deg, #bbf7d0, #86efac)', border: '2px solid #22c55e', color: '#166534', boxShadow: '0 0 20px rgba(34,197,94,0.3)' };
                  } else if (isSelectedOpt) {
                    btnStyle = { background: 'linear-gradient(135deg, #fecaca, #fca5a5)', border: '2px solid #ef4444', color: '#991b1b', boxShadow: '0 0 20px rgba(239,68,68,0.3)' };
                  } else {
                    btnStyle = { background: 'rgba(255,255,255,0.3)', border: '2px solid rgba(255,255,255,0.2)', color: '#94a3b8' };
                  }
                } else {
                  btnStyle = { background: 'rgba(255,255,255,0.7)', border: '2px solid rgba(255,255,255,0.5)', color: '#1e293b', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', backdropFilter: 'blur(4px)' };
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!isAnswered ? { scale: 1.02, y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' } : {}}
                    whileTap={!isAnswered ? { scale: 0.98 } : {}}
                    onClick={() => actions.answer(originalIdx)}
                    disabled={isAnswered || phase !== 'playing'}
                    className="w-full text-left p-3.5 rounded-xl font-medium text-sm transition-all"
                    style={btnStyle}
                  >
                    <span className="font-black mr-2" style={{ color: isAnswered ? undefined : '#fbbf24' }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {phase === 'correct' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-0 rounded-2xl"
              style={{ background: 'rgba(134,239,172,0.15)' }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
