create or replace function public.get_academy_leaderboard(_limit integer default 10)
returns table(
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
language sql
stable
security definer
set search_path = public
as $$
  with totals as (
    select
      count(*)::integer as total_modules,
      coalesce(sum(score_total) filter (where module_type = 'coach-chat' and coalesce(score_total, 0) > 0), 0)::integer as coaching_possible
    from public.academy_module_catalog
    where is_active
  ), all_completed_progress as (
    select user_id, module_id, score, completed_at
    from public.user_progress
    where status = 'completed'
    union all
    select user_id, module_id, score, completed_at
    from public.jae_user_progress
    where status = 'completed'
  ), progress_by_module as (
    select
      user_id,
      module_id,
      max(coalesce(score, 0))::integer as score,
      max(completed_at) as completed_at
    from all_completed_progress
    group by user_id, module_id
  ), progress_stats as (
    select
      p.user_id,
      count(distinct c.module_id)::integer as modules_completed,
      coalesce(sum(c.xp), 0)::integer as total_xp,
      coalesce(max(c.day_id * 1000 + c.module_index), 0)::integer as last_key,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type = 'coach-chat' and coalesce(c.score_total, 0) > 0), 0)::integer as coaching_earned,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer as scored_earned,
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer as scored_possible
    from progress_by_module p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    group by p.user_id
  )
  select
    p.id,
    coalesce(nullif(p.full_name, ''), 'New Hire') as full_name,
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
  order by coalesce(ps.total_xp, 0) desc, coalesce(ps.modules_completed, 0) desc, p.updated_at asc
  limit greatest(coalesce(_limit, 10), 1);
$$;

create or replace function public.get_academy_manager_stats()
returns table(
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
language sql
stable
security definer
set search_path = public
as $$
  with totals as (
    select
      count(*)::integer as total_modules,
      coalesce(sum(score_total) filter (where module_type = 'coach-chat' and coalesce(score_total, 0) > 0), 0)::integer as coaching_possible
    from public.academy_module_catalog
    where is_active
  ), all_completed_progress as (
    select user_id, module_id, score, completed_at
    from public.user_progress
    where status = 'completed'
    union all
    select user_id, module_id, score, completed_at
    from public.jae_user_progress
    where status = 'completed'
  ), progress_by_module as (
    select
      user_id,
      module_id,
      max(coalesce(score, 0))::integer as score,
      max(completed_at) as completed_at
    from all_completed_progress
    group by user_id, module_id
  ), progress_stats as (
    select
      p.user_id,
      count(distinct c.module_id)::integer as completed_modules,
      coalesce(sum(c.xp), 0)::integer as total_xp,
      coalesce(max(c.day_id * 1000 + c.module_index), 0)::integer as last_key,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type = 'coach-chat' and coalesce(c.score_total, 0) > 0), 0)::integer as coaching_earned,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer as scored_earned,
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer as scored_possible
    from progress_by_module p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
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
  where auth.uid() = p.id or public.has_role(auth.uid(), 'manager'::app_role)
  order by coalesce(ps.total_xp, 0) desc, coalesce(ps.completed_modules, 0) desc, p.updated_at asc;
$$;

revoke all on function public.get_academy_leaderboard(integer) from public, anon;
revoke all on function public.get_academy_manager_stats() from public, anon;
grant execute on function public.get_academy_leaderboard(integer) to authenticated;
grant execute on function public.get_academy_manager_stats() to authenticated;