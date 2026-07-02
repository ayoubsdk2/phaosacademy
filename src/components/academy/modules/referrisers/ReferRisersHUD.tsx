import { motion } from 'framer-motion';
import type { LevelInfo } from '@/hooks/useReferRisers';

interface Props {
  lives: number;
  score: number;
  level: LevelInfo;
  questionIndex: number;
}

export function ReferRisersHUD({ lives, score, level, questionIndex }: Props) {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      {/* Lives */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.span
            key={i}
            className="text-lg"
            animate={i < lives ? { scale: [1, 1.1, 1] } : { scale: 0.6, opacity: 0.2 }}
            transition={i < lives ? { duration: 2, repeat: Infinity, delay: i * 0.1 } : {}}
          >
            {i < lives ? '😇' : '💀'}
          </motion.span>
        ))}
      </div>

      {/* Score */}
      <div className="text-right">
        <motion.p
          key={score}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-xl font-black"
          style={{ color: '#fbbf24', textShadow: '0 2px 8px rgba(251,191,36,0.4)' }}
        >
          {score}
        </motion.p>
        <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: '#64748b' }}>
          Q{questionIndex + 1}/100
        </p>
      </div>
    </div>
  );
}
