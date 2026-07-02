-- Clean up duplicate trigger attachments and reinstall exactly one normalize + one sync trigger per progress table
DROP TRIGGER IF EXISTS normalize_user_progress_row ON public.user_progress;
DROP TRIGGER IF EXISTS sync_user_progress_profile ON public.user_progress;
DROP TRIGGER IF EXISTS sync_user_progress_profile_aiud ON public.user_progress;
DROP TRIGGER IF EXISTS sync_user_progress_profile_insert ON public.user_progress;
DROP TRIGGER IF EXISTS sync_user_progress_profile_update ON public.user_progress;
DROP TRIGGER IF EXISTS sync_user_progress_profile_delete ON public.user_progress;

DROP TRIGGER IF EXISTS normalize_jae_user_progress_row ON public.jae_user_progress;
DROP TRIGGER IF EXISTS sync_jae_user_progress_profile ON public.jae_user_progress;
DROP TRIGGER IF EXISTS sync_jae_user_progress_profile_aiud ON public.jae_user_progress;
DROP TRIGGER IF EXISTS sync_jae_user_progress_profile_insert ON public.jae_user_progress;
DROP TRIGGER IF EXISTS sync_jae_user_progress_profile_update ON public.jae_user_progress;
DROP TRIGGER IF EXISTS sync_jae_user_progress_profile_delete ON public.jae_user_progress;

CREATE OR REPLACE FUNCTION public.normalize_academy_progress_row()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  _module record;
  _correct integer;
  _possible integer;
begin
  select module_id, day_id, module_index, module_type, score_total
  into _module
  from public.academy_module_catalog
  where module_id = new.module_id
    and is_active
  limit 1;

  if found then
    new.day_id := _module.day_id;
  end if;

  if new.status = 'completed' then
    new.completed_at := coalesce(new.completed_at, now());

    if found and _module.module_type in ('coach-chat', 'quiz', 'review') and coalesce(_module.score_total, 0) > 0 then
      if new.score is null and tg_op = 'UPDATE' and old.score is not null and old.score > 0 then
        new.score := old.score;
      end if;

      if new.score is null or new.score <= 0 then
        new.score := (_module.score_total * 1000) + _module.score_total;
      else
        _correct := floor(new.score / 1000);
        _possible := new.score % 1000;
        if _possible <= 0 or _correct < 0 or _correct > _possible or _possible <> _module.score_total or _correct < _module.score_total then
          new.score := (_module.score_total * 1000) + _module.score_total;
        end if;
      end if;
    elsif tg_op = 'UPDATE' and new.score is null and old.score is not null then
      new.score := old.score;
    end if;
  elsif tg_op = 'UPDATE' and new.score is null and old.score is not null then
    new.score := old.score;
  end if;

  return new;
end;
$$;

CREATE OR REPLACE FUNCTION public.recalculate_academy_profile(_user_id uuid, _use_jae boolean DEFAULT false)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
declare
  _total_xp integer := 0;
  _level integer := 1;
  _last_day integer := 0;
  _last_module integer := 0;
  _score_earned integer := 0;
  _score_possible integer := 0;
  _score_pct integer := 0;
begin
  if _user_id is null then
    return;
  end if;

  if _use_jae then
    select
      coalesce(sum(c.xp), 0)::integer,
      coalesce((array_agg(c.day_id order by c.day_id desc, c.module_index desc))[1], 0),
      coalesce((array_agg(c.module_index order by c.day_id desc, c.module_index desc))[1], 0),
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer,
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer
    into _total_xp, _last_day, _last_module, _score_earned, _score_possible
    from public.jae_user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.user_id = _user_id and p.status = 'completed';

    _level := floor(coalesce(_total_xp, 0) / 250) + 1;
    _score_pct := case when coalesce(_score_possible, 0) > 0 then round((_score_earned::numeric / _score_possible) * 100)::integer else 0 end;

    insert into public.jae_user_profiles (user_id, total_xp, level, last_completed_day, last_completed_module_index, quiz_score_pct, updated_at)
    values (_user_id, coalesce(_total_xp, 0), _level, coalesce(_last_day, 0), coalesce(_last_module, 0), _score_pct, now())
    on conflict (user_id) do update set
      total_xp = excluded.total_xp,
      level = excluded.level,
      last_completed_day = excluded.last_completed_day,
      last_completed_module_index = excluded.last_completed_module_index,
      quiz_score_pct = excluded.quiz_score_pct,
      updated_at = now();
  else
    select
      coalesce(sum(c.xp), 0)::integer,
      coalesce((array_agg(c.day_id order by c.day_id desc, c.module_index desc))[1], 0),
      coalesce((array_agg(c.module_index order by c.day_id desc, c.module_index desc))[1], 0),
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer,
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer
    into _total_xp, _last_day, _last_module, _score_earned, _score_possible
    from public.user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.user_id = _user_id
      and p.status = 'completed'
      and not public.is_jae_member(_user_id);

    _level := floor(coalesce(_total_xp, 0) / 250) + 1;
    _score_pct := case when coalesce(_score_possible, 0) > 0 then round((_score_earned::numeric / _score_possible) * 100)::integer else 0 end;

    update public.profiles
    set total_xp = coalesce(_total_xp, 0),
        level = _level,
        last_completed_day = coalesce(_last_day, 0),
        last_completed_module_index = coalesce(_last_module, 0),
        quiz_score_pct = _score_pct,
        updated_at = now()
    where id = _user_id;
  end if;
end;
$$;

CREATE OR REPLACE FUNCTION public.sync_user_progress_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
begin
  perform public.recalculate_academy_profile(
    coalesce(new.user_id, old.user_id),
    tg_table_name = 'jae_user_progress'
  );
  return coalesce(new, old);
end;
$$;

CREATE TRIGGER normalize_user_progress_row
BEFORE INSERT OR UPDATE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION public.normalize_academy_progress_row();

CREATE TRIGGER sync_user_progress_profile
AFTER INSERT OR UPDATE OR DELETE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION public.sync_user_progress_profile();

CREATE TRIGGER normalize_jae_user_progress_row
BEFORE INSERT OR UPDATE ON public.jae_user_progress
FOR EACH ROW EXECUTE FUNCTION public.normalize_academy_progress_row();

CREATE TRIGGER sync_jae_user_progress_profile
AFTER INSERT OR UPDATE OR DELETE ON public.jae_user_progress
FOR EACH ROW EXECUTE FUNCTION public.sync_user_progress_profile();

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
  where not public.is_jae_member(p.id)
  order by p.total_xp desc, coalesce(ps.modules_completed, 0) desc, p.updated_at asc
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
      count(distinct p.module_id)::integer as completed_modules,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type = 'coach-chat' and coalesce(c.score_total, 0) > 0), 0)::integer as coaching_earned
    from public.user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.status = 'completed'
      and not public.is_jae_member(p.user_id)
    group by p.user_id
  )
  select
    p.id,
    coalesce(nullif(p.full_name, ''), 'Unnamed') as full_name,
    p.total_xp,
    p.level,
    p.last_completed_day,
    p.last_completed_module_index,
    p.tower_best_floor,
    p.referriser_lives_used,
    p.referriser_time_seconds,
    coalesce(ps.completed_modules, 0)::integer as completed_modules,
    totals.total_modules,
    case when totals.total_modules > 0 then least(100, round((coalesce(ps.completed_modules, 0)::numeric / totals.total_modules) * 100)::integer) else 0 end as completion_pct,
    coalesce(ps.coaching_earned, 0)::integer as coaching_earned,
    totals.coaching_possible,
    case when totals.coaching_possible > 0 then least(100, round((coalesce(ps.coaching_earned, 0)::numeric / totals.coaching_possible) * 100)::integer) else 0 end as coaching_pct,
    p.quiz_score_pct
  from public.profiles p
  cross join totals
  left join progress_stats ps on ps.user_id = p.id
  where not public.is_jae_member(p.id)
    and (auth.uid() = p.id or public.has_role(auth.uid(), 'manager'::app_role))
  order by p.total_xp desc, coalesce(ps.completed_modules, 0) desc, p.updated_at asc;
$$;

REVOKE ALL ON FUNCTION public.get_academy_leaderboard(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_academy_manager_stats() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_academy_leaderboard(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_academy_manager_stats() TO authenticated;