import { motion } from 'framer-motion';
import { Shield, Snowflake, Flame, Skull } from 'lucide-react';

const GOLD = '#d4af37';
const BLOOD = '#ff0000';

interface TowerHUDProps {
  floor: number;
  streak: number;
  shields: number;
  freezes: number;
  checkpoint: number;
  score: number;
}

function HUDCell({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div
      className="rounded-lg p-2 text-center"
      style={{
        background: 'linear-gradient(180deg, rgba(39,39,42,0.4) 0%, rgba(10,10,10,0.8) 100%)',
        border: '1px solid #27272a',
        boxShadow: 'inset 0 1px 0 rgba(82,82,91,0.15), inset 0 -1px 3px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)',
      }}
    >
      <div className="flex justify-center mb-0.5" style={{ color }}>{icon}</div>
      <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: '#52525b' }}>{label}</p>
      <motion.p
        key={String(value)}
        initial={{ scale: 1.4 }}
        animate={{ scale: 1 }}
        className="text-xl font-black"
        style={{ color, textShadow: `0 0 8px ${color}30` }}
      >
        {value}
      </motion.p>
    </div>
  );
}

export function TowerHUD({ floor, streak, shields, freezes, checkpoint, score }: TowerHUDProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
      <HUDCell icon={<Skull className="w-3 h-3" />} label="Floor" value={`${floor}/100`} color={GOLD} />
      <HUDCell icon={<span className="text-[10px]">⚡</span>} label="Score" value={score} color="#10b981" />
      <HUDCell icon={<Flame className="w-3 h-3" />} label="Streak" value={streak} color="#f97316" />
      <HUDCell icon={<Shield className="w-3 h-3" />} label="Aegis" value={shields} color={GOLD} />
      <HUDCell icon={<Snowflake className="w-3 h-3" />} label="T.Freeze" value={freezes} color="#67e8f9" />
      <HUDCell icon={<span className="text-[10px]">🏁</span>} label="Save" value={checkpoint || '—'} color={BLOOD} />
    </div>
  );
}
