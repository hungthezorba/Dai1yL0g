import { Stack } from 'expo-router';

import { useAuth } from '@/features/auth/auth-context';
import { AuthSetupScreen } from '@/features/auth/components/auth-setup-screen';

export default function AuthLayout() {
  const { configured } = useAuth();

  if (!configured) {
    return <AuthSetupScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
