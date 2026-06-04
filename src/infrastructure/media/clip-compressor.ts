import * as FileSystem from 'expo-file-system/legacy';

import { CLIP_UPLOAD_PROFILE } from '@/features/clip/upload-profile';

/**
 * Hardware-compress when `expo-image-and-video-compressor` is linked in the dev build.
 * Falls back to copying the camera file when the native module is absent (stale binary).
 */
export async function compressClipForUpload(sourceUri: string, clipId: string): Promise<string> {
  const stagingPath = `${FileSystem.cacheDirectory ?? ''}dai1yl0g/upload-${clipId}.mp4`;

  try {
    const { compress } = await import('expo-image-and-video-compressor');
    const compressedUri = await compress(sourceUri, CLIP_UPLOAD_PROFILE.compressOptions);
    await FileSystem.copyAsync({ from: compressedUri, to: stagingPath });
    if (compressedUri !== stagingPath) {
      await FileSystem.deleteAsync(compressedUri, { idempotent: true });
    }
    return stagingPath;
  } catch {
    await FileSystem.copyAsync({ from: sourceUri, to: stagingPath });
    return stagingPath;
  }
}

export async function deleteStagingUploadFile(path: string | undefined): Promise<void> {
  if (!path?.includes('/upload-')) {
    return;
  }
  try {
    await FileSystem.deleteAsync(path, { idempotent: true });
  } catch {
    // best-effort
  }
}
