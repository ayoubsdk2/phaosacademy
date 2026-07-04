-- ============================================================
-- Bootstrap migration: Create JAE-specific tables and functions
-- that were originally created outside of migration files in the
-- old Supabase project.
-- ============================================================

-- 1) jae_cohort_members — stores JAE cohort membership
CREATE TABLE IF NOT EXISTS public.jae_cohort_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cohort_name TEXT NOT NULL DEFAULT 'jae',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, cohort_name)
);

ALTER TABLE public.jae_cohort_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cohort membership"
  ON public.jae_cohort_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Managers can view all cohort memberships"
  ON public.jae_cohort_members
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

-- 2) jae_user_progress — mirrors user_progress for JAE members
CREATE TABLE IF NOT EXISTS public.jae_user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day_id INTEGER NOT NULL,
  module_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  score INTEGER,
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);

ALTER TABLE public.jae_user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jae progress"
  ON public.jae_user_progress
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own jae progress"
  ON public.jae_user_progress
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own jae progress"
  ON public.jae_user_progress
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Managers can view all jae progress"
  ON public.jae_user_progress
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

-- 3) jae_user_profiles — stores computed profile stats for JAE members
CREATE TABLE IF NOT EXISTS public.jae_user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  last_completed_day INTEGER NOT NULL DEFAULT 0,
  last_completed_module_index INTEGER NOT NULL DEFAULT 0,
  quiz_score_pct INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.jae_user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own jae profile"
  ON public.jae_user_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Managers can view all jae profiles"
  ON public.jae_user_profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'manager'));

-- 4) is_jae_member — checks if a user is a JAE cohort member
CREATE OR REPLACE FUNCTION public.is_jae_member(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.jae_cohort_members
    WHERE user_id = _user_id
  )
$$;

-- 5) ensure_current_user_academy_access — bootstraps profile + role + JAE membership
CREATE OR REPLACE FUNCTION public.ensure_current_user_academy_access()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid UUID := auth.uid();
  _result JSON;
BEGIN
  IF _uid IS NULL THEN
    RETURN json_build_object('error', 'not authenticated');
  END IF;

  -- Ensure profile exists
  INSERT INTO public.profiles (id, full_name)
  VALUES (_uid, '')
  ON CONFLICT (id) DO NOTHING;

  -- Ensure learner role exists
  INSERT INTO public.user_roles (user_id, role)
  VALUES (_uid, 'learner')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Ensure JAE cohort membership
  INSERT INTO public.jae_cohort_members (user_id, cohort_name)
  VALUES (_uid, 'jae')
  ON CONFLICT (user_id, cohort_name) DO NOTHING;

  -- Ensure JAE profile exists
  INSERT INTO public.jae_user_profiles (user_id)
  VALUES (_uid)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN json_build_object('ok', true);
END;
$$;

-- 6) auto_add_jae_seed — trigger function that seeds JAE for superadmin on signup
CREATE OR REPLACE FUNCTION public.auto_add_jae_seed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-add to JAE cohort
  INSERT INTO public.jae_cohort_members (user_id, cohort_name)
  VALUES (NEW.id, 'jae')
  ON CONFLICT (user_id, cohort_name) DO NOTHING;

  -- Ensure JAE profile exists
  INSERT INTO public.jae_user_profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;
