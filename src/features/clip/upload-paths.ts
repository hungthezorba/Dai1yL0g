import { CLIPS_STORAGE_BUCKET } from './upload-profile';

export function clipVideoStorageKey(userId: string, clientClipId: string): string {
  return `${userId}/${clientClipId}.mp4`;
}

export function clipThumbnailStorageKey(userId: string, clientClipId: string): string {
  return `${userId}/${clientClipId}.jpg`;
}

export function clipStorageBucket(): string {
  return CLIPS_STORAGE_BUCKET;
}
