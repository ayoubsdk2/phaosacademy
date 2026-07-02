-- Revoke direct API access to the MV; only the SECURITY DEFINER RPC reads it.
revoke all on public.academy_leaderboard_mv from anon, authenticated, public;

comment on materialized view public.academy_leaderboard_mv is
  'Precomputed leaderboard rankings. Refreshed by refresh_academy_leaderboard_if_active() via pg_cron when there is recent progress activity. NOT directly exposed via the Data API — read only through get_academy_leaderboard() RPC.';