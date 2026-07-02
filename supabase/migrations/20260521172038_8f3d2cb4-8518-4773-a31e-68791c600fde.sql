-- Block B-#5: Leaderboard materialized view + smart refresh
-- Goal: pre-compute the heavy CTE so the realtime-debounced leaderboard
-- becomes a cheap index scan instead of a full re-aggregation.

create materialized view if not exists public.academy_leaderboard_mv as
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
  p.updated_at as profile_updated_at,
  coalesce(ps.modules_completed, 0)::integer as modules_completed,
  totals.total_modules,
  case when totals.total_modules > 0 then least(100, round((coalesce(ps.modules_completed, 0)::numeric / totals.total_modules) * 100)::integer) else 0 end as completion_pct,
  coalesce(ps.coaching_earned, 0)::integer as coaching_earned,
  totals.coaching_possible,
  case when totals.coaching_possible > 0 then least(100, round((coalesce(ps.coaching_earned, 0)::numeric / totals.coaching_possible) * 100)::integer) else 0 end as coaching_pct,
  case when coalesce(ps.scored_possible, 0) > 0 then least(100, round((coalesce(ps.scored_earned, 0)::numeric / ps.scored_possible) * 100)::integer) else 0 end as quiz_score_pct
from public.profiles p
cross join totals
left join progress_stats ps on ps.user_id = p.id;

-- Unique index required for CONCURRENTLY refresh
create unique index if not exists academy_leaderboard_mv_id_idx on public.academy_leaderboard_mv (id);
create index if not exists academy_leaderboard_mv_xp_idx on public.academy_leaderboard_mv (total_xp desc, modules_completed desc);

-- Initial populate
refresh materialized view public.academy_leaderboard_mv;

-- Smart refresh: only refresh if there has been a progress write in the last 5 minutes
create or replace function public.refresh_academy_leaderboard_if_active()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  _recent_writes integer;
begin
  select count(*) into _recent_writes
  from (
    select user_id from public.user_progress where created_at > now() - interval '5 minutes'
    union all
    select user_id from public.jae_user_progress where created_at > now() - interval '5 minutes'
  ) recent;

  if _recent_writes > 0 then
    refresh materialized view concurrently public.academy_leaderboard_mv;
  end if;
end;
$$;

comment on function public.refresh_academy_leaderboard_if_active() is
  'Conditionally refreshes academy_leaderboard_mv (CONCURRENTLY) only when there has been progress activity in the last 5 minutes. Invoked by pg_cron every 30s. SECURITY DEFINER because materialized view refresh requires owner privileges. Safe: takes no parameters, does not return user data.';

-- Rewrite the read RPC to consume the MV (massive speedup, identical shape)
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
  select
    mv.id, mv.full_name, mv.total_xp, mv.level,
    mv.last_completed_day, mv.last_completed_module_index,
    mv.tower_best_floor, mv.referriser_lives_used, mv.referriser_time_seconds,
    mv.modules_completed, mv.total_modules, mv.completion_pct,
    mv.coaching_earned, mv.coaching_possible, mv.coaching_pct,
    mv.quiz_score_pct
  from public.academy_leaderboard_mv mv
  where auth.uid() is not null
  order by mv.total_xp desc, mv.modules_completed desc, mv.profile_updated_at asc
  limit greatest(coalesce(_limit, 10), 1);
$$;

comment on function public.get_academy_leaderboard(integer) is
  'Public leaderboard read. SECURITY DEFINER so it can bypass profile RLS to compose the rankings, but gated by auth.uid() IS NOT NULL inside the body. Reads from academy_leaderboard_mv for sub-millisecond response.';

-- Enable pg_cron + pg_net for scheduled refresh
create extension if not exists pg_cron with schema public;
create extension if not exists pg_net with schema public;