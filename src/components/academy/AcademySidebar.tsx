import { ChevronDown, Lock, CheckCircle2, Check, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Week, CompanyBrand } from '@/data/academyData';
import type { ReviewScore } from '@/hooks/useAcademy';

interface AcademySidebarProps {
  weeks: Week[];
  activeDay: number;
  completedModules: Set<string>;
  collapsed: boolean;
  onToggle: () => void;
  onDayClick: (dayId: number) => void;
  onModuleClick?: (dayId: number, moduleIndex: number) => void;
  reviewScores?: Record<string, ReviewScore>;
}

const brandAccentClasses: Record<CompanyBrand, { bg: string; text: string; activeBg: string; dot: string }> = {
  referrizer: { bg: 'bg-brand-referrizer', text: 'text-brand-referrizer', activeBg: 'bg-brand-referrizer', dot: 'bg-brand-referrizer' },
  wrh: { bg: 'bg-brand-wrh', text: 'text-brand-wrh', activeBg: 'bg-brand-wrh', dot: 'bg-brand-wrh' },
  tc: { bg: 'bg-brand-tc', text: 'text-brand-tc', activeBg: 'bg-brand-tc', dot: 'bg-brand-tc' },
  group: { bg: 'bg-brand-referrizer', text: 'text-brand-referrizer', activeBg: 'bg-brand-referrizer', dot: 'bg-brand-referrizer' },
};

const brandSidebarBg: Record<CompanyBrand, string> = {
  referrizer: 'from-[hsl(215,28%,17%)] to-[hsl(217,30%,14%)]',
  wrh: 'from-[hsl(150,28%,15%)] to-[hsl(155,30%,12%)]',
  tc: 'from-[hsl(20,28%,15%)] to-[hsl(15,30%,12%)]',
  group: 'from-[hsl(215,28%,17%)] to-[hsl(217,30%,14%)]',
};

export function AcademySidebar({ weeks, activeDay, completedModules, collapsed, onToggle, onDayClick, onModuleClick, reviewScores = {} }: AcademySidebarProps) {
  const allDays = weeks.flatMap(w => w.days);
  const currentDayObj = allDays.find(d => d.id === activeDay);
  const activeBrand = currentDayObj?.brand || 'group';
  const brandStyles = brandAccentClasses[activeBrand];

  return (
    <aside className={`${collapsed ? 'w-[72px]' : 'w-[22rem]'} bg-gradient-to-b ${brandSidebarBg[activeBrand]} shrink-0 flex flex-col transition-all duration-500 h-screen sticky top-0`}>
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-white/10 shrink-0">
        <div className={`w-9 h-9 ${brandStyles.bg} rounded-lg flex items-center justify-center font-extrabold text-white text-lg shrink-0 transition-colors duration-500`}>
          {activeBrand === 'wrh' ? 'W' : activeBrand === 'tc' ? 'T' : 'R'}
        </div>
        {!collapsed && (
          <motion.span
            key={activeBrand}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-bold text-white/90 text-[15px] tracking-tight"
          >
            Referrizer <span className={brandStyles.text}>Academy</span>
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
        {weeks.map(week => (
          <div key={week.id} className="mb-5">
            {!collapsed && (
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30 mb-3 px-2">
                {week.title}
              </h3>
            )}
            <div className="space-y-0.5">
              {week.days.map(day => {
                const isActive = activeDay === day.id;
                const isLocked = day.status === 'locked';
                const isCompleted = day.status === 'completed';
                const allModulesComplete = day.modules.every(m => completedModules.has(m.id));
                const dayBrand = brandAccentClasses[day.brand];

                return (
                  <div key={day.id}>
                    <button
                      onClick={() => !isLocked && onDayClick(day.id)}
                      disabled={isLocked}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300
                        ${isActive ? `${dayBrand.activeBg} text-white` : ''}
                        ${!isActive && !isLocked ? 'text-white/70 hover:bg-white/5' : ''}
                        ${isLocked ? 'text-white/20 cursor-not-allowed' : ''}
                      `}
                    >
                      {isLocked ? (
                        <Lock size={15} className="shrink-0" />
                      ) : allModulesComplete || isCompleted ? (
                        <CheckCircle2 size={15} className={`shrink-0 ${isActive ? 'text-white' : 'text-success'}`} />
                      ) : (
                        <div className={`w-[15px] h-[15px] rounded-full border-2 shrink-0 ${isActive ? 'border-white' : 'border-white/20'}`} />
                      )}
                      {!collapsed && (
                        <>
                          <span className="flex-1 text-left truncate">
                            {day.title}: {day.subtitle}
                          </span>
                          {/* Brand indicator dot */}
                          <div className={`w-2 h-2 rounded-full ${dayBrand.dot} opacity-60 shrink-0`} />
                          {day.isGraduation && <GraduationCap size={14} className="shrink-0 opacity-50" />}
                          <ChevronDown size={14} className={`shrink-0 opacity-30 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>

                    {/* Expanded modules */}
                    <AnimatePresence>
                      {!collapsed && isActive && !isLocked && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-8 mt-1 mb-2 space-y-1.5 border-l border-white/10 pl-3 py-1">
                          {day.modules.map((mod, modIdx) => {
                              const modBrand = mod.brand ? brandAccentClasses[mod.brand] : dayBrand;
                              const score = reviewScores[mod.id];
                              // Only show a score badge when a real score has been recorded.
                              // Never fabricate a (0/X) for a completed-but-unscored module —
                              // that's misleading. Unscored coach-chats get marked needs_retake.
                              const displayScore: ReviewScore | null = score && score.total > 0 ? score : null;
                              const getScoreColor = (s: ReviewScore) => {
                                if (s.correct === 0) return 'text-red-400';
                                if (s.total === 10) {
                                  if (s.correct === 10) return 'text-green-400';
                                  if (s.correct >= 8) return 'text-orange-400';
                                  if (s.correct >= 6) return 'text-yellow-400';
                                  if (s.correct === 5) return 'text-yellow-400';
                                  return 'text-red-400';
                                }
                                return s.correct === s.total ? 'text-green-400' : 'text-red-400';
                              };
                              
                              return (
                                <button
                                  key={mod.id}
                                  onClick={() => onModuleClick?.(day.id, modIdx)}
                                  className="w-full flex items-center gap-2 text-xs text-white/40 hover:text-white/70 cursor-pointer transition-colors py-0.5 text-left"
                                >
                                  {completedModules.has(mod.id) ? (
                                    <Check size={11} className="text-success shrink-0" />
                                  ) : (
                                    <div className={`w-1.5 h-1.5 rounded-full ${modBrand.dot} opacity-40 shrink-0`} />
                                  )}
                                  {displayScore && mod.id === '10-8' ? (
                                    <span className={`shrink-0 text-[10px] font-extrabold tracking-wider ${displayScore.correct >= displayScore.total ? 'text-green-400' : 'text-red-400'}`}>
                                      {displayScore.correct >= displayScore.total ? 'PASS' : 'FAIL'}
                                    </span>
                                  ) : displayScore && (
                                    <span className={`shrink-0 text-[10px] font-bold ${getScoreColor(displayScore)}`}>
                                      ({displayScore.correct}/{displayScore.total})
                                    </span>
                                  )}
                                  <span className="break-words leading-snug">{mod.title}</span>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="h-12 flex items-center justify-center border-t border-white/10 text-white/30 hover:text-white/60 transition-colors"
      >
        <ChevronDown size={16} className={`transition-transform ${collapsed ? '-rotate-90' : 'rotate-90'}`} />
      </button>
    </aside>
  );
}
