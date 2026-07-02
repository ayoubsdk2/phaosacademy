import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import andreImg from '@/assets/andre.webp';
import { playVictoryFanfare } from './ReferRisersAudio';
import { ReferRisersCredits } from './ReferRisersCredits';

interface Props {
  onComplete: () => void;
  score: number;
}

export function ReferRisersVictory({ onComplete, score }: Props) {
  const [showCredits, setShowCredits] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    playVictoryFanfare();
    const end = Date.now() + 10000;
    intervalRef.current = setInterval(() => {
      if (Date.now() > end) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: ['#fbbf24', '#60a5fa', '#a78bfa', '#f9fafb', '#34d399'],
        startVelocity: 30 + Math.random() * 30,
      });
    }, 200);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  if (showCredits) {
    return <ReferRisersCredits score={score} onFinish={onComplete} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-[600px] flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fef3c7 0%, #fde68a 20%, #fbbf24 50%, #f59e0b 80%, #d97706 100%)' }}
    >
      {/* Golden rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            top: '50%', left: '50%',
            width: 4, height: '120%',
            background: 'rgba(255,255,255,0.15)',
            transformOrigin: 'center top',
            transform: `rotate(${i * 45}deg)`,
          }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 10, delay: 0.5 }}
        className="text-center z-10 px-6"
      >
        {/* Andre with crown */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-6 relative"
        >
          <motion.span
            className="text-5xl block mb-2"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👑
          </motion.span>
          <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-white"
            style={{ boxShadow: '0 0 40px rgba(255,255,255,0.6), 0 0 80px rgba(251,191,36,0.4)' }}
          >
            <img src={andreImg} alt="Andre" className="w-full h-full object-cover object-top" />
          </div>
          <span className="text-3xl block text-center -mt-3">😄</span>
        </motion.div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-3"
          style={{ color: '#fff', textShadow: '0 4px 20px rgba(120,53,0,0.3)' }}
        >
          🎉 YOU DID IT! 🎉
        </h1>
        <p className="text-2xl font-black mb-1" style={{ color: '#78350f' }}>
          TRUE REFERRISER!
        </p>
        <p className="text-lg font-bold mb-2" style={{ color: '#92400e' }}>
          You've ascended the entire tower!
        </p>
        <p className="text-3xl font-black mb-8" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          Score: {score}
        </p>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255,255,255,0.6)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCredits(true)}
          className="px-12 py-4 font-black text-sm tracking-widest uppercase rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.9)',
            color: '#78350f',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '2px solid rgba(255,255,255,0.8)',
          }}
        >
          🏆 CLAIM YOUR LEGEND STATUS
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
