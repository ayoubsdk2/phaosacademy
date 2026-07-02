import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ACADEMY_DATA, BADGES, type Week, type Badge, type CompanyBrand } from '@/data/academyData';
import { toast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';
import type { ReviewScore } from '@/hooks/useAcademy';

export type ViewMode = 'dashboard' | 'module';

const getAcademyPlaceKey = (userId: string) => `rz_academy_place_${userId}`;

const findModuleLocation = (moduleId: string, weeks: Week[]) => {
  for (const week of weeks) {
    for (const day of week.days) {
      const moduleIndex = day.modules.findIndex((m) => m.id === moduleId);
      if (moduleIndex >= 0) return { dayId: day.id, moduleIndex };
    }
  }
  return null;
};

const decodeEncodedScore = (score: number | null | undefined): ReviewScore | null => {
  if (score == null || score <= 0) return null;
  const correct = Math.floor(score / 1000);
  const total = score % 1000;
  return correct >= 0 && total > 0 ? { correct, total } : null;
};

const shouldUseProgressRow = (candidate: any, current?: any) => {
  if (!current) return true;
  const candidateScore = decodeEncodedScore(candidate?.score);
  const currentScore = decodeEncodedScore(current?.score);
  if (candidateScore && !currentScore) return true;
  if (!candidateScore && currentScore) return false;
  if (candidateScore && currentScore) {
    if (candidateScore.correct !== currentScore.correct) return candidateScore.correct > currentScore.correct;
    return candidateScore.total < currentScore.total;
  }
  return true;
};

export function useSupabaseProgress(user: User | null, isManager: boolean = false, viewUserId?: string) {
  const [weeks, setWeeks] = useState<Week[]>(() => JSON.parse(JSON.stringify(ACADEMY_DATA)));
  const [badges, setBadges] = useState<Badge[]>(() => JSON.parse(JSON.stringify(BADGES)));
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());
  const [reviewScores, setReviewScoresState] = useState<Record<string, ReviewScore>>({});
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [activeDay, setActiveDay] = useState(1);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [view, setView] = useState<ViewMode>('dashboard');
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const retryLoad = useCallback(() => { setLoadError(null); setLoaded(false); setReloadNonce((n) => n + 1); }, []);
  const reloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoResumeDoneRef = useRef(false);
  const restoredPlaceRef = useRef(false);
  // JAE Cohort routing — JAE members read/write to jae_* tables instead of main tables.
  const [isJaeMember, setIsJaeMember] = useState(false);
  const progressTable = isJaeMember ? 'jae_user_progress' : 'user_progress';
  const profilesTable = isJaeMember ? 'jae_user_profiles' : 'profiles';
  const profileIdColumn = isJaeMember ? 'user_id' : 'id';

  const allModules = weeks.flatMap(w => w.days.flatMap(d => d.modules));
  const totalModules = allModules.length;
  const progressPercent = Math.min(100, Math.round((completedModules.size / totalModules) * 100));

  const currentDay = weeks.flatMap(w => w.days).find(d => d.id === activeDay);
  const currentModule = currentDay?.modules[activeModuleIndex];
  const dayProgress = currentDay
    ? Math.round((currentDay.modules.filter(m => completedModules.has(m.id)).length / currentDay.modules.length) * 100)
    : 0;

  const brandProgress: Record<CompanyBrand, { completed: number; total: number }> = {
    referrizer: { completed: 0, total: 0 },
    wrh: { completed: 0, total: 0 },
    tc: { completed: 0, total: 0 },
    group: { completed: 0, total: 0 },
  };
  for (const mod of allModules) {
    const brand = mod.brand || 'group';
    brandProgress[brand].total++;
    if (completedModules.has(mod.id)) brandProgress[brand].completed++;
  }

  const activeBrand = currentDay?.brand || 'group';

  // Load progress from Supabase on mount
  useEffect(() => {
    if (!user) { setLoaded(true); return; }
    const targetUserId = viewUserId || user.id;
    let mounted = true;
    autoResumeDoneRef.current = false;
    restoredPlaceRef.current = false;

    // Drop from 6s to 2s. If we hit the timeout we set an explicit error so the
    // UI can show "Couldn't load progress — Retry" instead of silent zeros.
    const timeout = setTimeout(() => {
      if (mounted && !loaded) {
        setLoadError("Couldn't load progress");
        setLoaded(true);
      }
    }, 2000);

    const loadProgress = async () => {
      try {
        // First, detect JAE membership so we read from the right tables.
        const jaeRes = await supabase
          .from('jae_cohort_members')
          .select('id')
          .eq('user_id', targetUserId)
          .maybeSingle();
        const isJae = !!jaeRes.data;
        if (mounted) setIsJaeMember(isJae);

        const progressTbl = isJae ? 'jae_user_progress' : 'user_progress';
        const profilesTbl = isJae ? 'jae_user_profiles' : 'profiles';
        const idCol = isJae ? 'user_id' : 'id';

        const [progressRes, legacyProgressRes, badgeRes, profileRes] = await Promise.all([
          supabase.from(progressTbl as any).select('module_id, day_id, status, score').eq('user_id', targetUserId),
          isJae
            ? supabase.from('user_progress').select('module_id, day_id, status, score').eq('user_id', targetUserId)
            : Promise.resolve({ data: null }),
          supabase.from('user_badges').select('badge_id').eq('user_id', targetUserId),
          supabase.from(profilesTbl as any).select('total_xp, level').eq(idCol, targetUserId).maybeSingle(),
        ]);

        if (!mounted) return;

        // Safety net: if cohort routing is active but historical progress still
        // exists in the main table, merge it into the view instead of showing a reset account.
        const progressByModule = new Map<string, any>();
        const rememberProgressRow = (row: any) => {
          if (shouldUseProgressRow(row, progressByModule.get(row.module_id))) {
            progressByModule.set(row.module_id, row);
          }
        };
        for (const row of ((legacyProgressRes as any).data || []) as any[]) {
          rememberProgressRow(row);
        }
        for (const row of ((progressRes as any).data || []) as any[]) {
          rememberProgressRow(row);
        }
        const progressData = Array.from(progressByModule.values());
        const badgeData = badgeRes.data;
        const profileData = profileRes.data;

        // Filter to only valid module IDs that exist in current ACADEMY_DATA
        const validModuleIds = new Set(
          ACADEMY_DATA.flatMap((w: Week) => w.days.flatMap((d: any) => d.modules.map((m: any) => m.id)))
        );
        const completedIds = new Set(
          progressData
            .filter((p: any) => p.status === 'completed')
            .map((p: any) => p.module_id)
            .filter((id: string) => validModuleIds.has(id))
        );
        setCompletedModules(completedIds);

        // Unlock days based on completion
        const updatedWeeks = JSON.parse(JSON.stringify(ACADEMY_DATA));
        const allDays = updatedWeeks.flatMap((w: Week) => w.days);

        if (isManager || viewUserId) {
          // Managers and student-view get full access to all modules
          for (const day of allDays) {
            day.status = day.modules.every((m: any) => completedIds.has(m.id)) ? 'completed' : 'unlocked';
          }
        } else {
          for (const day of allDays) {
            const dayComplete = day.modules.every((m: any) => completedIds.has(m.id));
            if (dayComplete) {
              day.status = 'completed';
              const nextDay = allDays.find((d: any) => d.id === day.id + 1);
              if (nextDay) nextDay.status = 'unlocked';
            } else if (day.modules.some((m: any) => completedIds.has(m.id))) {
              day.status = 'unlocked';
            }
          }
        }
        setWeeks(updatedWeeks);

        // Restore the user's exact last academy location first. This prevents a
        // refresh, route change, or remount from dumping an in-progress exam back
        // to the dashboard or the next incomplete section.
        let restoredExactPlace = false;
        if (!autoResumeDoneRef.current && !viewUserId && !restoredPlaceRef.current && typeof window !== 'undefined') {
          try {
            const savedPlace = JSON.parse(window.localStorage.getItem(getAcademyPlaceKey(user.id)) || 'null') as { view?: ViewMode; dayId?: number; moduleId?: string; moduleIndex?: number } | null;
            if (savedPlace?.view === 'module' && savedPlace.moduleId) {
              const location = findModuleLocation(savedPlace.moduleId, updatedWeeks) ?? (
                typeof savedPlace.dayId === 'number' && typeof savedPlace.moduleIndex === 'number'
                  ? { dayId: savedPlace.dayId, moduleIndex: savedPlace.moduleIndex }
                  : null
              );
              if (location) {
                setActiveDay(location.dayId);
                setActiveModuleIndex(location.moduleIndex);
                setView('module');
                restoredExactPlace = true;
              }
            } else if (savedPlace?.view === 'dashboard') {
              setView('dashboard');
              restoredExactPlace = true;
            }
          } catch {
            window.localStorage.removeItem(getAcademyPlaceKey(user.id));
          }
          restoredPlaceRef.current = restoredExactPlace;
        }

        // Auto-resume only when no exact saved place exists. Realtime reloads after
        // a quiz, test, exam, or coaching autosave must never move the student.
        if (!autoResumeDoneRef.current && completedIds.size > 0 && !restoredExactPlace) {
          for (const day of allDays) {
            if (day.status === 'unlocked' || (day.status === 'completed' && day.id === allDays[allDays.length - 1]?.id)) {
              const firstIncomplete = day.modules.findIndex((m: any) => !completedIds.has(m.id));
              if (firstIncomplete >= 0) {
                setActiveDay(day.id);
                setActiveModuleIndex(firstIncomplete);
                break;
              }
            }
          }
        }
        autoResumeDoneRef.current = true;

        // Load review/coaching/quiz scores from DB (encoded as correct * 1000 + total)
        const loadedScores: Record<string, ReviewScore> = {};
        for (const p of progressData as any[]) {
          const decodedScore = decodeEncodedScore(p.score);
          if (decodedScore) {
            loadedScores[p.module_id] = decodedScore;
          }
        }
        setReviewScoresState(loadedScores);

        if (badgeData) {
          const earnedIds = new Set(badgeData.map((b: any) => b.badge_id));
          setBadges(prev => prev.map(b => ({ ...b, earned: earnedIds.has(b.id) })));
        }

        if (profileData) {
          const pd = profileData as any;
          setXp(pd.total_xp);
          setLevel(pd.level);
        }
      } catch (err) {
        console.error('Error loading progress:', err);
        if (mounted) setLoadError(err instanceof Error ? err.message : "Couldn't load progress");
      } finally {
        if (mounted) { setLoaded(true); setLoadError((prev) => prev); }
      }
    };

    const scheduleLoad = () => {
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
      reloadTimerRef.current = setTimeout(loadProgress, 120);
    };

    loadProgress();

    const channel = supabase
      .channel(`academy-progress-${targetUserId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_progress', filter: `user_id=eq.${targetUserId}` }, scheduleLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jae_user_progress', filter: `user_id=eq.${targetUserId}` }, scheduleLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${targetUserId}` }, scheduleLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jae_user_profiles', filter: `user_id=eq.${targetUserId}` }, scheduleLoad)
      .subscribe();

    return () => {
      mounted = false;
      clearTimeout(timeout);
      if (reloadTimerRef.current) clearTimeout(reloadTimerRef.current);
      supabase.removeChannel(channel);
    };
  }, [user, isManager, viewUserId, reloadNonce]);

  useEffect(() => {
    if (!user || viewUserId || !loaded || typeof window === 'undefined') return;
    window.localStorage.setItem(getAcademyPlaceKey(user.id), JSON.stringify({
      view,
      dayId: activeDay,
      moduleIndex: activeModuleIndex,
      moduleId: currentModule?.id ?? null,
      savedAt: new Date().toISOString(),
    }));
  }, [activeDay, activeModuleIndex, currentModule?.id, loaded, user, view, viewUserId]);

  const completeModule = useCallback(async (moduleId: string) => {
    if (completedModules.has(moduleId) || viewUserId) return;

    const mod = allModules.find(m => m.id === moduleId);
    const earnedXp = mod?.xp || 50;
    const newXp = xp + earnedXp;
    const newLevel = Math.floor(newXp / 250) + 1;

    // Optimistic update
    const nextCompleted = new Set(completedModules);
    nextCompleted.add(moduleId);
    setCompletedModules(nextCompleted);
    setXp(newXp);
    setLevel(newLevel);

    toast({
      title: `+${earnedXp} XP Earned!`,
      description: "Keep up the great work!",
    });

    // Badge checks
    const allDays = weeks.flatMap(w => w.days);
    const updatedBadges = [...badges];
    const badgeDayMap: Record<number, string> = { 1: 'b1', 2: 'b2', 3: 'b3', 4: 'b4', 6: 'b6', 7: 'b7', 8: 'b8', 9: 'b9' };
    const newBadges: { id: string; name: string }[] = [];

    for (const [dayId, badgeId] of Object.entries(badgeDayMap)) {
      const d = allDays.find(d => d.id === Number(dayId));
      if (d && d.modules.every(m => nextCompleted.has(m.id))) {
        const b = updatedBadges.find(b => b.id === badgeId);
        if (b && !b.earned) {
          b.earned = true;
          newBadges.push({ id: b.id, name: b.name });
        }
      }
    }
    if (allDays.every(d => d.modules.every(m => nextCompleted.has(m.id)))) {
      const b = updatedBadges.find(b => b.id === 'b10');
      if (b && !b.earned) {
        b.earned = true;
        newBadges.push({ id: b.id, name: b.name });
      }
    }
    setBadges(updatedBadges);

    // Unlock next day
    const currentDayObj = allDays.find(d => d.modules.some(m => m.id === moduleId));
    if (currentDayObj && currentDayObj.modules.every(m => nextCompleted.has(m.id))) {
      setWeeks(prev => {
        const updated = JSON.parse(JSON.stringify(prev));
        const allUpdatedDays = updated.flatMap((w: Week) => w.days);
        const nextDay = allUpdatedDays.find((d: any) => d.id === currentDayObj.id + 1);
        if (nextDay) nextDay.status = 'unlocked';
        const completedDay = allUpdatedDays.find((d: any) => d.id === currentDayObj.id);
        if (completedDay) completedDay.status = 'completed';
        return updated;
      });
    }

    // Persist to Supabase
    if (user) {
      const dayId = currentDayObj?.id || 1;
      // Preserve any score that was just recorded by setReviewScore() to avoid
      // a race where the un-scored upsert wipes the score column to NULL.
      const existingScore = reviewScores[moduleId];
      const upsertPayload: { user_id: string; day_id: number; module_id: string; status: string; completed_at: string; score?: number } = {
        user_id: user.id,
        day_id: dayId,
        module_id: moduleId,
        status: 'completed',
        completed_at: new Date().toISOString(),
      };
      if (existingScore && existingScore.total > 0) {
        upsertPayload.score = existingScore.correct * 1000 + existingScore.total;
      }
      await supabase.from(progressTable as any).upsert(upsertPayload as any, { onConflict: 'user_id,module_id' });

      for (const badge of newBadges) {
        await supabase.from('user_badges').upsert({
          user_id: user.id,
          badge_id: badge.id,
          badge_name: badge.name,
        }, { onConflict: 'user_id,badge_id' });
      }
    }
  }, [completedModules, xp, weeks, badges, allModules, user, reviewScores, progressTable, profilesTable, profileIdColumn]);

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

  const setReviewScore = useCallback(async (moduleId: string, score: ReviewScore, markCompleted: boolean = true) => {
    // Manager Student View must NEVER write to the student's row.
    if (viewUserId) return;
    const existing = reviewScores[moduleId];
    const bestScore = existing && (existing.correct > score.correct || (existing.correct === score.correct && existing.total <= score.total))
      ? existing
      : score;
    const encodedScore = bestScore.correct * 1000 + bestScore.total;
    setReviewScoresState(prev => {
      const existing = prev[moduleId];
      if (existing) {
        if (score.correct < existing.correct) return prev;
        if (score.correct === existing.correct && score.total >= existing.total) return prev;
      }
      return { ...prev, [moduleId]: bestScore };
    });

    // Persist encoded score to DB (correct * 1000 + total)
    if (user) {
      // Find the day_id for this module
      const modDay = weeks.flatMap(w => w.days).find(d => d.modules.some(m => m.id === moduleId));
      const dayId = modDay?.id || 1;
      if (!markCompleted && completedModules.has(moduleId) && existing && existing.correct >= score.correct) return;

      const payload: { user_id: string; day_id: number; module_id: string; score: number; status: string; completed_at?: string | null } = {
        user_id: user.id,
        day_id: dayId,
        module_id: moduleId,
        score: encodedScore,
        status: markCompleted ? 'completed' : 'active',
      };
      if (markCompleted) payload.completed_at = new Date().toISOString();

      // Use upsert to handle race condition where score is saved before completeModule creates the row.
      // Profile totals are recalculated by database triggers from completed rows only.
      const { error } = await supabase.from(progressTable as any).upsert(payload as any, { onConflict: 'user_id,module_id' });
      if (error) throw error;
    }
  }, [user, weeks, completedModules, progressTable, reviewScores, viewUserId]);

  const saveTowerScore = useCallback(async (floor: number, livesUsed?: number, timeSeconds?: number) => {
    if (!user) return;
    // Manager Student View must NEVER overwrite a student's tower score.
    if (viewUserId) return;
    // Tower scores live on the main profiles table — JAE members don't play
    // the Tower (their jae_user_profiles has no tower columns), so skip.
    if (isJaeMember) return;
    const updates: {
      updated_at: string;
      tower_best_floor: number;
      referriser_lives_used?: number;
      referriser_time_seconds?: number;
    } = { updated_at: new Date().toISOString(), tower_best_floor: floor };
    if (livesUsed != null) updates.referriser_lives_used = livesUsed;
    if (timeSeconds != null) updates.referriser_time_seconds = timeSeconds;
    await (supabase.from('profiles').update(updates as any) as any).eq('id', user.id);
  }, [user, isJaeMember, viewUserId]);

  return {
    weeks, badges, completedModules, xp, level,
    activeDay, activeModuleIndex, view, setView,
    totalModules, progressPercent, currentDay, currentModule, dayProgress,
    completeModule, navigateToModule, nextModule, prevModule, continueFromCurrent,
    setActiveDay, brandProgress, activeBrand, loaded, loadError, retryLoad,
    reviewScores, setReviewScore, saveTowerScore,
  };
}
