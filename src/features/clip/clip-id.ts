const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** `clips.client_clip_id` is uuid — legacy `clip-*` ids cannot upload. */
export function isValidClientClipId(id: string): boolean {
  return UUID_REGEX.test(id);
}
