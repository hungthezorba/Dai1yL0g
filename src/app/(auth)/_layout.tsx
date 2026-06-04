import { Stack } from 'expo-router';

import { AuthSetupScreen } from '@/features/auth/components/auth-setup-screen';
import { useAuth } from '@/features/auth/auth-context';

export default function AuthLayout() {
  const { configured } = useAuth();

  if (!configured) {
    return <AuthSetupScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="phone" />
      <Stack.Screen name="verify" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
