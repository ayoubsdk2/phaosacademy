import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { playGameOver } from './ReferRisersAudio';

interface Props {
  onRestart: () => void;
}

export function ReferRisersGameOver({ onRestart }: Props) {
  useEffect(() => {
    playGameOver();
  }, []);

  return (
    <div className="relative min-h-[600px] flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 40%, #cbd5e1 100%)' }}
    >
      <motion.div
        className="absolute top-20 left-10 w-40 h-14 rounded-full opacity-30"
        style={{ background: 'white', filter: 'blur(12px)' }}
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-10 px-6 max-w-lg"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl mb-6"
        >
          😔
        </motion.div>

        <h1 className="text-4xl font-black mb-2" style={{ color: '#334155' }}>
          GAME OVER
        </h1>
        <p className="text-lg font-bold mb-6" style={{ color: '#64748b' }}>
          All 10 lives lost. Time to study up and try again!
        </p>

        <div className="p-6 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)' }}>
          <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#94a3b8' }}>
            💪 Don't give up!
          </p>
          <p className="text-base font-medium" style={{ color: '#64748b' }}>
            Review your training modules and come back stronger. Every great closer learns from failure.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRestart}
          className="px-10 py-3 font-black text-sm tracking-widest uppercase rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#78350f',
            boxShadow: '0 4px 20px rgba(251,191,36,0.4)',
          }}
        >
          ☁️ TRY AGAIN
        </motion.button>
      </motion.div>
    </div>
  );
}
