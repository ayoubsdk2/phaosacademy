
create table if not exists public.client_errors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  route text,
  message text not null,
  stack text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.client_errors enable row level security;

create policy "Anyone authenticated inserts own client errors"
  on public.client_errors for insert to authenticated
  with check (user_id is null or user_id = auth.uid());

create policy "Managers view all client errors"
  on public.client_errors for select to authenticated
  using (public.has_role(auth.uid(), 'manager'::app_role));

create index if not exists client_errors_created_at_idx on public.client_errors (created_at desc);
