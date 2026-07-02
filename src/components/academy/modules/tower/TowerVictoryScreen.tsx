import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface TowerVictoryScreenProps {
  visible: boolean;
  onComplete: () => void;
}

export function TowerVictoryScreen({ visible, onComplete }: TowerVictoryScreenProps) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!visible) return;
    const end = Date.now() + 8000;
    intervalRef.current = setInterval(() => {
      if (Date.now() > end) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }
      confetti({
        particleCount: 60 + Math.floor(Math.random() * 80),
        spread: 80 + Math.random() * 60,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#fbbf24', '#f59e0b', '#d97706', '#dc2626', '#10b981', '#6366f1'],
        startVelocity: 30 + Math.random() * 30,
      });
    }, 250);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #1a1a00 0%, #000000 70%)' }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.5 }}
        className="text-center relative z-10"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-6"
        >
          👑
        </motion.div>
        <h1
          className="text-5xl sm:text-7xl font-black tracking-[0.15em] mb-4"
          style={{
            background: 'linear-gradient(180deg, #fbbf24, #d97706, #92400e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 60px rgba(251,191,36,0.3)',
            fontFamily: 'Georgia, serif',
          }}
        >
          TOWER CONQUERED
        </h1>
        <p className="text-amber-300/80 text-lg font-bold tracking-widest uppercase mb-2">
          All 100 Floors Cleared
        </p>
        <p className="text-stone-400 text-sm mb-8">
          You have achieved Absolute Retention
        </p>
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(251,191,36,0.4)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          className="px-12 py-4 bg-gradient-to-r from-amber-700 to-amber-500 text-black font-black text-sm tracking-widest uppercase rounded-xl border border-amber-400/50"
        >
          🏆 Claim Your Legend Status
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
