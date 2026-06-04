import { getSupabaseClient, isSupabaseConfigured } from '@/infrastructure/supabase/client';
import { compressClipForUpload, deleteStagingUploadFile } from '@/infrastructure/media/clip-compressor';

import { getClipById, updateClipInIndex } from './clip-repository';
import { clipInsertResponseSchema } from './schemas';
import type { LocalClip } from './types';
import { clipStorageBucket, clipThumbnailStorageKey, clipVideoStorageKey } from './upload-paths';
import { shouldRetryUpload, uploadRetryDelayMs } from './upload-retry';

const MAX_UPLOAD_ATTEMPTS = 4;

export class ClipUploadError extends Error {
  constructor(
    message: string,
    readonly code: 'NOT_CONFIGURED' | 'NOT_AUTHENTICATED' | 'COMPRESS_FAILED' | 'UPLOAD_FAILED',
  ) {
    super(message);
    this.name = 'ClipUploadError';
  }
}

async function readFileAsArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const response = await fetch(uri);
  if (!response.ok) {
    throw new ClipUploadError('Could not read clip file.', 'UPLOAD_FAILED');
  }
  return response.arrayBuffer();
}

async function uploadStorageObject(
  storageKey: string,
  localUri: string,
  contentType: string,
): Promise<void> {
  const supabase = getSupabaseClient();
  const body = await readFileAsArrayBuffer(localUri);
  const { error } = await supabase.storage.from(clipStorageBucket()).upload(storageKey, body, {
    contentType,
    upsert: true,
  });
  if (error) {
    throw new ClipUploadError(error.message, 'UPLOAD_FAILED');
  }
}

async function findExistingRemoteClip(clientClipId: string, userId: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('clips')
    .select('*')
    .eq('client_clip_id', clientClipId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new ClipUploadError(error.message, 'UPLOAD_FAILED');
  }
  if (!data) {
    return null;
  }
  return clipInsertResponseSchema.parse(data);
}

async function insertClipRow(clip: LocalClip, userId: string, storageKey: string, thumbnailKey: string | null) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('clips')
    .insert({
      client_clip_id: clip.id,
      user_id: userId,
      day_key: clip.dayKey,
      captured_at: clip.capturedAt,
      duration_ms: clip.durationMs,
      has_audio: clip.hasAudio,
      storage_key: storageKey,
      thumbnail_key: thumbnailKey,
      upload_state: 'posted',
      published_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    throw new ClipUploadError(error.message, 'UPLOAD_FAILED');
  }

  return clipInsertResponseSchema.parse(data);
}

async function markClipPosted(clip: LocalClip, remoteId: string): Promise<LocalClip> {
  return updateClipInIndex(clip.id, {
    uploadState: 'posted',
    remoteId,
    uploadError: undefined,
  });
}

async function markClipFailed(clip: LocalClip, message: string, attempt: number): Promise<LocalClip> {
  return updateClipInIndex(clip.id, {
    uploadState: 'failed',
    uploadError: message,
    uploadAttempt: attempt,
  });
}

async function markClipUploading(clip: LocalClip, attempt: number): Promise<LocalClip> {
  return updateClipInIndex(clip.id, {
    uploadState: 'uploading',
    uploadAttempt: attempt,
    uploadError: undefined,
  });
}

export async function uploadClip(clip: LocalClip, userId: string): Promise<LocalClip> {
  if (!isSupabaseConfigured()) {
    throw new ClipUploadError('Supabase is not configured.', 'NOT_CONFIGURED');
  }
  if (!userId) {
    throw new ClipUploadError('Sign in to post clips.', 'NOT_AUTHENTICATED');
  }

  const existing = await findExistingRemoteClip(clip.id, userId);
  if (existing?.upload_state === 'posted') {
    return markClipPosted(clip, existing.id);
  }

  const attempt = (clip.uploadAttempt ?? 0) + 1;
  let working = await markClipUploading(clip, attempt);

  let stagingPath: string | undefined;
  try {
    stagingPath = await compressClipForUpload(clip.localPath, clip.id);

    const videoKey = clipVideoStorageKey(userId, clip.id);
    await uploadStorageObject(videoKey, stagingPath, 'video/mp4');

    let thumbnailKey: string | null = null;
    if (working.thumbnailPath) {
      thumbnailKey = clipThumbnailStorageKey(userId, clip.id);
      await uploadStorageObject(thumbnailKey, working.thumbnailPath, 'image/jpeg');
    }

    const row = await insertClipRow(working, userId, videoKey, thumbnailKey);
    working = await markClipPosted(working, row.id);
    return working;
  } catch (err) {
    const message =
      err instanceof ClipUploadError
        ? err.message
        : err instanceof Error
          ? err.message
          : 'Could not post clip.';
    working = await markClipFailed(working, message, attempt);
    throw err;
  } finally {
    await deleteStagingUploadFile(stagingPath);
  }
}

export async function uploadClipWithRetry(clip: LocalClip, userId: string): Promise<LocalClip> {
  let current = clip;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
    current = { ...current, uploadAttempt: attempt - 1 };
    try {
      return await uploadClip(current, userId);
    } catch (err) {
      lastError = err;
      if (!shouldRetryUpload(attempt, MAX_UPLOAD_ATTEMPTS)) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, uploadRetryDelayMs(attempt)));
      const refreshed = await getClipById(clip.id);
      if (refreshed) {
        current = refreshed;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Upload failed');
}

export function isClipUploadable(state: LocalClip['uploadState']): boolean {
  return state === 'local_only' || state === 'failed';
}

export const UPLOAD_USER_MESSAGE = "Couldn't post — saved on device. Tap to retry.";
