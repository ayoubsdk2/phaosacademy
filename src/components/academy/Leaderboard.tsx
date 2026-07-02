import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LeaderEntry {
  id: string;
  full_name: string;
  total_xp: number;
  level: number;
  last_completed_day: number;
  last_completed_module_index: number;
  tower_best_floor: number;
  modules_completed: number;
  total_modules: number;
  completion_pct: number;
  coaching_earned: number;
  coaching_possible: number;
  coaching_pct: number;
  referriser_lives_used: number;
  referriser_time_seconds: number;
}

const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

function formatTime(seconds: number): string {
  if (seconds <= 0) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
}

export function Leaderboard() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await (supabase as any).rpc('get_academy_leaderboard', { _limit: 1000 });
      if (error) {
        console.error('Leaderboard load error:', error);
        return;
      }
      setLeaders((data || []) as LeaderEntry[]);
    };
    load();

    // 1s debounce: bursts of score updates trigger 1 refetch instead of N.
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const debouncedLoad = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(load, 1000);
    };

    const channel = supabase
      .channel('leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, debouncedLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jae_user_profiles' }, debouncedLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_progress' }, debouncedLoad)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'jae_user_progress' }, debouncedLoad)
      .subscribe();

    return () => { if (debounceTimer) clearTimeout(debounceTimer); supabase.removeChannel(channel); };
  }, []);

  if (leaders.length === 0) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <section className="mb-10">
        {/* Mobile title */}
        <h3 className="md:hidden text-2xl font-extrabold text-foreground tracking-widest flex items-center gap-3 mb-2 px-5">
          <Trophy size={28} className="text-xp" /> Leaderboard
        </h3>

        <div className="card-surface overflow-hidden">
          {/* Desktop header row */}
          <div className="relative hidden md:block border-b border-border bg-secondary/30 px-5 py-4">
            <div className="absolute inset-y-0 left-5 flex items-center">
              <div className="flex items-center gap-3 text-2xl font-extrabold tracking-widest text-foreground">
                <Trophy size={28} className="text-xp" />
                <span>Leaderboard</span>
              </div>
            </div>

            <div className="grid grid-cols-[48px_40px_1fr_repeat(5,minmax(0,1fr))] gap-4 items-center">
              <span />
              <span />
              <span />
              <span className="text-center text-sm font-bold leading-tight text-foreground">Total<br/>Completed</span>
              <span className="text-center text-sm font-bold leading-tight text-foreground">Modules<br/>Completed</span>
              <span className="text-center text-sm font-bold leading-tight text-foreground">Coaching<br/>Scores</span>
              <span className="text-center text-sm font-bold leading-tight text-foreground">Total<br/>Points</span>
              <span className="text-center text-sm font-bold leading-tight text-foreground">ReferRiser<br/>Results</span>
            </div>
          </div>
          {leaders.map((leader, i) => {
            const hasReferRiser = leader.tower_best_floor > 0;
            const referRiserCompleted = leader.tower_best_floor >= 100;
            return (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`grid grid-cols-[48px_40px_1fr] md:grid-cols-[48px_40px_1fr_repeat(5,minmax(0,1fr))] gap-4 items-center px-5 py-4 ${i < leaders.length - 1 ? 'border-b border-border' : ''}`}
              >
                {/* Rank */}
                <span className={`font-extrabold text-xl text-center shrink-0 ${i < 3 ? medalColors[i] : 'text-muted-foreground'}`}>
                  {i + 1}
                </span>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                  {leader.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'NH'}
                </div>

                {/* Name + Level */}
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-base truncate">{leader.full_name || 'New Hire'}</p>
                  <p className="text-sm text-muted-foreground">Level {leader.level}</p>
                </div>

                {/* Total Completed % */}
                <span className="hidden md:block text-sm font-bold text-foreground text-center tabular-nums">
                  {leader.modules_completed > 0 ? `${leader.completion_pct}%` : '—'}
                </span>

                {/* Modules Completed */}
                <span className="hidden md:block text-sm text-muted-foreground text-center">
                  {leader.last_completed_day > 0 ? `Day ${leader.last_completed_day}, Module ${leader.last_completed_module_index}` : '—'}
                </span>

                {/* Coaching Scores — percentage with hover tooltip */}
                <div className="hidden md:flex justify-center">
                  {leader.coaching_earned > 0 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className={`text-sm font-bold tabular-nums cursor-default ${
                          leader.coaching_pct >= 80 ? 'text-success' : leader.coaching_pct >= 60 ? 'text-warning' : 'text-muted-foreground'
                        }`}>
                          {leader.coaching_pct}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold tabular-nums">{leader.coaching_earned} / {leader.coaching_possible}</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>

                {/* Total Points */}
                <div className="hidden md:flex items-center justify-center gap-1.5">
                  <Zap size={16} className="text-xp fill-xp" />
                  <span className="font-bold text-foreground tabular-nums text-sm">
                    {leader.total_xp.toLocaleString()}
                  </span>
                </div>

                {/* ReferRiser Results */}
                <div className="hidden md:flex flex-col items-center justify-center">
                  {hasReferRiser ? (() => {
                    if (!referRiserCompleted) {
                      return <span className="text-sm font-bold text-destructive">Failed</span>;
                    }
                    const pct = Math.max(0, 100 - leader.referriser_lives_used);
                    return (
                      <span className={`text-sm font-bold tabular-nums ${pct >= 98 ? 'text-success' : pct >= 95 ? 'text-warning' : 'text-muted-foreground'}`}>
                        {pct}%
                      </span>
                    );
                  })() : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </div>

                {/* Mobile: just show XP */}
                <div className="flex md:hidden items-center gap-1.5 col-span-3 justify-end -mt-2">
                  <Zap size={14} className="text-xp fill-xp" />
                  <span className="font-bold text-foreground tabular-nums text-sm">{leader.total_xp.toLocaleString()}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </TooltipProvider>
  );
}
