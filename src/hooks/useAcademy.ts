import { useState, useCallback, useMemo } from 'react';
import { ACADEMY_DATA, BADGES, type Week, type Badge, type CompanyBrand } from '@/data/academyData';
import { toast } from '@/hooks/use-toast';

export type ViewMode = 'dashboard' | 'module';

export interface ReviewScore {
  correct: number;
  total: number;
}

export function useAcademy() {
  const [weeks, setWeeks] = useState<Week[]>(() => JSON.parse(JSON.stringify(ACADEMY_DATA)));
  const [badges, setBadges] = useState<Badge[]>(() => JSON.parse(JSON.stringify(BADGES)));
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [reviewScores, setReviewScores] = useState<Record<string, ReviewScore>>({});
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [activeDay, setActiveDay] = useState(1);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [view, setView] = useState<ViewMode>('dashboard');

  const allModules = useMemo(() => weeks.flatMap(w => w.days.flatMap(d => d.modules)), [weeks]);
  const totalModules = allModules.length;
  const progressPercent = Math.round((completedModules.size / totalModules) * 100);

  const currentDay = weeks.flatMap(w => w.days).find(d => d.id === activeDay);
  const currentModule = currentDay?.modules[activeModuleIndex];
  const dayProgress = currentDay
    ? Math.round((currentDay.modules.filter(m => completedModules.has(m.id)).length / currentDay.modules.length) * 100)
    : 0;

  // Brand progress tracking
  const brandProgress = useMemo(() => {
    const result: Record<CompanyBrand, { completed: number; total: number }> = {
      referrizer: { completed: 0, total: 0 },
      wrh: { completed: 0, total: 0 },
      tc: { completed: 0, total: 0 },
      group: { completed: 0, total: 0 },
    };
    for (const mod of allModules) {
      const brand = mod.brand || 'group';
      result[brand].total++;
      if (completedModules.has(mod.id)) result[brand].completed++;
    }
    return result;
  }, [allModules, completedModules]);

  const activeBrand = currentDay?.brand || 'group';

  const setReviewScore = useCallback((moduleId: string, score: ReviewScore) => {
    setReviewScores(prev => {
      const existing = prev[moduleId];
      if (!existing) return { ...prev, [moduleId]: score };
      // Keep best score: highest correct count, or if tied, lowest total attempts
      if (score.correct > existing.correct) return { ...prev, [moduleId]: score };
      if (score.correct === existing.correct && score.total < existing.total) return { ...prev, [moduleId]: score };
      return prev;
    });
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    setCompletedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) return prev;
      next.add(moduleId);

      const mod = allModules.find(m => m.id === moduleId);
      const earnedXp = mod?.xp || 50;

      setXp(prevXp => {
        const newXp = prevXp + earnedXp;
        setLevel(Math.floor(newXp / 250) + 1);
        return newXp;
      });

      toast({
        title: `+${earnedXp} XP Earned!`,
        description: "Keep up the great work!",
      });

      // Badge checks
      setBadges(prevBadges => {
        const updated = [...prevBadges];
        const day1Modules = weeks[0].days[0].modules;
        if (day1Modules.every(m => next.has(m.id))) {
          const b = updated.find(b => b.id === 'b1');
          if (b) b.earned = true;
        }
        // Day-based badges
        const allDays = weeks.flatMap(w => w.days);
        const badgeDayMap: Record<number, string> = { 2: 'b2', 3: 'b3', 4: 'b4', 5: 'b5', 6: 'b6', 7: 'b7', 8: 'b8', 9: 'b9' };
        for (const [dayId, badgeId] of Object.entries(badgeDayMap)) {
          const d = allDays.find(d => d.id === Number(dayId));
          if (d && d.modules.every(m => next.has(m.id))) {
            const b = updated.find(b => b.id === badgeId);
            if (b) b.earned = true;
          }
        }
        // All days complete
        if (allDays.every(d => d.modules.every(m => next.has(m.id)))) {
          const b = updated.find(b => b.id === 'b10');
          if (b) b.earned = true;
        }
        return updated;
      });

      // Unlock next day
      const allDays = weeks.flatMap(w => w.days);
      const currentDayObj = allDays.find(d => d.modules.some(m => m.id === moduleId));
      if (currentDayObj && currentDayObj.modules.every(m => next.has(m.id))) {
        setWeeks(prevWeeks => {
          const updated = JSON.parse(JSON.stringify(prevWeeks));
          const allUpdatedDays = updated.flatMap((w: Week) => w.days);
          const nextDay = allUpdatedDays.find((d: any) => d.id === currentDayObj.id + 1);
          if (nextDay) nextDay.status = 'unlocked';
          const completedDay = allUpdatedDays.find((d: any) => d.id === currentDayObj.id);
          if (completedDay) completedDay.status = 'completed';
          return updated;
        });
      }

      return next;
    });
  }, [weeks, allModules]);

  const navigateToModule = useCallback((dayId: number, moduleIdx: number = 0) => {
    setActiveDay(dayId);
    setActiveModuleIndex(moduleIdx);
    setView('module');
  }, []);

  const nextModule = useCallback(() => {
    if (!currentDay) return;
    if (activeModuleIndex < currentDay.modules.length - 1) {
      setActiveModuleIndex(prev => prev + 1);
    }
  }, [currentDay, activeModuleIndex]);

  const prevModule = useCallback(() => {
    if (activeModuleIndex > 0) {
      setActiveModuleIndex(prev => prev - 1);
    }
  }, [activeModuleIndex]);

  const continueFromCurrent = useCallback(() => {
    const allDays = weeks.flatMap(w => w.days);
    for (const day of allDays) {
      if (day.status === 'unlocked') {
        const firstIncomplete = day.modules.findIndex(m => !completedModules.has(m.id));
        navigateToModule(day.id, firstIncomplete >= 0 ? firstIncomplete : 0);
        return;
      }
    }
    navigateToModule(1, 0);
  }, [weeks, completedModules, navigateToModule]);

  return {
    weeks, badges, completedModules, xp, level,
    activeDay, activeModuleIndex, view, setView,
    totalModules, progressPercent, currentDay, currentModule, dayProgress,
    completeModule, navigateToModule, nextModule, prevModule, continueFromCurrent,
    setActiveDay, brandProgress, activeBrand,
    reviewScores, setReviewScore,
  };
}
