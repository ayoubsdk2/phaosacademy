
-- Fix normalize trigger so it stops force-overriding partial scores
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
      -- Preserve previous score on update if new one is null
      if new.score is null and tg_op = 'UPDATE' and old.score is not null and old.score > 0 then
        new.score := old.score;
      end if;

      -- Only fill in / repair MALFORMED scores. Never overwrite a valid partial score.
      if new.score is null or new.score <= 0 then
        -- No score recorded at all: default to perfect so completion isn't blocked
        new.score := (_module.score_total * 1000) + _module.score_total;
      else
        _correct := floor(new.score / 1000);
        _possible := new.score % 1000;
        -- Malformed = impossible/zero possible, correct out of range, or wrong denominator
        if _possible <= 0 or _correct < 0 or _correct > _possible or _possible <> _module.score_total then
          new.score := (_module.score_total * 1000) + _module.score_total;
        end if;
        -- Valid partial scores (e.g. 5/10) are LEFT AS-IS so coaching grades stay honest.
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

-- Recalculate everyone's coaching/quiz percentages now that the trigger is honest
DO $$
DECLARE _uid uuid;
BEGIN
  FOR _uid IN SELECT id FROM public.profiles LOOP
    PERFORM public.recalculate_academy_profile(_uid, false);
    PERFORM public.recalculate_academy_profile(_uid, true);
  END LOOP;
END $$;
