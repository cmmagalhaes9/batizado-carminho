/**
 * Pure, side-effect-free formatters and helpers.
 * Easy to test (no mocking required).
 */

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 30);
}

const SHORT_ID_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

export function shortId(length = 6): string {
  let out = '';
  for (let i = 0; i < length; i++) {
    const idx = Math.floor(Math.random() * SHORT_ID_ALPHABET.length);
    out += SHORT_ID_ALPHABET[idx];
  }
  return out;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function formatTimeAgo(timestamp: number, now: number = Date.now()): string {
  const seconds = Math.floor((now - timestamp) / 1000);
  if (seconds < 60) return 'agora';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
  return `${Math.floor(seconds / 86400)}d atrás`;
}

/**
 * Generates a unique-ish ID for upload queue items.
 * Not cryptographically secure — just needs to be locally unique within a session.
 */
export function generateLocalId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
