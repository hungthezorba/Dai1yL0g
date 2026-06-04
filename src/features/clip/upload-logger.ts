/** Dev-friendly logs for clip upload — filter Metro with `[clip-upload]`. */
const PREFIX = '[clip-upload]';

export const clipUploadLog = {
  info(message: string, extra?: Record<string, unknown>) {
    if (extra) {
      console.log(PREFIX, message, extra);
    } else {
      console.log(PREFIX, message);
    }
  },
  warn(message: string, extra?: Record<string, unknown>) {
    if (extra) {
      console.warn(PREFIX, message, extra);
    } else {
      console.warn(PREFIX, message);
    }
  },
  error(message: string, error?: unknown, extra?: Record<string, unknown>) {
    const errPayload =
      error instanceof Error
        ? { name: error.name, message: error.message, stack: error.stack }
        : error;
    console.error(PREFIX, message, { ...extra, error: errPayload });
  },
};
