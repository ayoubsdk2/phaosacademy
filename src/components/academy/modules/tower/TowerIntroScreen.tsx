import { useMemo } from 'react';
import { motion } from 'framer-motion';

const BG = '#0a0a0a';
const GOLD = '#d4af37';
const GOLD_DIM = '#b8960f';
const BLOOD = '#ff0000';
const BLOOD_DIM = '#990000';

interface TowerIntroScreenProps {
  onStart: () => void;
  uniqueCount: number;
  isLooped: boolean;
  completedDays: number;
}

const STORAGE_KEY = 'tower-of-retention-progress';

export function TowerIntroScreen({ onStart, uniqueCount, isLooped, completedDays }: TowerIntroScreenProps) {
  const saved = useMemo(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);
  const hasResume = saved && saved.floor > 0;
  return (
    <div
      className="relative min-h-[600px] flex items-center justify-center rounded-2xl overflow-hidden"
      style={{ background: `radial-gradient(ellipse at top, #111 0%, ${BG} 50%, #000 100%)` }}
    >
      {/* Cross-hatch overlay */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h20v20H0V0zm20 20h20v20H20V20z\' fill=\'%23292524\' fill-opacity=\'0.4\'/%3E%3C/svg%3E")', backgroundSize: '40px 40px' }} />

      {/* Iron frame border */}
      <div className="absolute inset-2 rounded-xl pointer-events-none" style={{
        border: '1px solid #27272a',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.5)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 px-6"
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-7xl mb-6">
          🏰
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-40 h-[1px] mx-auto mb-4"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
        />

        <h1
          className="text-4xl sm:text-6xl font-black tracking-[0.12em] mb-3"
          style={{
            background: `linear-gradient(180deg, ${GOLD}, ${GOLD_DIM}, #78350f)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          THE TOWER
        </h1>
        <p className="text-sm tracking-[0.3em] uppercase mb-1" style={{ color: '#666' }}>of</p>
        <h2
          className="text-2xl sm:text-3xl font-black tracking-[0.08em] mb-2"
          style={{ color: BLOOD, textShadow: `0 0 30px ${BLOOD}66`, fontFamily: 'Georgia, serif' }}
        >
          ABSOLUTE RETENTION
        </h2>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-40 h-[1px] mx-auto mb-6"
          style={{ background: `linear-gradient(90deg, transparent, ${BLOOD}80, transparent)` }}
        />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-6 mb-6"
        >
          <div className="text-center">
            <p className="text-2xl font-black" style={{ color: GOLD }}>{completedDays}</p>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: '#78716c' }}>Days Studied</p>
          </div>
          <div className="w-[1px] h-8" style={{ background: '#292524' }} />
          <div className="text-center">
            <p className="text-2xl font-black" style={{ color: GOLD }}>{uniqueCount}</p>
            <p className="text-[10px] tracking-widest uppercase" style={{ color: '#78716c' }}>Unique Questions</p>
          </div>
          {isLooped && (
            <>
              <div className="w-[1px] h-8" style={{ background: '#292524' }} />
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: '#fca5a5' }}>6.5s</p>
                <p className="text-[10px] tracking-widest uppercase" style={{ color: '#78716c' }}>Looped Clock</p>
              </div>
            </>
          )}
        </motion.div>

        {/* Rules */}
        <div className="max-w-md mx-auto text-left space-y-3 mb-8">
          {[
            { icon: '⚔️', text: '100 floors of questions from your training. One life.' },
            { icon: '⏱️', text: `7 seconds per question.${isLooped ? ' Timer decreases on repeats.' : ''} The Doom Clock waits for no one.` },
            { icon: '👹', text: 'Every 10th floor = Boss Level: 3 questions, 3 seconds each.' },
            { icon: '🛡️', text: '3-streak → Soul Shield (absorbs one fatal blow)' },
            { icon: '⏳', text: '5-streak → Temporal Freeze (next question: no timer)' },
            { icon: '🏁', text: 'Defeating a Boss = Hard Save checkpoint.' },
            { icon: '💀', text: 'Wrong answer or timeout = EXECUTION.' },
          ].map((rule, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.12 }} className="flex items-start gap-3">
              <span className="text-lg">{rule.icon}</span>
              <span className="text-sm" style={{ color: '#a8a29e' }}>{rule.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Enter button — iron aesthetic */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${BLOOD}50, inset 0 1px 0 rgba(212,175,55,0.2)` }}
          whileTap={{ scale: 0.95, y: 2 }}
          onClick={onStart}
          className="px-12 py-4 font-black text-sm tracking-[0.2em] uppercase rounded-xl transition-all"
          style={{
            background: `linear-gradient(180deg, #3f3f46, ${BLOOD_DIM}, #660000)`,
            border: `2px solid ${BLOOD}40`,
            color: '#fca5a5',
            boxShadow: `0 0 20px ${BLOOD}30, inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.8)`,
            textShadow: `0 1px 3px rgba(0,0,0,0.9)`,
          }}
        >
          {hasResume ? `⚔️ RESUME FROM FLOOR ${saved.floor + 1}` : '⚔️ ENTER THE TOWER'}
        </motion.button>
        {hasResume && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.3 }}
            onClick={() => {
              try { localStorage.removeItem(STORAGE_KEY); } catch {}
              onStart();
            }}
            className="text-xs font-bold tracking-widest uppercase mt-3 opacity-50 hover:opacity-100 transition-opacity"
            style={{ color: '#78716c' }}
          >
            or start fresh from floor 1
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
