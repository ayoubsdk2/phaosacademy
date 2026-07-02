import { motion } from 'framer-motion';

const GOLD = '#d4af37';
const BLOOD = '#ff0000';
const BLOOD_DARK = '#8b0000';

interface TowerDoomClockProps {
  remaining: number;
  duration: number;
  frozen: boolean;
  isBoss?: boolean;
}

export function TowerDoomClock({ remaining, duration, frozen, isBoss }: TowerDoomClockProps) {
  const pct = (remaining / duration) * 100;
  const isLow = remaining <= 2;
  const isCritical = remaining <= 1;

  const shakeVariants = {
    idle: { x: 0, y: 0, rotate: 0 },
    low: {
      x: [0, -2, 2, -1.5, 1.5, 0],
      rotate: [0, -0.3, 0.3, -0.2, 0.2, 0],
      transition: { duration: 0.5, repeat: Infinity, repeatType: 'loop' as const },
    },
    critical: {
      x: [0, -8, 8, -6, 7, -5, 4, -3, 0],
      y: [0, 2, -2, 1, -1, 2, -1, 0],
      rotate: [0, -1.5, 1.5, -1, 1.2, -0.8, 0.6, -0.3, 0],
      transition: { duration: 0.18, repeat: Infinity, repeatType: 'loop' as const },
    },
  };

  const currentVariant = frozen ? 'idle' : isCritical ? 'critical' : isLow ? 'low' : 'idle';

  // Bar colors: boss = gold tones, normal = green → red
  const barGradient = isCritical
    ? `linear-gradient(90deg, ${BLOOD_DARK}, ${BLOOD}, #ff4444)`
    : isLow
      ? `linear-gradient(90deg, ${BLOOD_DARK}, #cc3300, #ff6600)`
      : isBoss
        ? `linear-gradient(90deg, #78350f, ${GOLD}90, ${GOLD})`
        : `linear-gradient(90deg, #1a472a, ${GOLD}90, ${GOLD})`;

  return (
    <motion.div className="w-full" variants={shakeVariants} animate={currentVariant}>
      {/* Timer bar — stone frame */}
      <div
        className="relative h-5 rounded-full overflow-hidden"
        style={{
          background: '#0a0a0a',
          border: `2px solid ${isCritical && !frozen ? BLOOD : isLow && !frozen ? BLOOD_DARK : isBoss ? '#78350f' : '#292524'}`,
          boxShadow: isCritical && !frozen
            ? `0 0 25px ${BLOOD}80, 0 0 50px ${BLOOD}40, inset 0 0 15px ${BLOOD}30`
            : isLow && !frozen
              ? `0 0 15px ${BLOOD_DARK}60`
              : isBoss
                ? `0 0 10px rgba(212,175,55,0.15), inset 0 1px 3px rgba(0,0,0,0.6)`
                : 'inset 0 1px 3px rgba(0,0,0,0.6)',
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, background: barGradient }}
          animate={isCritical && !frozen ? { opacity: [1, 0.2, 1] } : { opacity: 1 }}
          transition={isCritical && !frozen ? { duration: 0.15, repeat: Infinity } : {}}
        />
        {frozen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,80,120,0.2)' }}
          >
            <span className="text-cyan-300 text-xs font-black tracking-[0.3em] animate-pulse">
              ❄️ FROZEN ❄️
            </span>
          </motion.div>
        )}
      </div>

      {/* Time display */}
      <div className="flex justify-between mt-1.5 items-center">
        <motion.span
          className="text-sm font-black tracking-wider font-mono"
          style={{
            color: frozen ? '#67e8f9' : isCritical ? BLOOD : isLow ? '#ff6600' : GOLD,
            textShadow: isCritical && !frozen ? `0 0 10px ${BLOOD}` : 'none',
          }}
          animate={isCritical && !frozen ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={isCritical && !frozen ? { duration: 0.18, repeat: Infinity } : {}}
        >
          {frozen ? '⏸ PAUSED' : `${remaining.toFixed(1)}s`}
        </motion.span>
        <span
          className="text-[10px] font-mono tracking-[0.2em] uppercase"
          style={{ color: isCritical && !frozen ? BLOOD : isBoss ? GOLD : '#44403c' }}
        >
          {isCritical && !frozen ? '💀 DOOM IMMINENT' : isLow && !frozen ? '⚠️ HURRY' : isBoss ? '⚔️ BOSS CLOCK' : 'DOOM CLOCK'}
        </span>
      </div>
    </motion.div>
  );
}
