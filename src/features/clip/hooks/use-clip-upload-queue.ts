import { useCallback, useEffect, useRef } from 'react';

import { useAuth } from '@/features/auth/auth-context';
import { sanitizeClipsBeforeUpload } from '@/features/clip/clip-upload-prep';
import { getClipById } from '@/features/clip/clip-repository';
import { uploadClipWithRetry } from '@/features/clip/clip-upload-service';
import { clipUploadLog } from '@/features/clip/upload-logger';
import { isSupabaseConfigured } from '@/infrastructure/supabase/client';

type UseClipUploadQueueOptions = {
  onClipUpdated: () => void;
  /** When true, screen is visible — drain pending uploads. */
  active?: boolean;
};

export function useClipUploadQueue({ onClipUpdated, active = true }: UseClipUploadQueueOptions) {
  const { session, loading: authLoading } = useAuth();
  const processingRef = useRef(false);
  const rerunRequestedRef = useRef(false);
  const userId = session?.user.id;

  const processQueue = useCallback(async () => {
    if (!active) {
      clipUploadLog.info('queue skipped: screen not active');
      return;
    }
    if (authLoading) {
      clipUploadLog.info('queue skipped: auth still loading');
      return;
    }
    if (!userId) {
      clipUploadLog.warn('queue skipped: no signed-in user');
      return;
    }
    if (!isSupabaseConfigured()) {
      clipUploadLog.warn('queue skipped: Supabase env not configured');
      return;
    }

    if (processingRef.current) {
      rerunRequestedRef.current = true;
      clipUploadLog.info('queue busy — will rerun after current batch');
      return;
    }

    processingRef.current = true;
    try {
      do {
        rerunRequestedRef.current = false;
        const pending = await sanitizeClipsBeforeUpload();
        clipUploadLog.info('queue drain', { count: pending.length, clipIds: pending.map((c) => c.id) });
        onClipUpdated();

        for (const clip of pending) {
          try {
            await uploadClipWithRetry(clip, userId);
          } catch (err) {
            clipUploadLog.error('queue item failed (state should be failed in index)', err, {
              clipId: clip.id,
            });
          }
          onClipUpdated();
        }
      } while (rerunRequestedRef.current);
    } finally {
      processingRef.current = false;
      clipUploadLog.info('queue idle');
    }
  }, [active, authLoading, onClipUpdated, userId]);

  useEffect(() => {
    void processQueue();
  }, [processQueue]);

  const enqueueUpload = useCallback(() => {
    clipUploadLog.info('enqueueUpload');
    void processQueue();
  }, [processQueue]);

  const retryClip = useCallback(
    async (clipId: string) => {
      if (!userId) {
        clipUploadLog.warn('retry skipped: no user');
        return;
      }
      const clip = await getClipById(clipId);
      if (!clip) {
        clipUploadLog.warn('retry skipped: clip not found', { clipId });
        return;
      }
      clipUploadLog.info('manual retry', { clipId });
      try {
        await uploadClipWithRetry(clip, userId);
      } catch (err) {
        clipUploadLog.error('manual retry failed', err, { clipId });
      }
      onClipUpdated();
    },
    [onClipUpdated, userId],
  );

  return { enqueueUpload, retryClip, processQueue };
}
