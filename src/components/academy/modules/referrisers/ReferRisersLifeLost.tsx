import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDeathExecutive, getExecutiveLabel } from '@/assets/executives';
import { playHallelujah } from './ReferRisersAudio';

interface Props {
  livesRemaining: number;
  correctAnswer: string;
  wasTimeout: boolean;
  onContinue: () => void;
  deathCount: number;
}

type Phase = 'falling' | 'saved' | 'info';

export function ReferRisersLifeLost({ livesRemaining, correctAnswer, wasTimeout, onContinue, deathCount }: Props) {
  const [phase, setPhase] = useState<Phase>('falling');
  const { photo: execPhoto, name: execName } = getDeathExecutive(deathCount);

  useEffect(() => {
    const t1 = setTimeout(() => {
      playHallelujah();
      setPhase('saved');
    }, 3000);
    const t2 = setTimeout(() => setPhase('info'), 5500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="relative min-h-[600px] flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ background: phase === 'falling'
        ? 'linear-gradient(180deg, #7dd3fc 0%, #38bdf8 40%, #0ea5e9 100%)'
        : 'linear-gradient(180deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)'
      }}
    >
      <AnimatePresence mode="wait">
        {/* ═══ FALLING PHASE ═══ */}
        {phase === 'falling' && (
          <motion.div
            key="falling"
            className="text-center z-10"
            exit={{ opacity: 0 }}
          >
            {/* Andre's BIG head falling with frown */}
            <motion.div
              initial={{ y: -120, rotate: 0 }}
              animate={{ y: 400, rotate: [0, -20, 30, -15, 25] }}
              transition={{ duration: 3, ease: 'easeIn' }}
              className="relative flex flex-col items-center"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/60"
                style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}
              >
                <img src={execPhoto} alt={execName} className="w-full h-full object-cover object-top" />
              </div>
              <p className="text-sm font-black mt-1" style={{ color: '#1e3a5f' }}>{getExecutiveLabel(execName)}</p>
            </motion.div>

            {/* Reason text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-black mt-8"
              style={{ color: '#1e3a5f' }}
            >
              {wasTimeout ? '⏰ TIME\'S UP!' : '❌ WRONG ANSWER!'}
            </motion.p>
          </motion.div>
        )}

        {/* ═══ SAVED PHASE — Angel catches Andre ═══ */}
        {phase === 'saved' && (
          <motion.div
            key="saved"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center z-10"
          >
            {/* Angel character swooping in from above */}
            <motion.div
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center mb-2"
            >
              {/* The Angel — visible above Andre */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="flex flex-col items-center mb-1"
              >
                {/* Halo */}
                <motion.div
                  className="w-20 h-5 rounded-full mb-1"
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ background: 'radial-gradient(ellipse, rgba(251,191,36,0.7), transparent)', filter: 'blur(2px)' }}
                />
                {/* Angel face + wings */}
                <div className="flex items-center gap-0">
                  <motion.span
                    className="text-5xl"
                    animate={{ rotate: [-15, 10, -15] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    🪽
                  </motion.span>
                  <span className="text-6xl">👼</span>
                  <motion.span
                    className="text-5xl"
                    style={{ transform: 'scaleX(-1)' }}
                    animate={{ rotate: [15, -10, 15] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    🪽
                  </motion.span>
                </div>
              </motion.div>

              {/* Andre rising with SMILE — 3x head */}
              <motion.div
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center"
              >
                <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-300"
                  style={{ boxShadow: '0 0 50px rgba(251,191,36,0.5)' }}
                >
                  <img src={execPhoto} alt={`${execName} saved`} className="w-full h-full object-cover object-top" />
                </div>
                <p className="text-sm font-black mt-1" style={{ color: '#92400e' }}>{getExecutiveLabel(execName)}</p>
              </motion.div>
            </motion.div>

            <motion.p
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-2xl sm:text-3xl font-black"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(217,119,6,0.3))',
              }}
            >
              SAVED! 👼
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-lg font-bold mt-2"
              style={{ color: '#92400e' }}
            >
              LIVE TO FIGHT ANOTHER DAY!
            </motion.p>
          </motion.div>
        )}

        {/* ═══ INFO PHASE ═══ */}
        {phase === 'info' && (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center z-10 px-6 max-w-lg"
          >
            <p className="text-5xl mb-4">👼</p>

            <p className="text-xl font-black mb-2" style={{ color: '#78350f' }}>
              {wasTimeout ? 'Time ran out!' : 'Wrong answer!'}
            </p>

            <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}>
              <p className="text-sm font-bold mb-1" style={{ color: '#64748b' }}>Correct Answer:</p>
              <p className="text-lg font-black" style={{ color: '#166534' }}>{correctAnswer}</p>
            </div>

            {/* Lives display */}
            <div className="flex justify-center gap-1 mb-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="text-xl">{i < livesRemaining ? '😇' : '💀'}</span>
              ))}
            </div>
            <p className="text-sm font-bold mb-6" style={{ color: '#92400e' }}>
              {livesRemaining} {livesRemaining === 1 ? 'life' : 'lives'} remaining
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onContinue}
              className="px-10 py-3 font-black text-sm tracking-widest uppercase rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                color: '#78350f',
                boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
                border: '2px solid rgba(255,255,255,0.5)',
              }}
            >
              ☁️ KEEP CLIMBING
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
