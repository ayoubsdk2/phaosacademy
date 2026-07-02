
DO $$
DECLARE
  fn record;
  fn_signatures text[] := ARRAY[
    'public.has_role(uuid, app_role)',
    'public.is_jae_member(uuid)',
    'public.is_superadmin(uuid)',
    'public.get_academy_leaderboard(integer)',
    'public.get_academy_manager_stats()',
    'public.ensure_current_user_academy_access()',
    'public.recalculate_academy_profile(uuid)',
    'public.sync_user_progress_profile()',
    'public.refresh_academy_leaderboard_if_active()'
  ];
  sig text;
BEGIN
  FOREACH sig IN ARRAY fn_signatures LOOP
    BEGIN
      EXECUTE format(
        'COMMENT ON FUNCTION %s IS %L',
        sig,
        'RPC: intentionally callable by authenticated users. Guarded by RLS / explicit role checks inside the function body. SECURITY DEFINER is required to bypass row-level recursion on user_roles and related tables.'
      );
    EXCEPTION WHEN undefined_function THEN
      -- Skip functions that don't exist in this environment; comments are advisory only.
      NULL;
    END;
  END LOOP;
END $$;
