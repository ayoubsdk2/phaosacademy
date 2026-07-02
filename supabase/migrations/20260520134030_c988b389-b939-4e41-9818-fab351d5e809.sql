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
      count(distinct c.module_id)::integer as modules_completed,
      coalesce(sum(c.xp), 0)::integer as total_xp,
      coalesce(max(c.day_id * 1000 + c.module_index), 0)::integer as last_key,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type = 'coach-chat' and coalesce(c.score_total, 0) > 0), 0)::integer as coaching_earned,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer as scored_earned,
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer as scored_possible
    from public.user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.status = 'completed'
      and not public.is_jae_member(p.user_id)
    group by p.user_id
  )
  select
    p.id,
    p.full_name,
    coalesce(ps.total_xp, 0)::integer as total_xp,
    (floor(coalesce(ps.total_xp, 0) / 250) + 1)::integer as level,
    (coalesce(ps.last_key, 0) / 1000)::integer as last_completed_day,
    (coalesce(ps.last_key, 0) % 1000)::integer as last_completed_module_index,
    p.tower_best_floor,
    p.referriser_lives_used,
    p.referriser_time_seconds,
    coalesce(ps.modules_completed, 0)::integer as modules_completed,
    totals.total_modules,
    case when totals.total_modules > 0 then least(100, round((coalesce(ps.modules_completed, 0)::numeric / totals.total_modules) * 100)::integer) else 0 end as completion_pct,
    coalesce(ps.coaching_earned, 0)::integer as coaching_earned,
    totals.coaching_possible,
    case when totals.coaching_possible > 0 then least(100, round((coalesce(ps.coaching_earned, 0)::numeric / totals.coaching_possible) * 100)::integer) else 0 end as coaching_pct,
    case when coalesce(ps.scored_possible, 0) > 0 then least(100, round((coalesce(ps.scored_earned, 0)::numeric / ps.scored_possible) * 100)::integer) else 0 end as quiz_score_pct
  from public.profiles p
  cross join totals
  left join progress_stats ps on ps.user_id = p.id
  where auth.uid() is not null
    and not public.is_jae_member(p.id)
  order by coalesce(ps.total_xp, 0) desc, coalesce(ps.modules_completed, 0) desc, p.updated_at asc
  limit greatest(coalesce(_limit, 10), 1);
$$;

CREATE OR REPLACE FUNCTION public.get_academy_manager_stats()
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
  completed_modules integer,
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
      count(distinct c.module_id)::integer as completed_modules,
      coalesce(sum(c.xp), 0)::integer as total_xp,
      coalesce(max(c.day_id * 1000 + c.module_index), 0)::integer as last_key,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type = 'coach-chat' and coalesce(c.score_total, 0) > 0), 0)::integer as coaching_earned,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer as scored_earned,
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer as scored_possible
    from public.user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.status = 'completed'
      and not public.is_jae_member(p.user_id)
    group by p.user_id
  )
  select
    p.id,
    coalesce(nullif(p.full_name, ''), 'Unnamed') as full_name,
    coalesce(ps.total_xp, 0)::integer as total_xp,
    (floor(coalesce(ps.total_xp, 0) / 250) + 1)::integer as level,
    (coalesce(ps.last_key, 0) / 1000)::integer as last_completed_day,
    (coalesce(ps.last_key, 0) % 1000)::integer as last_completed_module_index,
    p.tower_best_floor,
    p.referriser_lives_used,
    p.referriser_time_seconds,
    coalesce(ps.completed_modules, 0)::integer as completed_modules,
    totals.total_modules,
    case when totals.total_modules > 0 then least(100, round((coalesce(ps.completed_modules, 0)::numeric / totals.total_modules) * 100)::integer) else 0 end as completion_pct,
    coalesce(ps.coaching_earned, 0)::integer as coaching_earned,
    totals.coaching_possible,
    case when totals.coaching_possible > 0 then least(100, round((coalesce(ps.coaching_earned, 0)::numeric / totals.coaching_possible) * 100)::integer) else 0 end as coaching_pct,
    case when coalesce(ps.scored_possible, 0) > 0 then least(100, round((coalesce(ps.scored_earned, 0)::numeric / ps.scored_possible) * 100)::integer) else 0 end as quiz_score_pct
  from public.profiles p
  cross join totals
  left join progress_stats ps on ps.user_id = p.id
  where not public.is_jae_member(p.id)
    and (auth.uid() = p.id or public.has_role(auth.uid(), 'manager'::app_role))
  order by coalesce(ps.total_xp, 0) desc, coalesce(ps.completed_modules, 0) desc, p.updated_at asc;
$$;

REVOKE ALL ON FUNCTION public.get_academy_leaderboard(integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_academy_manager_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_academy_leaderboard(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_academy_manager_stats() TO authenticated;