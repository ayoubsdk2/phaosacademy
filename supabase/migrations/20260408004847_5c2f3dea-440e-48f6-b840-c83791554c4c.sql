
-- Recalculate all user profiles: total_xp, level, quiz_score_pct, last_completed_day, last_completed_module_index
-- based on current valid curriculum module IDs

-- Step 1: Recalculate total_xp by counting completed valid modules * their average xp (approx 50 per module)
-- We use the user_progress table filtered to valid current module IDs

WITH valid_progress AS (
  SELECT user_id, module_id, score, day_id
  FROM user_progress
  WHERE status = 'completed'
    AND module_id IN ('1-1','1-2','1-3','1-4','1-5','1-6','1-7','1-8','1-9','1-10','1-12','1-13','1-14','1-15','1-16','1-17','2-1','2-2','2-3','2-4','2-5a','2-5b','2-5c','2-5d','2-5e','2-7','2-8','2-9','2-13','2-14','2-14b','2-15','2-16','2-17','2-18','3-1','3-1-review','3-2','3-2-review','3-3a','3-3a-review','3-3b','3-3b-review','3-5a','3-5a-review','3-5b','3-5b-review','3-5c','3-5c-review','3-7','3-8','3-9','3-10','3-13','3-14','4-p1-read','4-p1-chat','4-p1-audio','4-p1-quiz','4-p2-read','4-p2-chat','4-p2-audio','4-p2-quiz','4-p3-read','4-p3-chat','4-p3-audio','4-p3-quiz','4-p4-read','4-p4-chat','4-p4-audio','4-p4-quiz','4-p5-read','4-p5-chat','4-p5-audio','4-p5-quiz','4-p6-read','4-p6-chat','4-p6-audio','4-p6-quiz','4-summary','4-final','5-p1-read','5-p1-chat','5-p1-audio','5-p1-quiz','5-p2-read','5-p2-chat','5-p2-audio','5-p2-quiz','5-p3-read','5-p3-chat','5-p3-audio','5-p3-quiz','5-p4-read','5-p4-chat','5-p4-audio','5-p4-quiz','5-p5-read','5-p5-chat','5-p5-audio','5-p5-quiz','5-p6-read','5-p6-chat','5-p6-audio','5-p6-quiz','5-rp1','5-rp2','5-rp3','5-fc','5-summary','5-final','5-w1-exam','6-p1-read','6-p1-chat','6-p1-audio','6-p1-quiz','6-p2-read','6-p2-chat','6-p2-audio','6-p2-quiz','6-p3-read','6-p3-chat','6-p3-audio','6-p3-quiz','6-p4-read','6-p4-chat','6-p4-audio','6-p4-quiz','6-p5-read','6-p5-chat','6-p5-audio','6-p5-quiz','6-p6-read','6-p6-chat','6-p6-audio','6-p6-quiz','6-rp1','6-rp2','6-rp3','6-fc','6-summary','6-final','7-p1-read','7-p1-chat','7-p1-audio','7-p1-quiz','7-p2-read','7-p2-chat','7-p2-audio','7-p2-quiz','7-p3-read','7-p3-chat','7-p3-audio','7-p3-quiz','7-p4-read','7-p4-chat','7-p4-audio','7-p4-quiz','7-p5-read','7-p5-chat','7-p5-audio','7-p5-quiz','7-summary','7-final','8-p1-read','8-p1-chat','8-p1-audio','8-p1-quiz','8-p2-read','8-p2-chat','8-p2-audio','8-p2-quiz','8-p3-read','8-p3-chat','8-p3-audio','8-p3-quiz','8-p4-read','8-p4-chat','8-p4-audio','8-p4-quiz','8-p5-read','8-p5-chat','8-p5-audio','8-p5-quiz','8-summary','8-final','9-p1-read','9-p1-chat','9-p1-tools','9-p1-audio','9-p1-quiz','9-p2-read','9-p2-chat','9-p2-tools','9-p2-audio','9-p2-quiz','9-p3-read','9-p3-chat','9-p3-tools','9-p3-audio','9-p3-quiz','9-p4-read','9-p4-chat','9-p4-tools','9-p4-audio','9-p4-quiz','9-summary','9-final','10-p1-read','10-p1-chat','10-p1-audio','10-p1-quiz','10-p2-read','10-p2-chat','10-p2-audio','10-p2-quiz','10-p3-read','10-p3-chat','10-p3-audio','10-p3-quiz','10-p4-read','10-p4-chat','10-p4-audio','10-p4-quiz','10-4','10-5','10-6','10-7','10-8','10-9','10-10','10-11','10-12','10-13','10-14')
),
user_stats AS (
  SELECT
    user_id,
    COUNT(*) AS valid_completed,
    COUNT(*) * 50 AS estimated_xp,
    MAX(day_id) AS max_day
  FROM valid_progress
  GROUP BY user_id
),
quiz_stats AS (
  SELECT
    user_id,
    SUM(FLOOR(score / 1000)) AS total_correct,
    SUM(score % 1000) AS total_questions
  FROM valid_progress
  WHERE score IS NOT NULL AND score > 0 AND FLOOR(score / 1000) > 0 AND (score % 1000) > 0
  GROUP BY user_id
)
UPDATE profiles p
SET
  total_xp = COALESCE(us.estimated_xp, 0),
  level = GREATEST(1, FLOOR(COALESCE(us.estimated_xp, 0) / 250) + 1),
  last_completed_day = COALESCE(us.max_day, 0),
  quiz_score_pct = CASE
    WHEN qs.total_questions > 0 THEN LEAST(100, ROUND((qs.total_correct::numeric / qs.total_questions) * 100))
    ELSE 0
  END,
  updated_at = NOW()
FROM profiles pr
LEFT JOIN user_stats us ON us.user_id = pr.id
LEFT JOIN quiz_stats qs ON qs.user_id = pr.id
WHERE p.id = pr.id;
