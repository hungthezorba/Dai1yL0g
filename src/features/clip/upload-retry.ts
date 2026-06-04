const BASE_DELAY_MS = 2000;
const MAX_DELAY_MS = 60_000;

/** Exponential backoff for upload retries (attempt is 1-based). */
export function uploadRetryDelayMs(attempt: number): number {
  const exp = Math.min(attempt - 1, 5);
  return Math.min(BASE_DELAY_MS * 2 ** exp, MAX_DELAY_MS);
}

export function shouldRetryUpload(attempt: number, maxAttempts: number): boolean {
  return attempt < maxAttempts;
}
