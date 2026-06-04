import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

import { useAuth } from '@/features/auth/auth-context';

/** Redirects among (auth) and (app) groups based on session + profile. */
export function AuthRouteGuard() {
  const { configured, loading, session, profile } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!configured) {
      return;
    }
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/phone');
      return;
    }

    if (session && !profile && segments[1] !== 'profile') {
      router.replace('/(auth)/profile');
      return;
    }

    if (session && profile && inAuthGroup) {
      router.replace('/(app)');
    }
  }, [configured, loading, session, profile, segments, router]);

  return null;
}
