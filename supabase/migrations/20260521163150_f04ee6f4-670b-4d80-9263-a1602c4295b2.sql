create table if not exists public.coaching_transcripts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  module_id text not null,
  transcript jsonb not null,
  score integer,
  verdict text,
  created_at timestamptz not null default now()
);

create index if not exists coaching_transcripts_user_module_idx
  on public.coaching_transcripts (user_id, module_id, created_at desc);

alter table public.coaching_transcripts enable row level security;

drop policy if exists "Users insert own transcripts" on public.coaching_transcripts;
create policy "Users insert own transcripts"
  on public.coaching_transcripts for insert to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users view own transcripts" on public.coaching_transcripts;
create policy "Users view own transcripts"
  on public.coaching_transcripts for select to authenticated
  using (user_id = auth.uid());

drop policy if exists "Managers view all transcripts" on public.coaching_transcripts;
create policy "Managers view all transcripts"
  on public.coaching_transcripts for select to authenticated
  using (has_role(auth.uid(), 'manager'::app_role));

create or replace function public.trim_coaching_transcripts()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.coaching_transcripts
  where id in (
    select id from public.coaching_transcripts
    where user_id = new.user_id and module_id = new.module_id
    order by created_at desc
    offset 5
  );
  return new;
end;
$$;

drop trigger if exists trim_coaching_transcripts_trg on public.coaching_transcripts;
create trigger trim_coaching_transcripts_trg
after insert on public.coaching_transcripts
for each row execute function public.trim_coaching_transcripts();

revoke execute on function public.trim_coaching_transcripts() from anon;

alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;