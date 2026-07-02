CREATE OR REPLACE FUNCTION public.get_academy_leaderboard(_limit integer DEFAULT 10)
RETURNS TABLE (
  id uuid,
  full_name text,
  total_xp integer,
  level integer,
  last_completed_day integer,
  last_completed_module_index integer,
  tower_best_floor integer,
  referriser_lives_used integer,
  referriser_time_seconds integer,
  modules_completed integer,
  total_modules integer,
  completion_pct integer,
  coaching_earned integer,
  coaching_possible integer,
  coaching_pct integer,
  quiz_score_pct integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  with totals as (
    select
      count(*)::integer as total_modules,
      coalesce(sum(score_total) filter (where module_type = 'coach-chat' and coalesce(score_total, 0) > 0), 0)::integer as coaching_possible
    from public.academy_module_catalog
    where is_active
  ), progress_stats as (
    select
      p.user_id,
      count(distinct p.module_id)::integer as modules_completed,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type = 'coach-chat' and coalesce(c.score_total, 0) > 0), 0)::integer as coaching_earned
    from public.user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.status = 'completed'
      and not public.is_jae_member(p.user_id)
    group by p.user_id
  )
  select
    p.id,
    p.full_name,
    p.total_xp,
    p.level,
    p.last_completed_day,
    p.last_completed_module_index,
    p.tower_best_floor,
    p.referriser_lives_used,
    p.referriser_time_seconds,
    coalesce(ps.modules_completed, 0)::integer as modules_completed,
    totals.total_modules,
    case when totals.total_modules > 0 then least(100, round((coalesce(ps.modules_completed, 0)::numeric / totals.total_modules) * 100)::integer) else 0 end as completion_pct,
    coalesce(ps.coaching_earned, 0)::integer as coaching_earned,
    totals.coaching_possible,
    case when totals.coaching_possible > 0 then least(100, round((coalesce(ps.coaching_earned, 0)::numeric / totals.coaching_possible) * 100)::integer) else 0 end as coaching_pct,
    p.quiz_score_pct
  from public.profiles p
  cross join totals
  left join progress_stats ps on ps.user_id = p.id
  where auth.uid() is not null
    and not public.is_jae_member(p.id)
  order by p.total_xp desc, coalesce(ps.modules_completed, 0) desc, p.updated_at asc
  limit greatest(coalesce(_limit, 10), 1);
$$;

REVOKE ALL ON FUNCTION public.get_academy_leaderboard(integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_academy_manager_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_academy_leaderboard(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_academy_manager_stats() TO authenticated;