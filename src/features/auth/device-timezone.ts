/**
 * Device IANA timezone without importing expo-localization (native module
 * may be missing on dev builds predating US-003).
 */
export function getDeviceTimezone(): string {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (timeZone) {
      return timeZone;
    }
  } catch {
    // ignore
  }
  return 'UTC';
}
