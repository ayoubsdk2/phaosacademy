import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import andreImg from '@/assets/andre.webp';

interface Executive {
  name: string;
  title: string;
  emoji: string;
}

const EXECUTIVES: Executive[] = [
  { name: 'Andre Cvijovic', title: 'Founder & CEO', emoji: '👑' },
  { name: 'Daniel Lindros', title: 'VP of Sales', emoji: '🎯' },
  { name: 'The Strategist', title: 'COO / CTO', emoji: '🧠' },
  { name: 'Engineering Team', title: 'Platform Development', emoji: '⚙️' },
  { name: 'Sales Team', title: 'Revenue & Growth', emoji: '📈' },
  { name: 'Customer Success', title: 'Client Champions', emoji: '🤝' },
  { name: 'Marketing Team', title: 'Brand & Creative', emoji: '🎨' },
  { name: 'You', title: 'True ReferRiser', emoji: '🏆' },
];

interface Props {
  score: number;
  onFinish: () => void;
}

export function ReferRisersCredits({ score, onFinish }: Props) {
  const [showButton, setShowButton] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Confetti bursts
    const end = Date.now() + 6000;
    intervalRef.current = setInterval(() => {
      if (Date.now() > end) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
      confetti({
        particleCount: 40, spread: 80,
        origin: { x: Math.random(), y: Math.random() * 0.3 },
        colors: ['#fbbf24', '#60a5fa', '#a78bfa', '#34d399'],
      });
    }, 400);

    const timer = setTimeout(() => setShowButton(true), (EXECUTIVES.length + 2) * 800 + 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className="relative min-h-[600px] flex flex-col items-center justify-start overflow-hidden rounded-2xl py-10"
      style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)' }}
    >
      {/* Stars */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
        />
      ))}

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 mb-8"
      >
        <p className="text-amber-400 text-sm font-bold tracking-[0.3em] uppercase mb-2">
          Congratulations
        </p>
        <h1 className="text-4xl sm:text-5xl font-black" style={{
          background: 'linear-gradient(180deg, #fbbf24, #d97706)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          FINAL SCORE: {score.toLocaleString()}
        </h1>
      </motion.div>

      {/* Scrolling credits */}
      <div className="z-10 w-full max-w-md space-y-2 px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-amber-300/60 text-xs font-bold tracking-[0.25em] uppercase mb-6"
        >
          — The Team Behind The Mission —
        </motion.p>

        {EXECUTIVES.map((exec, i) => (
          <motion.div
            key={exec.name}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + i * 0.8, duration: 0.6 }}
            className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(251,191,36,0.15)' }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0"
              style={{ background: 'rgba(251,191,36,0.15)' }}
            >
              {exec.name === 'Andre Cvijovic' ? (
                <img src={andreImg} alt="Andre" className="w-full h-full rounded-full object-cover object-top" />
              ) : (
                exec.emoji
              )}
            </div>
            <div>
              <p className="font-black text-white text-base">{exec.name}</p>
              <p className="text-amber-400/80 text-sm font-semibold">{exec.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Finish button */}
      {showButton && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onFinish}
          className="z-10 mt-10 px-12 py-4 font-black text-sm tracking-widest uppercase rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #d97706)',
            color: '#0f172a',
            boxShadow: '0 0 40px rgba(251,191,36,0.3)',
          }}
        >
          🏆 COMPLETE THE GAME
        </motion.button>
      )}
    </div>
  );
}
