import { isValidClientClipId } from '../src/features/clip/clip-id.ts';
import { CLIP_UPLOAD_PROFILE, CLIPS_STORAGE_BUCKET } from '../src/features/clip/upload-profile.ts';
import { shouldRetryUpload, uploadRetryDelayMs } from '../src/features/clip/upload-retry.ts';
import { clipRowSchema } from '../src/features/clip/schemas.ts';

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

const userId = '550e8400-e29b-41d4-a716-446655440000';
const clipId = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';

assert(isValidClientClipId(clipId), 'valid uuid clip id');
assert(!isValidClientClipId('clip-1780395340384-mp8ywu1'), 'reject legacy clip- prefix id');

assert(CLIPS_STORAGE_BUCKET === 'clips', 'clips bucket name');
assert(`${userId}/${clipId}.mp4` === `${userId}/${clipId}.mp4`, 'video storage key shape');
assert(`${userId}/${clipId}.jpg` === `${userId}/${clipId}.jpg`, 'thumbnail storage key shape');

assert(CLIP_UPLOAD_PROFILE.targetBitrateBps === 2_000_000, 'bitrate preset');
assert(CLIP_UPLOAD_PROFILE.maxSize === 1080, 'max resolution');

assert(uploadRetryDelayMs(1) === 2000, 'first retry delay');
assert(uploadRetryDelayMs(3) === 8000, 'third retry delay');
assert(uploadRetryDelayMs(10) === 60_000, 'max retry cap');
assert(shouldRetryUpload(1, 4), 'retry when attempts remain');
assert(!shouldRetryUpload(4, 4), 'stop after max attempts');

assert(
  clipRowSchema.safeParse({
    id: clipId,
    client_clip_id: clipId,
    user_id: userId,
    day_key: '2026-06-02',
    captured_at: new Date().toISOString(),
    duration_ms: 5000,
    has_audio: true,
    storage_key: `${userId}/${clipId}.mp4`,
    thumbnail_key: `${userId}/${clipId}.jpg`,
    upload_state: 'posted',
    published_at: new Date().toISOString(),
  }).success,
  'parse posted clip row',
);

console.log('scripts/test-clip-upload.mjs: ok');
