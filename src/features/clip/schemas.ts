import { z } from 'zod';

export const clipRowSchema = z.object({
  id: z.string().uuid(),
  client_clip_id: z.string().uuid(),
  user_id: z.string().uuid(),
  day_key: z.string().min(1),
  captured_at: z.string(),
  duration_ms: z.number().int().positive(),
  has_audio: z.boolean(),
  storage_key: z.string().nullable(),
  thumbnail_key: z.string().nullable(),
  upload_state: z.enum(['uploading', 'posted', 'failed']),
  published_at: z.string().nullable(),
});

export type ClipRow = z.infer<typeof clipRowSchema>;

export const clipInsertResponseSchema = clipRowSchema;
