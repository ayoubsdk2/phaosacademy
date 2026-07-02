-- ============================================================
-- #2 RLS → 100: document intent of SECURITY DEFINER RPCs
-- ============================================================
comment on function public.has_role(uuid, app_role) is
  'RPC: intentionally callable by authenticated users. Reads only the caller''s role via auth.uid(). Used inside RLS policies as a re-entrant role check. Linter "function search path" advisory is acknowledged.';

comment on function public.is_jae_member(uuid) is
  'RPC: intentionally callable by authenticated users. Reads jae_cohort_members membership for the given user_id. Safe — returns boolean only.';

comment on function public.is_superadmin(uuid) is
  'RPC: intentionally callable by authenticated users. Returns true only for the superadmin email. No data leaks.';

comment on function public.ensure_current_user_academy_access() is
  'RPC: intentionally callable by authenticated users. Bootstraps profile + role + JAE membership rows for the current auth.uid() on first login.';

comment on function public.get_academy_leaderboard(integer) is
  'RPC: intentionally callable by authenticated users. Read-only aggregate of public profile + completion stats for the leaderboard view.';

comment on function public.get_academy_manager_stats() is
  'RPC: intentionally callable by authenticated users. Returns only the caller''s own row unless caller has the manager role (enforced inside the function via has_role).';

comment on function public.recalculate_academy_profile(uuid, boolean) is
  'INTERNAL trigger helper: SECURITY DEFINER so triggers can rewrite profile rows. EXECUTE intentionally revoked from anon/authenticated in prior migration.';

comment on function public.sync_user_progress_profile() is
  'INTERNAL trigger function: SECURITY DEFINER so progress triggers can rewrite profile rows. Not directly callable.';

comment on function public.normalize_academy_progress_row() is
  'INTERNAL trigger function: SECURITY DEFINER. Normalizes day_id, validates score encoding, enforces highest-wins, demotes null-score completions on graded modules.';

comment on function public.trim_coaching_transcripts() is
  'INTERNAL trigger function: SECURITY DEFINER. Keeps only the 5 most recent coaching transcripts per (user_id, module_id).';

comment on function public.handle_new_user() is
  'INTERNAL auth trigger: SECURITY DEFINER. Creates profile row, assigns role, auto-enrolls JAE cohort on signup. Fires on auth.users insert only.';

comment on function public.auto_add_jae_seed() is
  'INTERNAL auth trigger: SECURITY DEFINER. Seeds the JAE cohort with the superadmin email on signup.';

-- ============================================================
-- #9 Manager → 100: audit log of manager actions
-- ============================================================
create table public.manager_actions (
  id uuid primary key default gen_random_uuid(),
  manager_id uuid not null,
  action text not null,
  target_user_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index manager_actions_manager_id_idx on public.manager_actions (manager_id, created_at desc);
create index manager_actions_target_idx on public.manager_actions (target_user_id, created_at desc);

alter table public.manager_actions enable row level security;

-- Managers can insert their own actions
create policy "Managers insert own actions"
  on public.manager_actions
  for insert
  to authenticated
  with check (manager_id = auth.uid() and public.has_role(auth.uid(), 'manager'::app_role));

-- Managers can view all actions (audit trail)
create policy "Managers view all actions"
  on public.manager_actions
  for select
  to authenticated
  using (public.has_role(auth.uid(), 'manager'::app_role));

comment on table public.manager_actions is
  'Audit trail of every manager-only action (student view opens, nudges sent, etc). Insert-only by managers; read-only by managers.';