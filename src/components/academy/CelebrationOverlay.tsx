import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CelebrationOverlayProps {
  show: boolean;
  onClose: () => void;
}

const PHASE_DURATION = 20000; // 20 seconds each
const TOTAL_DURATION = 60000; // 60 seconds total

const phases = [
  { line1: 'CONGRATULATIONS!', line2: '100% COMPLETION!' },
  { line1: 'YOU ROCK!', line2: 'ReferRISING Star!' },
  { line1: 'TIME TO MAKE', line2: 'SOME BIG $!' , line3: "Don't tell your family...", line4: 'or maybe you should!' },
];

const rainbowColors = [
  '#ff0000', '#ff4400', '#ff8800', '#ffcc00', '#ffff00',
  '#88ff00', '#00ff44', '#00ffcc', '#00ccff', '#0088ff',
  '#4400ff', '#8800ff', '#cc00ff', '#ff00cc', '#ff0088',
];

export function CelebrationOverlay({ show, onClose }: CelebrationOverlayProps) {
  const [phase, setPhase] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const confettiInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef<number>(0);

  const fireConfetti = useCallback(() => {
    // Random side bursts
    confetti({
      particleCount: 30,
      angle: 60,
      spread: 80,
      origin: { x: 0, y: 0.6 },
      colors: rainbowColors.slice(0, 5),
      gravity: 0.8,
    });
    confetti({
      particleCount: 30,
      angle: 120,
      spread: 80,
      origin: { x: 1, y: 0.6 },
      colors: rainbowColors.slice(5, 10),
      gravity: 0.8,
    });
    // Center burst
    confetti({
      particleCount: 20,
      spread: 120,
      origin: { x: 0.5, y: 0.4 },
      colors: rainbowColors,
      gravity: 0.6,
      scalar: 1.2,
    });
  }, []);

  const fireStarBurst = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 360,
      origin: { x: Math.random(), y: Math.random() * 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF4500'],
      shapes: ['star'],
      gravity: 0.4,
      scalar: 1.5,
      ticks: 100,
    });
  }, []);

  useEffect(() => {
    if (!show) return;

    startTime.current = Date.now();
    setPhase(0);
    setElapsed(0);

    // Fire confetti every 400ms
    confettiInterval.current = setInterval(() => {
      fireConfetti();
      if (Math.random() > 0.6) fireStarBurst();
    }, 400);

    // Big initial burst
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 160,
            origin: { x: 0.5, y: 0.3 },
            colors: rainbowColors,
            gravity: 0.5,
            scalar: 1.5,
          });
        }, i * 200);
      }
    }, 300);

    // Phase transitions
    const phaseTimer1 = setTimeout(() => setPhase(1), PHASE_DURATION);
    const phaseTimer2 = setTimeout(() => setPhase(2), PHASE_DURATION * 2);
    const endTimer = setTimeout(() => {
      onClose();
    }, TOTAL_DURATION);

    // Elapsed counter
    const ticker = setInterval(() => {
      setElapsed(Date.now() - startTime.current);
    }, 100);

    return () => {
      if (confettiInterval.current) clearInterval(confettiInterval.current);
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      clearTimeout(endTimer);
      clearInterval(ticker);
    };
  }, [show, fireConfetti, fireStarBurst, onClose]);

  if (!show) return null;

  const progressPct = Math.min(100, (elapsed / TOTAL_DURATION) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0533 0%, #0a0015 100%)' }}
    >
      {/* Animated light rays */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 origin-bottom"
            style={{
              width: '4px',
              height: '200vh',
              background: `linear-gradient(to top, transparent, ${rainbowColors[i % rainbowColors.length]}40, transparent)`,
              transform: `rotate(${i * 30}deg)`,
            }}
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Pulsing glow rings */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border-2"
          style={{
            borderColor: rainbowColors[(phase * 5 + i) % rainbowColors.length] + '60',
            width: `${300 + i * 150}px`,
            height: `${300 + i * 150}px`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
        />
      ))}

      {/* Floating sparkle particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${3 + Math.random() * 5}px`,
              height: `${3 + Math.random() * 5}px`,
              backgroundColor: rainbowColors[i % rainbowColors.length],
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, (Math.random() - 0.5) * 60, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main text content */}
      <div className="relative z-10 text-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, scale: 0.5, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -40 }}
            transition={{ duration: 0.8, type: 'spring', damping: 12 }}
          >
            {/* Trophy emoji */}
            <motion.div
              className="text-6xl sm:text-7xl mb-6"
              animate={{ rotate: [-10, 10, -10], scale: [1, 1.15, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🏆
            </motion.div>

            {/* Line 1 */}
            <motion.h1
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-3"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FF6B35, #FF1493, #00BFFF, #FFD700)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.5))',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              {phases[phase].line1}
            </motion.h1>

            {/* Line 2 */}
            <motion.h2
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4"
              style={{
                background: 'linear-gradient(135deg, #00BFFF, #7B68EE, #FF69B4, #FFD700, #00BFFF)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 20px rgba(123,104,238,0.5))',
              }}
              animate={{ backgroundPosition: ['100% 50%', '0% 50%', '100% 50%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              {phases[phase].line2}
            </motion.h2>

            {/* Extra lines for phase 3 */}
            {phases[phase].line3 && (
              <motion.p
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white/80 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {phases[phase].line3}
              </motion.p>
            )}
            {phases[phase].line4 && (
              <motion.p
                className="text-2xl sm:text-3xl md:text-4xl font-black mt-3"
                style={{
                  background: 'linear-gradient(90deg, #FFD700, #FF4500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: [0, 1, 1], y: [20, 0, 0], scale: [0.9, 1.05, 1] }}
                transition={{ delay: 1, duration: 0.8 }}
              >
                {phases[phase].line4}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Flashing border pulse */}
        <motion.div
          className="absolute -inset-8 sm:-inset-16 rounded-3xl pointer-events-none"
          style={{ border: '3px solid transparent' }}
          animate={{
            borderColor: [
              'rgba(255,215,0,0.5)',
              'rgba(255,20,147,0.5)',
              'rgba(0,191,255,0.5)',
              'rgba(123,104,238,0.5)',
              'rgba(255,215,0,0.5)',
            ],
            boxShadow: [
              '0 0 40px rgba(255,215,0,0.3), inset 0 0 40px rgba(255,215,0,0.1)',
              '0 0 40px rgba(255,20,147,0.3), inset 0 0 40px rgba(255,20,147,0.1)',
              '0 0 40px rgba(0,191,255,0.3), inset 0 0 40px rgba(0,191,255,0.1)',
              '0 0 40px rgba(123,104,238,0.3), inset 0 0 40px rgba(123,104,238,0.1)',
              '0 0 40px rgba(255,215,0,0.3), inset 0 0 40px rgba(255,215,0,0.1)',
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64">
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #FFD700, #FF4500, #FF1493, #7B68EE, #00BFFF)' }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/40 hover:text-white/80 text-sm font-medium transition-colors z-20"
      >
        ✕ Close
      </button>
    </motion.div>
  );
}
