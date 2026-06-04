import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getSupabaseClient, isSupabaseConfigured } from '@/infrastructure/supabase/client';

import { signOut as authSignOut } from './auth-service';
import { fetchProfile } from './profile-service';
import type { UserProfile } from './types';

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  profile: UserProfile | null;
  phonePending: string | null;
  setPhonePending: (phone: string | null) => void;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(configured);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [phonePending, setPhonePending] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    const userId = session?.user.id;
    if (!userId) {
      setProfile(null);
      return;
    }
    try {
      const next = await fetchProfile(userId);
      setProfile(next);
    } catch {
      setProfile(null);
    }
  }, [session]);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = getSupabaseClient();

    const applySession = async (nextSession: Session | null) => {
      setSession(nextSession);
      const userId = nextSession?.user.id;
      if (!userId) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const next = await fetchProfile(userId);
        setProfile(next);
      } catch {
        setProfile(null);
      }
      setLoading(false);
    };

    void supabase.auth.getSession().then(({ data }) => applySession(data.session));

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void applySession(nextSession);
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [configured]);

  const signOut = useCallback(async () => {
    await authSignOut();
    setPhonePending(null);
    setProfile(null);
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      configured,
      loading,
      session,
      profile,
      phonePending,
      setPhonePending,
      refreshProfile,
      signOut,
    }),
    [configured, loading, session, profile, phonePending, refreshProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
