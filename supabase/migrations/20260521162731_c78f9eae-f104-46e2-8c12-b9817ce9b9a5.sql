
-- 1) Revoke EXECUTE on internal SECURITY DEFINER functions from anon and authenticated.
--    These are only meant to be called by triggers or other SECURITY DEFINER funcs.
REVOKE EXECUTE ON FUNCTION public.recalculate_academy_profile(uuid, boolean) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.normalize_academy_progress_row() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.sync_user_progress_profile() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.auto_add_jae_seed() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;

-- Keep these callable by authenticated users (the client/RPC layer uses them).
REVOKE EXECUTE ON FUNCTION public.ensure_current_user_academy_access() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_jae_member(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_superadmin(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_academy_leaderboard(integer) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_academy_manager_stats() FROM anon, public;

-- 2) Null-score-completion guard: if a graded module has status='completed' but no
--    valid score, demote to 'active' instead of letting the row exist as a fake completion.
CREATE OR REPLACE FUNCTION public.normalize_academy_progress_row()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  _module record;
  _correct integer;
  _possible integer;
  _old_correct integer;
  _old_possible integer;
  _new_valid boolean := false;
  _old_valid boolean := false;
  _is_graded boolean := false;
begin
  select module_id, day_id, module_index, module_type, score_total
  into _module
  from public.academy_module_catalog
  where module_id = new.module_id
    and is_active
  limit 1;

  if found then
    new.day_id := _module.day_id;
    _is_graded := _module.module_type in ('coach-chat','quiz','review') and coalesce(_module.score_total, 0) > 0;
  end if;

  if new.status = 'completed' then
    new.completed_at := coalesce(new.completed_at, now());

    if _is_graded then
      -- Preserve previous score on UPDATE if new payload omitted it.
      if new.score is null and tg_op = 'UPDATE' and old.score is not null then
        new.score := old.score;
      end if;

      -- Validate the new score shape.
      if new.score is not null and new.score > 0 then
        _correct := floor(new.score / 1000);
        _possible := new.score % 1000;
        _new_valid := (_possible = _module.score_total) and (_correct between 0 and _possible);
        if not _new_valid then
          new.score := null;
        end if;
      else
        new.score := null;
      end if;

      -- Highest-wins on UPDATE.
      if tg_op = 'UPDATE' and old.score is not null and old.score > 0 then
        _old_correct := floor(old.score / 1000);
        _old_possible := old.score % 1000;
        _old_valid := (_old_possible = _module.score_total) and (_old_correct between 0 and _old_possible);
        if _old_valid then
          if new.score is null then
            new.score := old.score;
          else
            _correct := floor(new.score / 1000);
            if _old_correct > _correct then
              new.score := old.score;
            end if;
          end if;
        end if;
      end if;

      -- GUARD: graded module marked completed with no valid score -> demote to active.
      if new.score is null then
        new.status := 'active';
        new.completed_at := null;
      end if;
    elsif tg_op = 'UPDATE' and new.score is null and old.score is not null then
      new.score := old.score;
    end if;
  elsif tg_op = 'UPDATE' and new.score is null and old.score is not null then
    new.score := old.score;
  end if;

  return new;
end;
$function$;
