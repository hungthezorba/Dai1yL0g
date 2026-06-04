/** ClipUploadProfile v1 — docs/product/data-model.md */
export const CLIP_UPLOAD_PROFILE = {
  videoCodec: 'h264' as const,
  maxSize: 1080,
  targetBitrateBps: 2_000_000,
  audioBitrateKbps: 128,
  container: 'mp4' as const,
  thumbnailTimeMs: 1000,
  compressOptions: {
    maxSize: 1080,
    bitrate: 2_000_000,
    codec: 'h264' as const,
    speed: 'ultrafast' as const,
  },
} as const;

export const CLIPS_STORAGE_BUCKET = 'clips';
