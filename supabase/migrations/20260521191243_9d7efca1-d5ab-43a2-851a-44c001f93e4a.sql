
-- 1. Add hidden flag on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS hidden_from_leaderboard boolean NOT NULL DEFAULT false;

-- 2. Hide Sierra
UPDATE public.profiles
  SET hidden_from_leaderboard = true
  WHERE id = '09bba4c1-9755-4cc3-8948-f3bcc7dbfe18';

-- 3. Rebuild the leaderboard materialized view to exclude hidden users + JAE cohort
DROP MATERIALIZED VIEW IF EXISTS public.academy_leaderboard_mv CASCADE;

CREATE MATERIALIZED VIEW public.academy_leaderboard_mv AS
WITH totals AS (
  SELECT
    count(*)::integer AS total_modules,
    coalesce(sum(score_total) filter (where module_type = 'coach-chat' and coalesce(score_total, 0) > 0), 0)::integer AS coaching_possible
  FROM public.academy_module_catalog
  WHERE is_active
), all_completed_progress AS (
  SELECT user_id, module_id, score, completed_at FROM public.user_progress WHERE status = 'completed'
  UNION ALL
  SELECT user_id, module_id, score, completed_at FROM public.jae_user_progress WHERE status = 'completed'
), progress_by_module AS (
  SELECT user_id, module_id,
    max(coalesce(score, 0))::integer AS score,
    max(completed_at) AS completed_at
  FROM all_completed_progress
  GROUP BY user_id, module_id
), progress_stats AS (
  SELECT p.user_id,
    count(DISTINCT c.module_id)::integer AS modules_completed,
    coalesce(sum(c.xp), 0)::integer AS total_xp,
    coalesce(max(c.day_id * 1000 + c.module_index), 0)::integer AS last_key,
    coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type = 'coach-chat' and coalesce(c.score_total, 0) > 0), 0)::integer AS coaching_earned,
    coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer AS scored_earned,
    coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer AS scored_possible
  FROM progress_by_module p
  JOIN public.academy_module_catalog c ON c.module_id = p.module_id AND c.is_active
  GROUP BY p.user_id
)
SELECT
  p.id,
  coalesce(nullif(p.full_name, ''), 'New Hire') AS full_name,
  coalesce(ps.total_xp, 0)::integer AS total_xp,
  (floor(coalesce(ps.total_xp, 0) / 250) + 1)::integer AS level,
  (coalesce(ps.last_key, 0) / 1000)::integer AS last_completed_day,
  (coalesce(ps.last_key, 0) % 1000)::integer AS last_completed_module_index,
  p.tower_best_floor,
  p.referriser_lives_used,
  p.referriser_time_seconds,
  p.updated_at AS profile_updated_at,
  coalesce(ps.modules_completed, 0)::integer AS modules_completed,
  totals.total_modules,
  CASE WHEN totals.total_modules > 0 THEN least(100, round((coalesce(ps.modules_completed, 0)::numeric / totals.total_modules) * 100)::integer) ELSE 0 END AS completion_pct,
  coalesce(ps.coaching_earned, 0)::integer AS coaching_earned,
  totals.coaching_possible,
  CASE WHEN totals.coaching_possible > 0 THEN least(100, round((coalesce(ps.coaching_earned, 0)::numeric / totals.coaching_possible) * 100)::integer) ELSE 0 END AS coaching_pct,
  CASE WHEN coalesce(ps.scored_possible, 0) > 0 THEN least(100, round((coalesce(ps.scored_earned, 0)::numeric / ps.scored_possible) * 100)::integer) ELSE 0 END AS quiz_score_pct
FROM public.profiles p
CROSS JOIN totals
LEFT JOIN progress_stats ps ON ps.user_id = p.id
WHERE coalesce(p.hidden_from_leaderboard, false) = false
  AND NOT public.is_jae_member(p.id);

CREATE UNIQUE INDEX academy_leaderboard_mv_id_idx ON public.academy_leaderboard_mv (id);
CREATE INDEX academy_leaderboard_mv_xp_idx ON public.academy_leaderboard_mv (total_xp DESC, modules_completed DESC);

REVOKE ALL ON public.academy_leaderboard_mv FROM anon, authenticated, public;

REFRESH MATERIALIZED VIEW public.academy_leaderboard_mv;

-- 4. Recreate get_academy_leaderboard RPC (CASCADE dropped it)
CREATE OR REPLACE FUNCTION public.get_academy_leaderboard(_limit integer DEFAULT 10)
RETURNS TABLE(id uuid, full_name text, total_xp integer, level integer, last_completed_day integer, last_completed_module_index integer, tower_best_floor integer, referriser_lives_used integer, referriser_time_seconds integer, modules_completed integer, total_modules integer, completion_pct integer, coaching_earned integer, coaching_possible integer, coaching_pct integer, quiz_score_pct integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  SELECT mv.id, mv.full_name, mv.total_xp, mv.level,
    mv.last_completed_day, mv.last_completed_module_index,
    mv.tower_best_floor, mv.referriser_lives_used, mv.referriser_time_seconds,
    mv.modules_completed, mv.total_modules, mv.completion_pct,
    mv.coaching_earned, mv.coaching_possible, mv.coaching_pct,
    mv.quiz_score_pct
  FROM public.academy_leaderboard_mv mv
  WHERE auth.uid() IS NOT NULL
  ORDER BY mv.total_xp DESC, mv.modules_completed DESC, mv.profile_updated_at ASC
  LIMIT greatest(coalesce(_limit, 10), 1);
$$;

REVOKE ALL ON FUNCTION public.get_academy_leaderboard(integer) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_academy_leaderboard(integer) TO authenticated;

-- 5. Update manager stats to exclude hidden users too
CREATE OR REPLACE FUNCTION public.get_academy_manager_stats()
RETURNS TABLE(id uuid, full_name text, total_xp integer, level integer, last_completed_day integer, last_completed_module_index integer, tower_best_floor integer, referriser_lives_used integer, referriser_time_seconds integer, completed_modules integer, total_modules integer, completion_pct integer, coaching_earned integer, coaching_possible integer, coaching_pct integer, quiz_score_pct integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $$
  WITH totals AS (
    SELECT count(*)::integer AS total_modules,
      coalesce(sum(score_total) filter (where module_type = 'coach-chat' and coalesce(score_total, 0) > 0), 0)::integer AS coaching_possible
    FROM public.academy_module_catalog WHERE is_active
  ), all_completed_progress AS (
    SELECT user_id, module_id, score, completed_at FROM public.user_progress WHERE status = 'completed'
    UNION ALL
    SELECT user_id, module_id, score, completed_at FROM public.jae_user_progress WHERE status = 'completed'
  ), progress_by_module AS (
    SELECT user_id, module_id,
      max(coalesce(score, 0))::integer AS score,
      max(completed_at) AS completed_at
    FROM all_completed_progress GROUP BY user_id, module_id
  ), progress_stats AS (
    SELECT p.user_id,
      count(DISTINCT c.module_id)::integer AS completed_modules,
      coalesce(sum(c.xp), 0)::integer AS total_xp,
      coalesce(max(c.day_id * 1000 + c.module_index), 0)::integer AS last_key,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type = 'coach-chat' and coalesce(c.score_total, 0) > 0), 0)::integer AS coaching_earned,
      coalesce(sum(floor(coalesce(p.score, 0) / 1000)) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer AS scored_earned,
      coalesce(sum(c.score_total) filter (where c.module_type in ('coach-chat', 'quiz', 'review') and coalesce(c.score_total, 0) > 0), 0)::integer AS scored_possible
    FROM progress_by_module p
    JOIN public.academy_module_catalog c ON c.module_id = p.module_id AND c.is_active
    GROUP BY p.user_id
  )
  SELECT p.id,
    coalesce(nullif(p.full_name, ''), 'Unnamed') AS full_name,
    coalesce(ps.total_xp, 0)::integer AS total_xp,
    (floor(coalesce(ps.total_xp, 0) / 250) + 1)::integer AS level,
    (coalesce(ps.last_key, 0) / 1000)::integer AS last_completed_day,
    (coalesce(ps.last_key, 0) % 1000)::integer AS last_completed_module_index,
    p.tower_best_floor, p.referriser_lives_used, p.referriser_time_seconds,
    coalesce(ps.completed_modules, 0)::integer AS completed_modules,
    totals.total_modules,
    CASE WHEN totals.total_modules > 0 THEN least(100, round((coalesce(ps.completed_modules, 0)::numeric / totals.total_modules) * 100)::integer) ELSE 0 END AS completion_pct,
    coalesce(ps.coaching_earned, 0)::integer AS coaching_earned,
    totals.coaching_possible,
    CASE WHEN totals.coaching_possible > 0 THEN least(100, round((coalesce(ps.coaching_earned, 0)::numeric / totals.coaching_possible) * 100)::integer) ELSE 0 END AS coaching_pct,
    CASE WHEN coalesce(ps.scored_possible, 0) > 0 THEN least(100, round((coalesce(ps.scored_earned, 0)::numeric / ps.scored_possible) * 100)::integer) ELSE 0 END AS quiz_score_pct
  FROM public.profiles p
  CROSS JOIN totals
  LEFT JOIN progress_stats ps ON ps.user_id = p.id
  WHERE coalesce(p.hidden_from_leaderboard, false) = false
    AND (auth.uid() = p.id OR public.has_role(auth.uid(), 'manager'::app_role))
  ORDER BY coalesce(ps.total_xp, 0) DESC, coalesce(ps.completed_modules, 0) DESC, p.updated_at ASC;
$$;

-- 6. Recalculate every profile's cached XP / level / completion so cached
-- profile rows match the freshly aggregated progress data.
DO $$
DECLARE _uid uuid;
BEGIN
  FOR _uid IN SELECT id FROM public.profiles LOOP
    PERFORM public.recalculate_academy_profile(_uid, public.is_jae_member(_uid));
  END LOOP;
END $$;

REFRESH MATERIALIZED VIEW public.academy_leaderboard_mv;
