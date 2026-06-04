export type ClipUploadState = 'local_only' | 'uploading' | 'posted' | 'failed';

export type LocalClip = {
  id: string;
  dayKey: string;
  capturedAt: string;
  durationMs: number;
  hasAudio: boolean;
  localPath: string;
  thumbnailPath?: string;
  uploadState: ClipUploadState;
};

export type ClipIndexFile = {
  version: 1;
  clips: LocalClip[];
};
