import { getItem, setItem } from '@services/storage';

/**
 * Per-device record of "I've verified my PIN for these events".
 *
 * Lives in localStorage so a refresh doesn't kick the host out, but the
 * hashed PIN is still required to unlock for the first time on each device.
 *
 * This is session-not-credential: we don't store the PIN, only the fact
 * that THIS device proved knowledge of it once.
 */

const SESSION_KEY = 'authorizedEventIds';

function readAuthorizedSet(): Set<string> {
  const stored = getItem<readonly string[]>(SESSION_KEY) ?? [];
  return new Set(stored);
}

export function isAuthorized(eventId: string): boolean {
  return readAuthorizedSet().has(eventId);
}

export function grantAccess(eventId: string): void {
  const set = readAuthorizedSet();
  set.add(eventId);
  setItem(SESSION_KEY, Array.from(set));
}

export function revokeAccess(eventId: string): void {
  const set = readAuthorizedSet();
  set.delete(eventId);
  setItem(SESSION_KEY, Array.from(set));
}
