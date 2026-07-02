import { motion } from 'framer-motion';

interface Props {
  level: number;
}

export function ReferRisersClouds({ level }: Props) {
  // Cloud speed increases with level
  const baseDuration = Math.max(8, 30 - level * 2);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Cloud layers at different depths */}
      {[0.3, 0.5, 0.8].map((opacity, layer) => (
        <motion.div
          key={layer}
          className="absolute w-full"
          style={{ top: `${10 + layer * 25}%` }}
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{
            duration: baseDuration + layer * 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className="flex gap-20">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-full shrink-0"
                style={{
                  width: 80 + i * 30 + layer * 20,
                  height: 30 + i * 8 + layer * 8,
                  background: `rgba(255,255,255,${opacity})`,
                  filter: `blur(${4 + layer * 3}px)`,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* Sun glow (gets more intense at higher levels) */}
      <div
        className="absolute -top-20 right-10 w-40 h-40 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(251,191,36,${0.1 + level * 0.03}), transparent)`,
          filter: 'blur(20px)',
        }}
      />
    </div>
  );
}
