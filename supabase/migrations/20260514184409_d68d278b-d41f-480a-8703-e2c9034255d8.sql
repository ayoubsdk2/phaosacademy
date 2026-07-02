
-- Install the safeguard triggers that were missing
DROP TRIGGER IF EXISTS normalize_user_progress_row ON public.user_progress;
DROP TRIGGER IF EXISTS normalize_jae_user_progress_row ON public.jae_user_progress;
DROP TRIGGER IF EXISTS sync_user_progress_profile_aiud ON public.user_progress;
DROP TRIGGER IF EXISTS sync_jae_user_progress_profile_aiud ON public.jae_user_progress;

-- Fix sync function (previous version had a bug: `tg_table_name = 'jae_user_progress'` was an assignment-looking expression)
CREATE OR REPLACE FUNCTION public.sync_user_progress_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  perform public.recalculate_academy_profile(
    coalesce(new.user_id, old.user_id),
    tg_table_name = 'jae_user_progress'
  );
  return coalesce(new, old);
end;
$function$;

-- Normalize row BEFORE insert/update (auto-fills day_id, completed_at, repairs/awards full score for scored modules)
CREATE TRIGGER normalize_user_progress_row
BEFORE INSERT OR UPDATE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION public.normalize_academy_progress_row();

CREATE TRIGGER normalize_jae_user_progress_row
BEFORE INSERT OR UPDATE ON public.jae_user_progress
FOR EACH ROW EXECUTE FUNCTION public.normalize_academy_progress_row();

-- Recalculate profile totals AFTER any progress change
CREATE TRIGGER sync_user_progress_profile_aiud
AFTER INSERT OR UPDATE OR DELETE ON public.user_progress
FOR EACH ROW EXECUTE FUNCTION public.sync_user_progress_profile();

CREATE TRIGGER sync_jae_user_progress_profile_aiud
AFTER INSERT OR UPDATE OR DELETE ON public.jae_user_progress
FOR EACH ROW EXECUTE FUNCTION public.sync_user_progress_profile();
