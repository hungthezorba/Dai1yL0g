import { z } from 'zod';

const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export const displayNameSchema = z
  .string()
  .trim()
  .min(2, 'At least 2 characters')
  .max(32, 'At most 32 characters');

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(USERNAME_REGEX, '3–20 chars: lowercase letters, numbers, underscore');

export const birthYearSchema = z.coerce
  .number()
  .int()
  .min(1900)
  .max(new Date().getFullYear() - 13, 'You must be at least 13');

export const timezoneSchema = z.string().trim().min(1, 'Timezone is required');

export const avatarUrlSchema = z.string().url().nullable().optional();

export const profileSetupSchema = z.object({
  displayName: displayNameSchema,
  username: usernameSchema,
  timezone: timezoneSchema,
  birthYear: birthYearSchema,
  avatarUrl: avatarUrlSchema,
});

export const profileRowSchema = z.object({
  id: z.string().uuid(),
  display_name: displayNameSchema,
  username: usernameSchema,
  timezone: timezoneSchema,
  birth_year: z.number().int(),
  avatar_url: z.string().nullable().optional(),
});

export type ProfileRow = z.infer<typeof profileRowSchema>;

export function mapProfileRow(row: ProfileRow) {
  return {
    id: row.id,
    displayName: row.display_name,
    username: row.username,
    timezone: row.timezone,
    birthYear: row.birth_year,
    avatarUrl: row.avatar_url ?? null,
  };
}

