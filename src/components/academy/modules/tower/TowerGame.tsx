import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLMSContext } from '@/contexts/LMSContext';
import { useTowerGame, BOSS_QUESTIONS } from '@/hooks/useTowerGame';
import { TowerDoomClock } from './TowerDoomClock';
import { TowerDeathScreen } from './TowerDeathScreen';
import { TowerVictoryScreen } from './TowerVictoryScreen';
import { TowerHUD } from './TowerHUD';
import { injectTowerStyles } from './TowerStyles';
import { TowerIntroScreen } from './TowerIntroScreen';

// ── Gothic Horror Palette ──
const GOLD = '#d4af37';
const BLOOD = '#ff0000';
const BG = '#0a0a0a';

interface TowerGameProps {
  onComplete: () => void;
  onSaveTowerScore?: (floor: number) => void;
}

// Stone button base styles
const stoneButtonBase = {
  background: 'linear-gradient(180deg, #3f3f46 0%, #27272a 40%, #18181b 100%)',
  border: '2px solid #52525b',
  boxShadow: 'inset 0 1px 0 rgba(161,161,170,0.15), inset 0 -2px 4px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.8), 0 1px 0 rgba(82,82,91,0.3)',
  textShadow: '0 1px 2px rgba(0,0,0,0.8)',
};

const ironButtonBase = {
  background: 'linear-gradient(180deg, #52525b 0%, #3f3f46 30%, #27272a 70%, #18181b 100%)',
  border: '2px solid #71717a',
  boxShadow: 'inset 0 1px 0 rgba(212,175,55,0.1), inset 0 -3px 6px rgba(0,0,0,0.7), 0 6px 20px rgba(0,0,0,0.9), 0 1px 0 rgba(113,113,122,0.4)',
  textShadow: '0 1px 3px rgba(0,0,0,0.9)',
};

const uiShakeVariants = {
  idle: { x: 0, y: 0, rotate: 0 },
  low: {
    x: [0, -3, 3, -2, 2, 0],
    y: [0, 1, -1, 0.5, -0.5, 0],
    transition: { duration: 0.4, repeat: Infinity, repeatType: 'loop' as const },
  },
  critical: {
    x: [0, -10, 10, -8, 9, -6, 5, -3, 0],
    y: [0, 3, -3, 2, -2, 3, -2, 1, 0],
    rotate: [0, -1, 1, -0.7, 0.8, -0.5, 0.3, 0],
    transition: { duration: 0.15, repeat: Infinity, repeatType: 'loop' as const },
  },
};

export function TowerGame({ onComplete, onSaveTowerScore }: TowerGameProps) {
  const { towerStack, completedDays } = useLMSContext();
  const { state, actions, currentQ, isBossFloor } = useTowerGame(towerStack);
  const { phase, floor, score, streak, shields, freezes, checkpoint, selected, frozen, usedFreeze, remaining, powerupMsg, deathInfo, floorTimer, bossStep, temporalFreeze } = state;
  const prevPhaseRef = useRef(phase);
  const [deathCount, setDeathCount] = useState(0);

  useEffect(() => { injectTowerStyles(); }, []);

  // Save tower score to DB on death or victory
  useEffect(() => {
    if ((phase === 'death' || phase === 'victory') && onSaveTowerScore) {
      onSaveTowerScore(floor);
    }
  }, [phase, floor, onSaveTowerScore]);

  // Confetti on correct
  useEffect(() => {
    if (phase === 'correct' && prevPhaseRef.current === 'playing') {
      confetti({
        particleCount: isBossFloor ? 120 : 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: isBossFloor ? [GOLD, '#b8960f', '#f59e0b'] : ['#10b981', '#059669'],
      });
    }
    prevPhaseRef.current = phase;
  }, [phase, isBossFloor]);

  const isPlaying = phase === 'playing' && !frozen && !temporalFreeze;
  const uiShake = !isPlaying ? 'idle' : remaining <= 1 ? 'critical' : remaining <= 2 ? 'low' : 'idle';
  const vignetteOpacity = !isPlaying ? 0 : remaining <= 1 ? 0.85 : remaining <= 2 ? 0.5 : 0.15;
  const vignetteColor = remaining <= 1 ? BLOOD : remaining <= 2 ? '#cc0000' : '#880000';

  // ── INTRO ──
  if (phase === 'intro') {
    return (
      <TowerIntroScreen
        onStart={actions.start}
        uniqueCount={towerStack.uniqueCount}
        isLooped={towerStack.isLooped}
        completedDays={completedDays}
      />
    );
  }

  // ── DEATH / VICTORY ──
  if (phase === 'death') {
    return <TowerDeathScreen visible floor={floor + 1} checkpoint={checkpoint} onRestart={() => { setDeathCount(d => d + 1); actions.restart(); }} correctAnswer={deathInfo.correctAnswer} wasTimeout={deathInfo.wasTimeout} deathCount={deathCount} />;
  }
  if (phase === 'victory') {
    return <TowerVictoryScreen visible onComplete={onComplete} />;
  }

  // ── GAMEPLAY ──
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden p-4 sm:p-6"
      style={{ background: `radial-gradient(ellipse at top, #111 0%, ${BG} 50%, #000 100%)`, minHeight: 500 }}
      variants={uiShakeVariants}
      animate={uiShake}
    >
      {/* Red vignette */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 rounded-2xl"
        animate={{ opacity: vignetteOpacity }}
        transition={{ duration: 0.3 }}
        style={{ boxShadow: `inset 0 0 80px ${vignetteColor}90, inset 0 0 150px ${vignetteColor}40` }}
      />

      <div className="relative z-10 space-y-4">
        <TowerHUD floor={floor + 1} streak={streak} shields={shields} freezes={freezes} checkpoint={checkpoint} score={score} />

        {/* Boss floor banner with sub-progress */}
        {isBossFloor && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="rounded-lg p-2.5 text-center space-y-2"
            style={{ background: `linear-gradient(90deg, transparent, ${GOLD}15, transparent)`, border: `1px solid ${GOLD}30` }}
          >
            <span className="font-black text-xs tracking-[0.3em] uppercase" style={{ color: GOLD }}>
              ⚔️ BOSS FLOOR — 3 QUESTIONS · 3 SECONDS EACH ⚔️
            </span>
            {/* Boss step dots */}
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: BOSS_QUESTIONS }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 rounded-full border"
                  animate={i === bossStep ? { scale: [1, 1.3, 1] } : {}}
                  transition={i === bossStep ? { duration: 0.6, repeat: Infinity } : {}}
                  style={{
                    background: i < bossStep ? '#10b981' : i === bossStep ? GOLD : 'transparent',
                    borderColor: i < bossStep ? '#10b981' : i === bossStep ? GOLD : '#52525b',
                    boxShadow: i === bossStep ? `0 0 8px ${GOLD}60` : 'none',
                  }}
                />
              ))}
              <span className="text-[10px] font-bold tracking-wider ml-2" style={{ color: '#a8a29e' }}>
                {bossStep + 1}/{BOSS_QUESTIONS}
              </span>
            </div>
          </motion.div>
        )}

        {/* Looped question indicator */}
        {towerStack.isLooped && floor >= towerStack.uniqueCount && !temporalFreeze && (
          <div className="text-center">
            <span className="text-[10px] tracking-widest uppercase font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', color: '#fca5a5' }}>
              ⚡ ACCELERATED — {floorTimer}s CLOCK
            </span>
          </div>
        )}

        {/* Temporal Freeze active indicator */}
        {temporalFreeze && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-[10px] tracking-widest uppercase font-black px-4 py-1.5 rounded-full inline-block"
              style={{ background: 'rgba(0,80,120,0.25)', border: '1px solid rgba(103,232,249,0.3)', color: '#67e8f9' }}
            >
              ⏳ TEMPORAL FREEZE — NO TIME LIMIT ⏳
            </motion.span>
          </motion.div>
        )}

        {/* Doom Clock — hidden during temporal freeze */}
        {!temporalFreeze && (
          <TowerDoomClock remaining={remaining} duration={floorTimer} frozen={frozen || phase !== 'playing'} isBoss={isBossFloor} />
        )}

        {/* Freeze button — stone aesthetic */}
        {freezes > 0 && !usedFreeze && phase === 'playing' && !temporalFreeze && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.08, boxShadow: '0 0 20px rgba(103,232,249,0.3)' }}
            whileTap={{ scale: 0.92 }}
            onClick={actions.useFreeze}
            className="flex items-center gap-2 mx-auto px-5 py-2 rounded-lg text-xs font-black tracking-[0.15em] uppercase transition-colors"
            style={{
              ...stoneButtonBase,
              borderColor: 'rgba(103,232,249,0.3)',
              color: '#67e8f9',
            }}
          >
            ⏳ Temporal Freeze ({freezes})
          </motion.button>
        )}

        {/* Module tag */}
        <p className="text-[10px] tracking-[0.3em] uppercase text-center" style={{ color: '#44403c' }}>
          {currentQ.module}
        </p>

        {/* Question & Answers */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${floor}-${bossStep}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-bold text-lg sm:text-xl text-center leading-snug mb-5 px-2" style={{ color: '#e7e5e4' }}>
              {currentQ.question}
            </p>
            <div className="space-y-2.5 max-w-2xl mx-auto">
              {currentQ.options.map((opt, i) => {
                const isAnswered = selected !== null;
                const isCorrectOpt = i === currentQ.correct;
                const isSelectedOpt = i === selected;

                // Stone button answer styling
                let btnStyle: React.CSSProperties;
                if (isAnswered) {
                  if (isCorrectOpt) {
                    btnStyle = {
                      background: 'linear-gradient(180deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
                      border: '2px solid #10b981',
                      color: '#6ee7b7',
                      boxShadow: '0 0 16px rgba(16,185,129,0.3), inset 0 1px 0 rgba(16,185,129,0.2)',
                    };
                  } else if (isSelectedOpt) {
                    btnStyle = {
                      background: `linear-gradient(180deg, rgba(255,0,0,0.1), rgba(255,0,0,0.03))`,
                      border: `2px solid ${BLOOD}`,
                      color: '#fca5a5',
                      boxShadow: `0 0 16px ${BLOOD}30, inset 0 1px 0 rgba(255,0,0,0.1)`,
                    };
                  } else {
                    btnStyle = {
                      background: 'rgba(10,10,10,0.4)',
                      border: '2px solid #1c1917',
                      color: '#44403c',
                      boxShadow: 'none',
                    };
                  }
                } else {
                  btnStyle = {
                    ...stoneButtonBase,
                    color: '#d6d3d1',
                  };
                }

                return (
                  <motion.button
                    key={i}
                    whileHover={!isAnswered ? {
                      scale: 1.01,
                      y: -1,
                      boxShadow: `inset 0 1px 0 rgba(212,175,55,0.2), 0 6px 20px rgba(0,0,0,0.9), 0 0 15px rgba(212,175,55,0.1)`,
                    } : {}}
                    whileTap={!isAnswered ? { scale: 0.98, y: 1 } : {}}
                    onClick={() => actions.answer(i)}
                    disabled={isAnswered || phase !== 'playing'}
                    className="w-full text-left p-3.5 rounded-xl transition-all font-medium text-sm"
                    style={btnStyle}
                  >
                    <span className="font-black mr-2" style={{ color: isAnswered ? btnStyle.color as string : GOLD }}>
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Power-up notification */}
        <AnimatePresence>
          {powerupMsg && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-[9998] px-8 py-3 rounded-xl font-black text-sm tracking-widest shadow-2xl"
              style={{ ...ironButtonBase, color: GOLD }}
            >
              {powerupMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shielded feedback */}
        <AnimatePresence>
          {phase === 'shielded' && (
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <Shield className="w-20 h-20 mx-auto mb-2 animate-pulse" style={{ color: GOLD }} />
                <p className="font-black text-xl tracking-widest" style={{ color: GOLD }}>SHIELDED!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Correct flash */}
        <AnimatePresence>
          {phase === 'correct' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-0 rounded-2xl"
              style={{ background: 'rgba(16,185,129,0.08)' }}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
