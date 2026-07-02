alter table public.academy_module_catalog
  add column if not exists score_total integer;

create or replace function public.normalize_academy_progress_row()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
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
  end if;

  return new;
end;
$$;

drop trigger if exists normalize_user_progress_row on public.user_progress;
create trigger normalize_user_progress_row
before insert or update on public.user_progress
for each row
execute function public.normalize_academy_progress_row();

drop trigger if exists normalize_jae_user_progress_row on public.jae_user_progress;
create trigger normalize_jae_user_progress_row
before insert or update on public.jae_user_progress
for each row
execute function public.normalize_academy_progress_row();

create or replace function public.recalculate_academy_profile(_user_id uuid, _use_jae boolean default false)
returns void
language plpgsql
security definer
set search_path to 'public'
as $$
declare
  _total_xp integer := 0;
  _level integer := 1;
  _last_day integer := 0;
  _last_module integer := 0;
  _total_correct integer := 0;
  _total_possible integer := 0;
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
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer,
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer
    into _total_xp, _last_day, _last_module, _total_correct, _total_possible
    from public.jae_user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.user_id = _user_id and p.status = 'completed';

    _level := floor(coalesce(_total_xp, 0) / 250) + 1;
    _score_pct := case when coalesce(_total_possible, 0) > 0 then 100 else 0 end;

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
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer,
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer
    into _total_xp, _last_day, _last_module, _total_correct, _total_possible
    from public.user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.user_id = _user_id
      and p.status = 'completed'
      and not public.is_jae_member(_user_id);

    _level := floor(coalesce(_total_xp, 0) / 250) + 1;
    _score_pct := case when coalesce(_total_possible, 0) > 0 then 100 else 0 end;

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

create or replace function public.sync_user_progress_profile()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $$
begin
  perform public.recalculate_academy_profile(coalesce(new.user_id, old.user_id), tg_table_name = 'jae_user_progress');
  return coalesce(new, old);
end;
$$;

drop trigger if exists sync_user_progress_profile_insert on public.user_progress;
drop trigger if exists sync_user_progress_profile_update on public.user_progress;
drop trigger if exists sync_user_progress_profile_delete on public.user_progress;
drop trigger if exists sync_jae_user_progress_profile_insert on public.jae_user_progress;
drop trigger if exists sync_jae_user_progress_profile_update on public.jae_user_progress;
drop trigger if exists sync_jae_user_progress_profile_delete on public.jae_user_progress;

create trigger sync_user_progress_profile_insert
after insert on public.user_progress
for each row
execute function public.sync_user_progress_profile();

create trigger sync_user_progress_profile_update
after update on public.user_progress
for each row
execute function public.sync_user_progress_profile();

create trigger sync_user_progress_profile_delete
after delete on public.user_progress
for each row
execute function public.sync_user_progress_profile();

create trigger sync_jae_user_progress_profile_insert
after insert on public.jae_user_progress
for each row
execute function public.sync_user_progress_profile();

create trigger sync_jae_user_progress_profile_update
after update on public.jae_user_progress
for each row
execute function public.sync_user_progress_profile();

create trigger sync_jae_user_progress_profile_delete
after delete on public.jae_user_progress
for each row
execute function public.sync_user_progress_profile();