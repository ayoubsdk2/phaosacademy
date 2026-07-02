
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  -- Auto-assign manager role to designated super users
  IF NEW.email IN (
    'andre.c@referrizer.com',
    'bojan.b@referrizer.com',
    'elena@referrizer.com',
    'zoran@referrizer.com'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'manager');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'learner');
  END IF;
  
  RETURN NEW;
END;
$$;
