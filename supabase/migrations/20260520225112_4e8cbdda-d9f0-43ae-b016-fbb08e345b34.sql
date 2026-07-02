
ALTER TABLE public.user_progress DISABLE TRIGGER USER;
ALTER TABLE public.jae_user_progress DISABLE TRIGGER USER;

UPDATE public.user_progress p
SET score = NULL
FROM public.academy_module_catalog c
WHERE c.module_id = p.module_id
  AND c.module_type = 'coach-chat'
  AND p.status = 'completed';

UPDATE public.jae_user_progress p
SET score = NULL
FROM public.academy_module_catalog c
WHERE c.module_id = p.module_id
  AND c.module_type = 'coach-chat'
  AND p.status = 'completed';

ALTER TABLE public.user_progress ENABLE TRIGGER USER;
ALTER TABLE public.jae_user_progress ENABLE TRIGGER USER;

-- Recalculate profile aggregates for affected users
DO $$
DECLARE u uuid;
BEGIN
  FOR u IN SELECT DISTINCT user_id FROM public.user_progress LOOP
    PERFORM public.recalculate_academy_profile(u, false);
  END LOOP;
  FOR u IN SELECT DISTINCT user_id FROM public.jae_user_progress LOOP
    PERFORM public.recalculate_academy_profile(u, true);
  END LOOP;
END $$;
