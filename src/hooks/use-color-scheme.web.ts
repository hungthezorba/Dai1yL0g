import { useColorScheme as useRNColorScheme } from 'react-native';

/** Web: use system scheme directly (US-001 lint-safe; static export may flash). */
export function useColorScheme() {
  return useRNColorScheme() ?? 'light';
}
