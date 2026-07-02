
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_completed_day integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_completed_module_index integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS quiz_score_pct integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tower_best_floor integer NOT NULL DEFAULT 0;
