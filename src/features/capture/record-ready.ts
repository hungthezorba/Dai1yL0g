/** US-001 smoke: time from mount to CameraView onCameraReady. */

export type RecordReadyState = 'loading_permissions' | 'awaiting_permissions' | 'warming_up' | 'ready' | 'unavailable';

export function formatRecordReadyMs(ms: number | null): string {
  if (ms === null) {
    return '—';
  }
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function recordReadyMeetsTarget(ms: number | null, targetMs = 2000, maxMs = 5000): 'ok' | 'warn' | 'slow' | 'pending' {
  if (ms === null) {
    return 'pending';
  }
  if (ms <= targetMs) {
    return 'ok';
  }
  if (ms <= maxMs) {
    return 'warn';
  }
  return 'slow';
}
