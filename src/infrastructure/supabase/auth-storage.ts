import { requireOptionalNativeModule } from 'expo-modules-core';

type ExpoSecureStoreModule = {
  getValueWithKeyAsync: (key: string, options?: object) => Promise<string | null>;
  setValueWithKeyAsync: (value: string, key: string, options?: object) => Promise<void>;
  deleteValueWithKeyAsync?: (key: string, options?: object) => Promise<void>;
};

const memoryStore = new Map<string, string>();
let loggedMemoryFallback = false;

function getSecureStoreNative(): ExpoSecureStoreModule | null {
  return requireOptionalNativeModule<ExpoSecureStoreModule>('ExpoSecureStore');
}

function warnMemoryFallbackOnce(): void {
  if (loggedMemoryFallback) {
    return;
  }
  loggedMemoryFallback = true;
  console.warn(
    '[auth] ExpoSecureStore not in this dev build — sessions use in-memory storage until you rebuild (expo-secure-store).',
  );
}

/** Supabase auth storage; never top-level-import expo-secure-store (throws on stale dev builds). */
export function createSupabaseAuthStorage() {
  return {
    getItem: async (key: string): Promise<string | null> => {
      const native = getSecureStoreNative();
      if (native) {
        const value = await native.getValueWithKeyAsync(key, {});
        return value ?? null;
      }
      warnMemoryFallbackOnce();
      return memoryStore.get(key) ?? null;
    },
    setItem: async (key: string, value: string): Promise<void> => {
      const native = getSecureStoreNative();
      if (native) {
        await native.setValueWithKeyAsync(value, key, {});
        return;
      }
      warnMemoryFallbackOnce();
      memoryStore.set(key, value);
    },
    removeItem: async (key: string): Promise<void> => {
      const native = getSecureStoreNative();
      if (native?.deleteValueWithKeyAsync) {
        await native.deleteValueWithKeyAsync(key, {});
        return;
      }
      memoryStore.delete(key);
    },
  };
}
