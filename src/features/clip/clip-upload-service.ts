import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';

import { getSupabaseClient, isSupabaseConfigured } from '@/infrastructure/supabase/client';
import { compressClipForUpload, deleteStagingUploadFile } from '@/infrastructure/media/clip-compressor';

import { getClipById, updateClipInIndex } from './clip-repository';
import { clipInsertResponseSchema } from './schemas';
import type { LocalClip } from './types';
import { clipUploadLog } from './upload-logger';
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

function toUserUploadMessage(error: unknown): string {
  const raw =
    error instanceof ClipUploadError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Could not post clip.';

  if (raw.includes('schema cache') || raw.includes('relation') || raw.includes('does not exist')) {
    return 'Server not ready — run supabase/migrations/002_clips_storage.sql in Supabase.';
  }
  if (raw.includes('row-level security') || raw.includes('policy') || raw.includes('RLS')) {
    return 'Upload blocked — run 003_clips_storage_rls_fix.sql in Supabase SQL editor.';
  }
  if (raw.includes('mime type') || raw.includes('not supported')) {
    return 'Upload rejected — check clips bucket allows video/mp4.';
  }
  return raw;
}

async function assertLocalFileReadable(uri: string, label: string): Promise<number> {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists) {
    throw new ClipUploadError(`${label} file missing at ${uri}`, 'UPLOAD_FAILED');
  }
  const size = 'size' in info && typeof info.size === 'number' ? info.size : 0;
  clipUploadLog.info(`${label} file ok`, { uri, bytes: size });
  return size;
}

async function readFileAsArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  if (!base64?.length) {
    throw new ClipUploadError('Clip file is empty.', 'UPLOAD_FAILED');
  }
  return decode(base64);
}

async function uploadStorageObject(
  storageKey: string,
  localUri: string,
  contentType: string,
): Promise<void> {
  const supabase = getSupabaseClient();
  const body = await readFileAsArrayBuffer(localUri);
  clipUploadLog.info('storage.upload start', {
    bucket: clipStorageBucket(),
    key: storageKey,
    contentType,
    bytes: body.byteLength,
  });

  const { data, error } = await supabase.storage.from(clipStorageBucket()).upload(storageKey, body, {
    contentType,
    upsert: true,
  });

  if (error) {
    clipUploadLog.error('storage.upload failed', error, { storageKey, contentType });
    throw new ClipUploadError(error.message, 'UPLOAD_FAILED');
  }

  clipUploadLog.info('storage.upload ok', { path: data?.path ?? storageKey });
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
    clipUploadLog.error('clips.select failed', error, { clientClipId });
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
    clipUploadLog.error('clips.insert failed', error, { clientClipId: clip.id, storageKey });
    throw new ClipUploadError(error.message, 'UPLOAD_FAILED');
  }

  clipUploadLog.info('clips.insert ok', { remoteId: data.id, clientClipId: clip.id });
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
  clipUploadLog.warn('clip marked failed', { clipId: clip.id, attempt, message });
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

async function logAuthContext(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  clipUploadLog.info('auth context', {
    userId,
    hasSession: Boolean(data.session),
    sessionUserId: data.session?.user.id ?? null,
    accessTokenPresent: Boolean(data.session?.access_token),
    authError: error?.message ?? null,
  });
  if (!data.session?.access_token) {
    throw new ClipUploadError('No auth session — sign in again.', 'NOT_AUTHENTICATED');
  }
  if (data.session.user.id !== userId) {
    throw new ClipUploadError('Session user mismatch.', 'NOT_AUTHENTICATED');
  }
}

export async function uploadClip(clip: LocalClip, userId: string): Promise<LocalClip> {
  const attempt = (clip.uploadAttempt ?? 0) + 1;
  clipUploadLog.info('uploadClip start', {
    clipId: clip.id,
    attempt,
    uploadState: clip.uploadState,
    localPath: clip.localPath,
  });

  let working = await markClipUploading(clip, attempt);

  let stagingPath: string | undefined;
  try {
    if (!isSupabaseConfigured()) {
      throw new ClipUploadError('Supabase is not configured.', 'NOT_CONFIGURED');
    }
    if (!userId) {
      throw new ClipUploadError('Sign in to post clips.', 'NOT_AUTHENTICATED');
    }

    await logAuthContext(userId);
    await assertLocalFileReadable(clip.localPath, 'source');

    const existing = await findExistingRemoteClip(clip.id, userId);
    if (existing?.upload_state === 'posted') {
      clipUploadLog.info('remote clip already posted', { remoteId: existing.id });
      working = await markClipPosted(working, existing.id);
      return working;
    }

    stagingPath = await compressClipForUpload(clip.localPath, clip.id);
    await assertLocalFileReadable(stagingPath, 'staging');

    const videoKey = clipVideoStorageKey(userId, clip.id);
    await uploadStorageObject(videoKey, stagingPath, 'video/mp4');

    let thumbnailKey: string | null = null;
    if (working.thumbnailPath) {
      thumbnailKey = clipThumbnailStorageKey(userId, clip.id);
      await uploadStorageObject(thumbnailKey, working.thumbnailPath, 'image/jpeg');
    }

    const row = await insertClipRow(working, userId, videoKey, thumbnailKey);
    working = await markClipPosted(working, row.id);
    clipUploadLog.info('uploadClip success', { clipId: clip.id, remoteId: row.id });
    return working;
  } catch (err) {
    const message = toUserUploadMessage(err);
    clipUploadLog.error('uploadClip failed', err, { clipId: clip.id, attempt, message });
    working = await markClipFailed(working, message, attempt);
    throw err instanceof ClipUploadError ? err : new ClipUploadError(message, 'UPLOAD_FAILED');
  } finally {
    await deleteStagingUploadFile(stagingPath);
  }
}

export async function uploadClipWithRetry(clip: LocalClip, userId: string): Promise<LocalClip> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_UPLOAD_ATTEMPTS; attempt++) {
    const refreshed = await getClipById(clip.id);
    const current = refreshed ?? clip;

    clipUploadLog.info('uploadClipWithRetry attempt', {
      clipId: clip.id,
      attempt,
      max: MAX_UPLOAD_ATTEMPTS,
      state: current.uploadState,
    });

    try {
      return await uploadClip(current, userId);
    } catch (err) {
      lastError = err;
      if (!shouldRetryUpload(attempt, MAX_UPLOAD_ATTEMPTS)) {
        break;
      }
      const delay = uploadRetryDelayMs(attempt);
      clipUploadLog.warn('retrying after delay', { clipId: clip.id, attempt, delayMs: delay });
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  const message = toUserUploadMessage(lastError);
  const latest = (await getClipById(clip.id)) ?? clip;
  if (latest.uploadState !== 'failed') {
    await markClipFailed(latest, message, MAX_UPLOAD_ATTEMPTS);
  }

  throw lastError instanceof Error ? lastError : new Error(message);
}

export function isClipUploadable(state: LocalClip['uploadState']): boolean {
  return state === 'local_only' || state === 'failed' || state === 'uploading';
}

export const UPLOAD_USER_MESSAGE = "Couldn't post — saved on device. Tap to retry.";
