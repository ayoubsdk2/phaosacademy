CREATE OR REPLACE FUNCTION public.validate_user_badge_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.badge_id NOT IN ('b1','b2','b3','b4','b6','b7','b8','b9') THEN
    RAISE EXCEPTION 'Invalid badge_id: %', NEW.badge_id USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS user_badges_whitelist ON public.user_badges;
CREATE TRIGGER user_badges_whitelist
BEFORE INSERT OR UPDATE ON public.user_badges
FOR EACH ROW EXECUTE FUNCTION public.validate_user_badge_insert();