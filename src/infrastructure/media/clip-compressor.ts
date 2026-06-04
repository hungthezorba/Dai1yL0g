import * as FileSystem from 'expo-file-system/legacy';

import { clipUploadLog } from '@/features/clip/upload-logger';
import { CLIP_UPLOAD_PROFILE } from '@/features/clip/upload-profile';

export type CompressForUploadResult = {
  /** URI passed to storage upload (source or compressor output). */
  uploadUri: string;
  /** Temp file to delete after upload when compressor wrote a separate path. */
  tempUri?: string;
};

/**
 * Prefer hardware compress when native module exists; never copy to cache
 * (simulator copyAsync to cacheDirectory often fails).
 */
export async function compressClipForUpload(
  sourceUri: string,
  clipId: string,
): Promise<CompressForUploadResult> {
  try {
    const { compress } = await import('expo-image-and-video-compressor');
    clipUploadLog.info('compress start', { clipId, sourceUri });
    const compressedUri = await compress(sourceUri, CLIP_UPLOAD_PROFILE.compressOptions);
    if (compressedUri && compressedUri !== sourceUri) {
      clipUploadLog.info('compress ok', { clipId, compressedUri });
      return { uploadUri: compressedUri, tempUri: compressedUri };
    }
    clipUploadLog.info('compress returned source uri', { clipId });
    return { uploadUri: sourceUri };
  } catch (err) {
    clipUploadLog.warn('compress skipped — upload source file', { clipId, err });
    return { uploadUri: sourceUri };
  }
}

export async function deleteTempUploadFile(uri: string | undefined, sourceUri: string): Promise<void> {
  if (!uri || uri === sourceUri) {
    return;
  }
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
    clipUploadLog.info('deleted temp upload file', { uri });
  } catch {
    // best-effort
  }
}
