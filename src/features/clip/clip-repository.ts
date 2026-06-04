import * as FileSystem from 'expo-file-system/legacy';
import { requireOptionalNativeModule } from 'expo-modules-core';

import { getLocalDayKey } from '@/features/day/local-day';

import type { ClipIndexFile, LocalClip } from './types';

const CLIPS_ROOT = `${FileSystem.documentDirectory ?? ''}dai1yl0g/clips/`;
const INDEX_PATH = `${CLIPS_ROOT}index.json`;

function createClipId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `clip-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

async function ensureClipsDirectory(): Promise<void> {
  const info = await FileSystem.getInfoAsync(CLIPS_ROOT);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(CLIPS_ROOT, { intermediates: true });
  }
}

async function readIndex(): Promise<ClipIndexFile> {
  await ensureClipsDirectory();
  const info = await FileSystem.getInfoAsync(INDEX_PATH);
  if (!info.exists) {
    return { version: 1, clips: [] };
  }
  const raw = await FileSystem.readAsStringAsync(INDEX_PATH);
  const parsed = JSON.parse(raw) as ClipIndexFile;
  if (parsed.version !== 1 || !Array.isArray(parsed.clips)) {
    return { version: 1, clips: [] };
  }
  return parsed;
}

type ExpoVideoThumbnailsModule = {
  getThumbnail: (
    sourceFilename: string,
    options?: { time?: number },
  ) => Promise<{ uri: string }>;
};

/** Skip when dev build predates US-002; do not import `expo-video-thumbnails` (throws on load). */
async function generateClipThumbnail(
  videoPath: string,
  clipId: string,
): Promise<string | undefined> {
  const native = requireOptionalNativeModule<ExpoVideoThumbnailsModule>('ExpoVideoThumbnails');
  if (!native) {
    return undefined;
  }

  try {
    const thumb = await native.getThumbnail(videoPath, { time: 500 });
    const thumbDest = `${CLIPS_ROOT}${clipId}.jpg`;
    await FileSystem.copyAsync({ from: thumb.uri, to: thumbDest });
    await FileSystem.deleteAsync(thumb.uri, { idempotent: true });
    return thumbDest;
  } catch {
    return undefined;
  }
}

async function writeIndex(index: ClipIndexFile): Promise<void> {
  await ensureClipsDirectory();
  await FileSystem.writeAsStringAsync(INDEX_PATH, JSON.stringify(index, null, 2));
}

export async function listClipsForDay(dayKey: string = getLocalDayKey()): Promise<LocalClip[]> {
  const index = await readIndex();
  return index.clips
    .filter((clip) => clip.dayKey === dayKey)
    .sort((a, b) => a.capturedAt.localeCompare(b.capturedAt));
}

export async function saveClipFromRecording(options: {
  tempUri: string;
  durationMs: number;
  hasAudio: boolean;
  capturedAt?: Date;
}): Promise<LocalClip> {
  const capturedAt = options.capturedAt ?? new Date();
  const dayKey = getLocalDayKey(capturedAt);
  const id = createClipId();
  const destPath = `${CLIPS_ROOT}${id}.mp4`;

  await ensureClipsDirectory();
  await FileSystem.copyAsync({ from: options.tempUri, to: destPath });

  const thumbnailPath = await generateClipThumbnail(destPath, id);

  const clip: LocalClip = {
    id,
    dayKey,
    capturedAt: capturedAt.toISOString(),
    durationMs: options.durationMs,
    hasAudio: options.hasAudio,
    localPath: destPath,
    thumbnailPath,
    uploadState: 'local_only',
  };

  const index = await readIndex();
  index.clips.push(clip);
  await writeIndex(index);

  return clip;
}

/** Remove failed / too-short recordings from cache without indexing. */
export async function discardTempRecording(tempUri: string | undefined): Promise<void> {
  if (!tempUri) {
    return;
  }
  try {
    const info = await FileSystem.getInfoAsync(tempUri);
    if (info.exists) {
      await FileSystem.deleteAsync(tempUri, { idempotent: true });
    }
  } catch {
    // Best-effort cleanup
  }
}

export async function deleteClip(clipId: string): Promise<void> {
  const index = await readIndex();
  const target = index.clips.find((c) => c.id === clipId);
  if (!target) {
    return;
  }
  await FileSystem.deleteAsync(target.localPath, { idempotent: true });
  if (target.thumbnailPath) {
    await FileSystem.deleteAsync(target.thumbnailPath, { idempotent: true });
  }
  index.clips = index.clips.filter((c) => c.id !== clipId);
  await writeIndex(index);
}
