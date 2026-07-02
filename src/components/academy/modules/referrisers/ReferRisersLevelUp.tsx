import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import type { LevelInfo } from '@/hooks/useReferRisers';
import { playLevelUpFanfare } from './ReferRisersAudio';

interface Props {
  completedLevel: LevelInfo;
  nextLevel: LevelInfo;
  onContinue: () => void;
}

export function ReferRisersLevelUp({ completedLevel, nextLevel, onContinue }: Props) {
  useEffect(() => {
    playLevelUpFanfare();
    const end = Date.now() + 3000;
    const interval = setInterval(() => {
      if (Date.now() > end) { clearInterval(interval); return; }
      confetti({
        particleCount: 40,
        spread: 80,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#fbbf24', '#60a5fa', '#f9fafb', '#a78bfa'],
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[600px] flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 30%, #fbbf24 60%, #f59e0b 100%)' }}
    >
      {/* Golden glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-96 h-96 rounded-full" style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.6), rgba(251,191,36,0.2), transparent)',
          filter: 'blur(40px)',
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center z-10 px-6"
      >
        {/* Big level transition text */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 120 }}
          className="mb-8"
        >
          <span className="text-7xl sm:text-8xl font-black block" style={{ color: '#78350f', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            Level {completedLevel.level} → {nextLevel.level}
          </span>
        </motion.div>

        {/* Next level name */}
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="text-3xl font-black mb-6"
          style={{ color: '#78350f' }}
        >
          ✨ {nextLevel.name} ✨
        </motion.p>

        {/* Andre-ism quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="max-w-md mx-auto mb-8 p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(10px)' }}
        >
          <p className="text-lg font-black italic" style={{
            background: 'linear-gradient(135deg, #92400e, #78350f)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            "{completedLevel.quote}"
          </p>
          <p className="text-xs font-bold mt-2" style={{ color: '#a16207' }}>— Andre Cvijovic</p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="px-10 py-3 font-black text-sm tracking-widest uppercase rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #fff, #fef3c7)',
            color: '#78350f',
            boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
            border: '2px solid rgba(251,191,36,0.5)',
          }}
        >
          ☁️ CONTINUE THE ASCENT
        </motion.button>
      </motion.div>
    </div>
  );
}
