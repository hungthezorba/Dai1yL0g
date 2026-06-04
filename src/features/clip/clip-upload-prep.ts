import * as FileSystem from 'expo-file-system/legacy';

import { listClipsPendingUpload, removeClipFromIndex } from './clip-repository';
import { isValidClientClipId } from './clip-id';
import { clipUploadLog } from './upload-logger';
import type { LocalClip } from './types';

async function localFileExists(uri: string): Promise<boolean> {
  const info = await FileSystem.getInfoAsync(uri);
  return info.exists;
}

/**
 * Drops legacy `clip-*` ids and index rows whose video file is gone (simulator reinstall).
 */
export async function sanitizeClipsBeforeUpload(): Promise<LocalClip[]> {
  const pending = await listClipsPendingUpload();
  const ready: LocalClip[] = [];

  for (const clip of pending) {
    if (!isValidClientClipId(clip.id)) {
      clipUploadLog.warn('removing legacy clip id from index', { clipId: clip.id });
      await removeClipFromIndex(clip.id);
      continue;
    }

    if (!(await localFileExists(clip.localPath))) {
      clipUploadLog.warn('removing clip with missing file', {
        clipId: clip.id,
        localPath: clip.localPath,
      });
      await removeClipFromIndex(clip.id);
      continue;
    }

    ready.push(clip);
  }

  clipUploadLog.info('sanitize complete', { pending: pending.length, ready: ready.length });
  return ready;
}
