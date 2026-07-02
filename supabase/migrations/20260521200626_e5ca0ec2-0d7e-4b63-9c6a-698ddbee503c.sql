CREATE OR REPLACE FUNCTION public.normalize_academy_progress_row()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _module record;
  _new_correct integer;
  _new_possible integer;
  _old_correct integer;
  _old_possible integer;
  _new_valid boolean := false;
  _old_valid boolean := false;
BEGIN
  SELECT module_id, day_id, module_index, module_type, score_total
  INTO _module
  FROM public.academy_module_catalog
  WHERE module_id = NEW.module_id
    AND is_active
  LIMIT 1;

  IF FOUND THEN
    NEW.day_id := _module.day_id;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'completed' AND NEW.status <> 'completed' THEN
      NEW.status := 'completed';
      NEW.completed_at := OLD.completed_at;
    END IF;

    IF NEW.score IS NULL AND OLD.score IS NOT NULL THEN
      NEW.score := OLD.score;
    END IF;
  END IF;

  IF NEW.status = 'completed' THEN
    NEW.completed_at := COALESCE(NEW.completed_at, now());
  END IF;

  IF FOUND AND _module.module_type IN ('coach-chat', 'quiz', 'review') AND COALESCE(_module.score_total, 0) > 0 THEN
    IF NEW.score IS NOT NULL THEN
      _new_correct := floor(NEW.score / 1000);
      _new_possible := NEW.score % 1000;
      _new_valid := _new_possible = _module.score_total
        AND _new_correct >= 0
        AND _new_correct <= _new_possible;
    END IF;

    IF TG_OP = 'UPDATE' AND OLD.score IS NOT NULL THEN
      _old_correct := floor(OLD.score / 1000);
      _old_possible := OLD.score % 1000;
      _old_valid := _old_possible = _module.score_total
        AND _old_correct >= 0
        AND _old_correct <= _old_possible;
    END IF;

    IF NOT _new_valid THEN
      IF _old_valid THEN
        NEW.score := OLD.score;
      ELSE
        NEW.score := NULL;
      END IF;
    ELSIF _old_valid THEN
      IF _old_correct > _new_correct OR (_old_correct = _new_correct AND _old_possible <= _new_possible) THEN
        NEW.score := OLD.score;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_user_progress_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.recalculate_academy_profile(
    COALESCE(NEW.user_id, OLD.user_id),
    TG_TABLE_NAME = 'jae_user_progress'
  );
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_coaching_transcript_to_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _day_id integer;
  _score integer;
  _encoded integer;
BEGIN
  IF NEW.user_id IS NULL OR NEW.module_id IS NULL OR NEW.score IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT day_id
  INTO _day_id
  FROM public.academy_module_catalog
  WHERE module_id = NEW.module_id
    AND module_type = 'coach-chat'
    AND is_active
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  _score := greatest(0, least(10, NEW.score));
  _encoded := (_score * 1000) + 10;

  IF public.is_jae_member(NEW.user_id) THEN
    INSERT INTO public.jae_user_progress (user_id, day_id, module_id, status, score, completed_at)
    VALUES (NEW.user_id, _day_id, NEW.module_id, 'completed', _encoded, COALESCE(NEW.created_at, now()))
    ON CONFLICT (user_id, module_id) DO UPDATE SET
      day_id = EXCLUDED.day_id,
      status = 'completed',
      score = greatest(COALESCE(public.jae_user_progress.score, 0), EXCLUDED.score),
      completed_at = COALESCE(public.jae_user_progress.completed_at, EXCLUDED.completed_at);
  ELSE
    INSERT INTO public.user_progress (user_id, day_id, module_id, status, score, completed_at)
    VALUES (NEW.user_id, _day_id, NEW.module_id, 'completed', _encoded, COALESCE(NEW.created_at, now()))
    ON CONFLICT (user_id, module_id) DO UPDATE SET
      day_id = EXCLUDED.day_id,
      status = 'completed',
      score = greatest(COALESCE(public.user_progress.score, 0), EXCLUDED.score),
      completed_at = COALESCE(public.user_progress.completed_at, EXCLUDED.completed_at);
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalize_user_progress_row_biu ON public.user_progress;
CREATE TRIGGER normalize_user_progress_row_biu
BEFORE INSERT OR UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.normalize_academy_progress_row();

DROP TRIGGER IF EXISTS normalize_jae_user_progress_row_biu ON public.jae_user_progress;
CREATE TRIGGER normalize_jae_user_progress_row_biu
BEFORE INSERT OR UPDATE ON public.jae_user_progress
FOR EACH ROW
EXECUTE FUNCTION public.normalize_academy_progress_row();

DROP TRIGGER IF EXISTS sync_user_progress_profile_aiud ON public.user_progress;
CREATE TRIGGER sync_user_progress_profile_aiud
AFTER INSERT OR UPDATE OR DELETE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_progress_profile();

DROP TRIGGER IF EXISTS sync_jae_user_progress_profile_aiud ON public.jae_user_progress;
CREATE TRIGGER sync_jae_user_progress_profile_aiud
AFTER INSERT OR UPDATE OR DELETE ON public.jae_user_progress
FOR EACH ROW
EXECUTE FUNCTION public.sync_user_progress_profile();

DROP TRIGGER IF EXISTS sync_coaching_transcript_to_progress_aiu ON public.coaching_transcripts;
CREATE TRIGGER sync_coaching_transcript_to_progress_aiu
AFTER INSERT OR UPDATE OF score ON public.coaching_transcripts
FOR EACH ROW
EXECUTE FUNCTION public.sync_coaching_transcript_to_progress();