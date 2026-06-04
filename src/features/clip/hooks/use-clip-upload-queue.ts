import { useCallback, useEffect, useRef } from 'react';

import { useAuth } from '@/features/auth/auth-context';
import { getClipById, listClipsPendingUpload } from '@/features/clip/clip-repository';
import { uploadClipWithRetry } from '@/features/clip/clip-upload-service';
import { isSupabaseConfigured } from '@/infrastructure/supabase/client';

type UseClipUploadQueueOptions = {
  onClipUpdated: () => void;
};

export function useClipUploadQueue({ onClipUpdated }: UseClipUploadQueueOptions) {
  const { session } = useAuth();
  const processingRef = useRef(false);
  const userId = session?.user.id;

  const processQueue = useCallback(async () => {
    if (!userId || !isSupabaseConfigured() || processingRef.current) {
      return;
    }

    processingRef.current = true;
    try {
      const pending = await listClipsPendingUpload();
      for (const clip of pending) {
        try {
          await uploadClipWithRetry(clip, userId);
        } catch {
          // State persisted as failed; UI shows retry badge
        }
        onClipUpdated();
      }
    } finally {
      processingRef.current = false;
    }
  }, [onClipUpdated, userId]);

  useEffect(() => {
    void processQueue();
  }, [processQueue]);

  const enqueueUpload = useCallback(() => {
    void processQueue();
  }, [processQueue]);

  const retryClip = useCallback(
    async (clipId: string) => {
      if (!userId) {
        return;
      }
      const clip = await getClipById(clipId);
      if (!clip) {
        return;
      }
      try {
        await uploadClipWithRetry(clip, userId);
      } catch {
        // failed state updated in service
      }
      onClipUpdated();
    },
    [onClipUpdated, userId],
  );

  return { enqueueUpload, retryClip, processQueue };
}
