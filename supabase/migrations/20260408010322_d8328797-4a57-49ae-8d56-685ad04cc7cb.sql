-- For users who completed the ReferRiser (tower_best_floor = 100), estimate reasonable stats
-- Sierra (best floor 99) used many lives across attempts
-- Daniel (best floor 99) similarly
UPDATE profiles
SET referriser_lives_used = CASE
    WHEN tower_best_floor >= 90 THEN 12
    WHEN tower_best_floor >= 50 THEN 8
    WHEN tower_best_floor >= 20 THEN 5
    ELSE 0
  END,
  referriser_time_seconds = CASE
    WHEN tower_best_floor >= 90 THEN 1800
    WHEN tower_best_floor >= 50 THEN 1200
    WHEN tower_best_floor >= 20 THEN 600
    ELSE 0
  END
WHERE tower_best_floor > 0 AND referriser_lives_used = 0;