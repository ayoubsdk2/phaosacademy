import { motion } from 'framer-motion';
import { andreImg } from '@/assets/executives';
import { startBackgroundMusic } from './ReferRisersAudio';

interface Props {
  onStart: () => void;
}

export function ReferRisersIntro({ onStart }: Props) {
  const handleStart = () => {
    // Initialize audio context on user gesture to bypass browser autoplay policy
    startBackgroundMusic(1);
    onStart();
  };

  return (
    <div className="relative min-h-[600px] flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 40%, #7dd3fc 70%, #38bdf8 100%)' }}
    >
      {/* Floating clouds */}
      <motion.div
        className="absolute top-12 left-10 w-32 h-12 rounded-full opacity-50"
        style={{ background: 'white', filter: 'blur(8px)' }}
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-24 right-16 w-40 h-14 rounded-full opacity-40"
        style={{ background: 'white', filter: 'blur(10px)' }}
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Sun glow */}
      <div className="absolute -top-10 right-20 w-48 h-48 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.3), transparent)', filter: 'blur(30px)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 px-6 max-w-lg"
      >
        {/* Andre floating */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="mb-4"
        >
          <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-white/80"
            style={{ boxShadow: '0 0 30px rgba(251,191,36,0.4), 0 8px 30px rgba(0,0,0,0.15)' }}
          >
            <img src={andreImg} alt="Andre" className="w-full h-full object-cover object-top" />
          </div>
          <motion.span
            className="text-4xl block -mt-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            😇
          </motion.span>
        </motion.div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-1"
          style={{
            background: 'linear-gradient(180deg, #fbbf24, #d97706)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: 'none',
            filter: 'drop-shadow(0 2px 4px rgba(217,119,6,0.3))',
          }}
        >
          ReferRisers!
        </h1>
        <p className="text-lg font-bold mb-6" style={{ color: '#1e3a5f' }}>
          Rise To The Top! ☁️
        </p>

        {/* Rules */}
        <div className="text-left space-y-2.5 mb-8 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)' }}>
          {[
            { icon: '🏢', text: '100 questions. 10 levels. Ascend the corporate tower to the Heavenly Realm.' },
            { icon: '😇', text: '10 lives. Lose them all? Start over from the beginning!' },
            { icon: '⏰', text: '60 seconds per question. Stay sharp.' },
            { icon: '✨', text: 'Questions drawn from your 10 days of training.' },
            { icon: '👼', text: 'Get saved by an angel when you fall, but not forever!' },
            { icon: '🏆', text: 'Clear all 100 to become a true ReferRiser!' },
          ].map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-3"
            >
              <span className="text-lg">{rule.icon}</span>
              <span className="text-sm font-medium" style={{ color: '#334155' }}>{rule.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(251,191,36,0.5)' }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="px-12 py-4 font-black text-sm tracking-widest uppercase rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            color: '#78350f',
            boxShadow: '0 4px 20px rgba(251,191,36,0.4), 0 2px 4px rgba(0,0,0,0.1)',
            border: '2px solid rgba(255,255,255,0.5)',
          }}
        >
          🎵 BEGIN THE ASCENT 🎵
        </motion.button>
        <p className="text-xs mt-2 font-medium" style={{ color: '#64748b' }}>
          Music will start when you click
        </p>
      </motion.div>
    </div>
  );
}
