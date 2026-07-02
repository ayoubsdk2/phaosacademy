import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  total_xp: number;
  current_streak: number;
  level: number;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isManager, setIsManager] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Safety timeout — never show a spinner for more than 8 seconds
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 8000);

    const loadUserData = async (currentUser: User | null) => {
      if (!currentUser) {
        if (mounted) {
          setProfile(null);
          setIsManager(false);
          setIsSuperAdmin(false);
          setLoading(false);
        }
        return;
      }

      try {
        const [profileRes, rolesRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', currentUser.id).single(),
          supabase.from('user_roles').select('role').eq('user_id', currentUser.id),
        ]);

        if (mounted) {
          if (profileRes.data) {
            setProfile(profileRes.data as UserProfile);
          }
          setIsManager(rolesRes.data?.some((r: any) => r.role === 'manager') ?? false);
          setIsSuperAdmin((currentUser.email || '').toLowerCase() === 'daniel@referrizer.com');
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    // 1. Get the current session first (synchronous-ish)
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      loadUserData(currentSession?.user ?? null);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      // Only re-fetch profile on actual user changes, not token refreshes
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT' || _event === 'USER_UPDATED') {
        loadUserData(newSession?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);
    if (!error && profile) {
      setProfile({ ...profile, ...updates } as UserProfile);
    }
    return { error };
  }, [user, profile]);

  return { user, session, profile, isManager, isSuperAdmin, loading, signUp, signIn, signOut, updateProfile };
}
