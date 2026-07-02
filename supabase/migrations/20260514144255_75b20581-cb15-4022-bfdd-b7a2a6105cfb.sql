create table if not exists public.academy_module_catalog (
  module_id text primary key,
  day_id integer not null,
  module_index integer not null,
  xp integer not null default 0,
  module_type text not null,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.academy_module_catalog enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'academy_module_catalog'
      and policyname = 'Authenticated users can read academy module catalog'
  ) then
    create policy "Authenticated users can read academy module catalog"
    on public.academy_module_catalog
    for select
    to authenticated
    using (true);
  end if;
end $$;

insert into public.academy_module_catalog (module_id, day_id, module_index, xp, module_type, is_active)
values
('1-1',1,1,75,'letter',true),
('1-2',1,2,50,'reading',true),
('1-3',1,3,50,'video',true),
('1-4',1,4,50,'video',true),
('1-5',1,5,50,'video',true),
('1-6',1,6,50,'reading',true),
('1-7',1,7,50,'reading',true),
('1-8',1,8,50,'flipcards',true),
('1-9',1,9,50,'reading',true),
('1-10',1,10,50,'reading',true),
('1-12',1,11,50,'reading',true),
('1-13',1,12,50,'reading',true),
('1-14',1,13,50,'letter-andre',true),
('1-15',1,14,75,'roleplay',true),
('1-16',1,15,50,'flipcards',true),
('1-17',1,16,100,'quiz',true),
('2-1',2,1,75,'letter-daniel',true),
('2-2',2,2,50,'reading',true),
('2-3',2,3,50,'reading',true),
('2-4',2,4,50,'video',true),
('2-5a',2,5,50,'reading',true),
('2-5b',2,6,50,'reading',true),
('2-5c',2,7,50,'reading',true),
('2-5d',2,8,50,'reading',true),
('2-5e',2,9,50,'reading',true),
('2-7',2,10,50,'reading',true),
('2-8',2,11,50,'reading',true),
('2-9',2,12,50,'reading',true),
('2-13',2,13,50,'audio',true),
('2-14',2,14,50,'flipcards',true),
('2-14b',2,15,50,'flipcards',true),
('2-15',2,16,75,'roleplay',true),
('2-16',2,17,75,'roleplay',true),
('2-17',2,18,75,'roleplay',true),
('2-18',2,19,100,'quiz',true),
('3-1',3,1,50,'reading',true),
('3-1-review',3,2,25,'review',true),
('3-2',3,3,50,'reading',true),
('3-2-review',3,4,25,'review',true),
('3-3a',3,5,50,'reading',true),
('3-3a-review',3,6,25,'review',true),
('3-3b',3,7,50,'reading',true),
('3-3b-review',3,8,25,'review',true),
('3-5a',3,9,50,'reading',true),
('3-5a-review',3,10,25,'review',true),
('3-5b',3,11,50,'reading',true),
('3-5b-review',3,12,25,'review',true),
('3-5c',3,13,50,'reading',true),
('3-5c-review',3,14,25,'review',true),
('3-7',3,15,50,'reading',true),
('3-7-review',3,16,25,'review',true),
('3-8',3,17,50,'audio',true),
('3-9',3,18,75,'roleplay',true),
('3-10',3,19,75,'roleplay',true),
('3-11',3,20,100,'quiz',true),
('4-1',4,1,50,'reading',true),
('4-1-review',4,2,25,'review',true),
('4-2',4,3,50,'reading',true),
('4-2-review',4,4,25,'review',true),
('4-3',4,5,50,'reading',true),
('4-3-review',4,6,25,'review',true),
('4-4',4,7,50,'reading',true),
('4-4-review',4,8,25,'review',true),
('4-5',4,9,50,'reading',true),
('4-5-review',4,10,25,'review',true),
('4-6',4,11,50,'video',true),
('4-7',4,12,50,'reading',true),
('4-7-review',4,13,25,'review',true),
('4-8',4,14,75,'coach-chat',true),
('4-9',4,15,75,'coach-chat',true),
('4-10',4,16,75,'coach-chat',true),
('4-11',4,17,100,'quiz',true),
('5-1',5,1,50,'reading',true),
('5-1-review',5,2,25,'review',true),
('5-2',5,3,50,'reading',true),
('5-2-review',5,4,25,'review',true),
('5-3',5,5,50,'reading',true),
('5-3-review',5,6,25,'review',true),
('5-4',5,7,50,'reading',true),
('5-4-review',5,8,25,'review',true),
('5-5',5,9,50,'reading',true),
('5-5-review',5,10,25,'review',true),
('5-6',5,11,50,'audio',true),
('5-7',5,12,75,'coach-chat',true),
('5-8',5,13,75,'coach-chat',true),
('5-9',5,14,75,'roleplay',true),
('5-10',5,15,100,'quiz',true),
('5-w1-exam',5,16,200,'quiz',true),
('6-1',6,1,75,'letter',true),
('6-2',6,2,50,'video',true),
('6-3',6,3,50,'reading',true),
('6-3-review',6,4,25,'review',true),
('6-4',6,5,50,'reading',true),
('6-4-review',6,6,25,'review',true),
('6-5',6,7,50,'reading',true),
('6-5-review',6,8,25,'review',true),
('6-6',6,9,50,'reading',true),
('6-6-review',6,10,25,'review',true),
('6-7',6,11,50,'reading',true),
('6-7-review',6,12,25,'review',true),
('6-8',6,13,50,'reading',true),
('6-8-review',6,14,25,'review',true),
('6-9',6,15,50,'audio',true),
('6-10',6,16,75,'coach-chat',true),
('6-11',6,17,75,'roleplay',true),
('6-12',6,18,100,'quiz',true),
('7-1',7,1,75,'letter-daniel',true),
('7-2',7,2,50,'video',true),
('7-3',7,3,50,'reading',true),
('7-3-review',7,4,25,'review',true),
('7-4',7,5,50,'reading',true),
('7-4-review',7,6,25,'review',true),
('7-5',7,7,50,'reading',true),
('7-5-review',7,8,25,'review',true),
('7-6',7,9,50,'reading',true),
('7-6-review',7,10,25,'review',true),
('7-7',7,11,50,'audio',true),
('7-8',7,12,75,'coach-chat',true),
('7-9',7,13,75,'coach-chat',true),
('7-10',7,14,75,'roleplay',true),
('7-11',7,15,100,'quiz',true),
('8-1',8,1,75,'letter-andre',true),
('8-2',8,2,50,'video',true),
('8-3',8,3,50,'reading',true),
('8-3-review',8,4,25,'review',true),
('8-4',8,5,50,'reading',true),
('8-4-review',8,6,25,'review',true),
('8-5',8,7,50,'reading',true),
('8-5-review',8,8,25,'review',true),
('8-6',8,9,50,'reading',true),
('8-6-review',8,10,25,'review',true),
('8-7',8,11,50,'audio',true),
('8-8',8,12,75,'coach-chat',true),
('8-9',8,13,75,'coach-chat',true),
('8-10',8,14,75,'roleplay',true),
('8-11',8,15,100,'quiz',true),
('9-1',9,1,75,'letter-daniel',true),
('9-2',9,2,50,'video',true),
('9-3',9,3,50,'reading',true),
('9-3-review',9,4,25,'review',true),
('9-4',9,5,50,'reading',true),
('9-4-review',9,6,25,'review',true),
('9-5',9,7,50,'reading',true),
('9-5-review',9,8,25,'review',true),
('9-6',9,9,50,'reading',true),
('9-6-review',9,10,25,'review',true),
('9-7',9,11,50,'audio',true),
('9-8',9,12,75,'coach-chat',true),
('9-9',9,13,75,'coach-chat',true),
('9-10',9,14,75,'roleplay',true),
('9-11',9,15,100,'quiz',true),
('10-1',10,1,75,'letter',true),
('10-2',10,2,50,'video',true),
('10-3',10,3,50,'reading',true),
('10-3-review',10,4,25,'review',true),
('10-4',10,5,50,'reading',true),
('10-4-review',10,6,25,'review',true),
('10-5',10,7,50,'reading',true),
('10-5-review',10,8,25,'review',true),
('10-6',10,9,50,'reading',true),
('10-6-review',10,10,25,'review',true),
('10-7',10,11,50,'audio',true),
('10-8',10,12,75,'coach-chat',true),
('10-9',10,13,75,'coach-chat',true),
('10-10',10,14,75,'roleplay',true),
('10-11',10,15,100,'quiz',true),
('10-final-interview',10,16,150,'chatbot',true),
('10-referrisers',10,17,300,'tower-game',true),
('r1-1',1,17,50,'reading',true),
('r1-2',1,18,50,'reading',true),
('r1-3',1,19,50,'reading',true),
('r1-4',1,20,50,'reading',true),
('r1-5',1,21,50,'reading',true),
('r1-6',1,22,50,'reading',true),
('r1-7',1,23,50,'reading',true),
('r1-8',1,24,50,'reading',true),
('r1-9',1,25,50,'reading',true),
('r1-10',1,26,50,'reading',true),
('r1-11',1,27,50,'reading',true),
('r1-12',1,28,50,'reading',true),
('r1-13',1,29,50,'reading',true),
('r1-14',1,30,50,'reading',true),
('r1-15',1,31,50,'reading',true),
('r1-16',1,32,50,'reading',true),
('r1-17',1,33,50,'reading',true),
('r1-18',1,34,50,'reading',true),
('r1-19',1,35,50,'reading',true),
('r1-20',1,36,50,'reading',true),
('r1-21',1,37,50,'reading',true),
('r1-22',1,38,50,'reading',true),
('r2-1',2,20,50,'reading',true),
('r2-2',2,21,50,'reading',true),
('r2-3',2,22,50,'reading',true),
('r2-4',2,23,50,'reading',true),
('r2-5',2,24,50,'reading',true),
('r2-6',2,25,50,'reading',true),
('r2-7',2,26,50,'reading',true),
('r2-8',2,27,50,'reading',true),
('r2-9',2,28,50,'reading',true),
('r2-10',2,29,50,'reading',true),
('r2-11',2,30,50,'reading',true),
('r2-12',2,31,50,'reading',true),
('r2-13',2,32,50,'reading',true),
('r2-14',2,33,50,'reading',true),
('r2-15',2,34,50,'reading',true),
('r2-16',2,35,50,'reading',true),
('r2-17',2,36,50,'reading',true),
('r2-18',2,37,50,'reading',true),
('r2-19',2,38,50,'reading',true),
('r2-20',2,39,50,'reading',true),
('r2-21',2,40,50,'reading',true),
('r2-22',2,41,50,'reading',true),
('r2-23',2,42,50,'reading',true),
('r3-1',3,21,50,'reading',true),
('r3-2',3,22,50,'reading',true),
('r3-3',3,23,50,'reading',true),
('r3-4',3,24,50,'reading',true),
('r3-5',3,25,50,'reading',true),
('r3-6',3,26,50,'reading',true),
('r3-7',3,27,50,'reading',true),
('r3-8',3,28,50,'reading',true),
('r3-9',3,29,50,'reading',true),
('r3-10',3,30,50,'reading',true),
('r3-11',3,31,50,'reading',true),
('r3-12',3,32,50,'reading',true),
('r3-13',3,33,50,'reading',true),
('r3-14',3,34,50,'reading',true),
('r3-15',3,35,50,'reading',true),
('r3-16',3,36,50,'reading',true),
('r3-17',3,37,50,'reading',true),
('r3-18',3,38,50,'reading',true),
('r3-19',3,39,50,'reading',true),
('r3-20',3,40,50,'reading',true),
('r4-1',4,18,50,'reading',true),
('r4-2',4,19,50,'reading',true),
('r4-3',4,20,50,'reading',true),
('r4-4',4,21,50,'reading',true),
('r4-5',4,22,50,'reading',true),
('r4-6',4,23,50,'reading',true),
('r4-7',4,24,50,'reading',true),
('r4-8',4,25,50,'reading',true),
('r4-9',4,26,50,'reading',true),
('r4-10',4,27,50,'reading',true),
('r4-11',4,28,50,'reading',true),
('r4-12',4,29,50,'reading',true),
('r4-13',4,30,50,'reading',true),
('r4-14',4,31,50,'reading',true),
('r4-15',4,32,50,'reading',true),
('r4-16',4,33,50,'reading',true),
('r4-17',4,34,50,'reading',true)
on conflict (module_id) do update set
  day_id = excluded.day_id,
  module_index = excluded.module_index,
  xp = excluded.xp,
  module_type = excluded.module_type,
  is_active = excluded.is_active,
  updated_at = now();

update public.academy_module_catalog
set is_active = false, updated_at = now()
where module_id not in (
'1-1','1-2','1-3','1-4','1-5','1-6','1-7','1-8','1-9','1-10','1-12','1-13','1-14','1-15','1-16','1-17','2-1','2-2','2-3','2-4','2-5a','2-5b','2-5c','2-5d','2-5e','2-7','2-8','2-9','2-13','2-14','2-14b','2-15','2-16','2-17','2-18','3-1','3-1-review','3-2','3-2-review','3-3a','3-3a-review','3-3b','3-3b-review','3-5a','3-5a-review','3-5b','3-5b-review','3-5c','3-5c-review','3-7','3-7-review','3-8','3-9','3-10','3-11','4-1','4-1-review','4-2','4-2-review','4-3','4-3-review','4-4','4-4-review','4-5','4-5-review','4-6','4-7','4-7-review','4-8','4-9','4-10','4-11','5-1','5-1-review','5-2','5-2-review','5-3','5-3-review','5-4','5-4-review','5-5','5-5-review','5-6','5-7','5-8','5-9','5-10','5-w1-exam','6-1','6-2','6-3','6-3-review','6-4','6-4-review','6-5','6-5-review','6-6','6-6-review','6-7','6-7-review','6-8','6-8-review','6-9','6-10','6-11','6-12','7-1','7-2','7-3','7-3-review','7-4','7-4-review','7-5','7-5-review','7-6','7-6-review','7-7','7-8','7-9','7-10','7-11','8-1','8-2','8-3','8-3-review','8-4','8-4-review','8-5','8-5-review','8-6','8-6-review','8-7','8-8','8-9','8-10','8-11','9-1','9-2','9-3','9-3-review','9-4','9-4-review','9-5','9-5-review','9-6','9-6-review','9-7','9-8','9-9','9-10','9-11','10-1','10-2','10-3','10-3-review','10-4','10-4-review','10-5','10-5-review','10-6','10-6-review','10-7','10-8','10-9','10-10','10-11','10-final-interview','10-referrisers','r1-1','r1-2','r1-3','r1-4','r1-5','r1-6','r1-7','r1-8','r1-9','r1-10','r1-11','r1-12','r1-13','r1-14','r1-15','r1-16','r1-17','r1-18','r1-19','r1-20','r1-21','r1-22','r2-1','r2-2','r2-3','r2-4','r2-5','r2-6','r2-7','r2-8','r2-9','r2-10','r2-11','r2-12','r2-13','r2-14','r2-15','r2-16','r2-17','r2-18','r2-19','r2-20','r2-21','r2-22','r2-23','r3-1','r3-2','r3-3','r3-4','r3-5','r3-6','r3-7','r3-8','r3-9','r3-10','r3-11','r3-12','r3-13','r3-14','r3-15','r3-16','r3-17','r3-18','r3-19','r3-20','r4-1','r4-2','r4-3','r4-4','r4-5','r4-6','r4-7','r4-8','r4-9','r4-10','r4-11','r4-12','r4-13','r4-14','r4-15','r4-16','r4-17'
);

create or replace function public.recalculate_academy_profile(_user_id uuid, _use_jae boolean default false)
returns void
language plpgsql
security definer
set search_path = public
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
      coalesce(sum(floor(p.score / 1000)) filter (where p.score is not null and p.score > 0 and floor(p.score / 1000) >= 0 and (p.score % 1000) > 0), 0)::integer,
      coalesce(sum(p.score % 1000) filter (where p.score is not null and p.score > 0 and floor(p.score / 1000) >= 0 and (p.score % 1000) > 0), 0)::integer
    into _total_xp, _last_day, _last_module, _total_correct, _total_possible
    from public.jae_user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.user_id = _user_id and p.status = 'completed';

    _level := floor(coalesce(_total_xp, 0) / 250) + 1;
    _score_pct := case when coalesce(_total_possible, 0) > 0 then round((_total_correct::numeric / _total_possible::numeric) * 100)::integer else 0 end;

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
      coalesce(sum(floor(p.score / 1000)) filter (where p.score is not null and p.score > 0 and floor(p.score / 1000) >= 0 and (p.score % 1000) > 0), 0)::integer,
      coalesce(sum(p.score % 1000) filter (where p.score is not null and p.score > 0 and floor(p.score / 1000) >= 0 and (p.score % 1000) > 0), 0)::integer
    into _total_xp, _last_day, _last_module, _total_correct, _total_possible
    from public.user_progress p
    join public.academy_module_catalog c on c.module_id = p.module_id and c.is_active
    where p.user_id = _user_id
      and p.status = 'completed'
      and not public.is_jae_member(_user_id);

    _level := floor(coalesce(_total_xp, 0) / 250) + 1;
    _score_pct := case when coalesce(_total_possible, 0) > 0 then round((_total_correct::numeric / _total_possible::numeric) * 100)::integer else 0 end;

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
set search_path = public
as $$
begin
  perform public.recalculate_academy_profile(coalesce(new.user_id, old.user_id), tg_table_name = 'jae_user_progress');
  return coalesce(new, old);
end;
$$;

drop trigger if exists sync_user_progress_profile on public.user_progress;
create trigger sync_user_progress_profile
after insert or update or delete on public.user_progress
for each row execute function public.sync_user_progress_profile();

drop trigger if exists sync_jae_user_progress_profile on public.jae_user_progress;
create trigger sync_jae_user_progress_profile
after insert or update or delete on public.jae_user_progress
for each row execute function public.sync_user_progress_profile();

do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'user_progress') then
    alter publication supabase_realtime add table public.user_progress;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'jae_user_progress') then
    alter publication supabase_realtime add table public.jae_user_progress;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'profiles') then
    alter publication supabase_realtime add table public.profiles;
  end if;
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'jae_user_profiles') then
    alter publication supabase_realtime add table public.jae_user_profiles;
  end if;
end $$;