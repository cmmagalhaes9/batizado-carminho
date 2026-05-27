/**
 * Typed wrapper around localStorage.
 *
 * Keeps:
 *  - Type safety on get/set (caller specifies expected shape)
 *  - Namespacing (all keys prefixed) to avoid collisions
 *  - Graceful failure (private browsing, quota errors) — never throws
 *  - JSON serialization in one place
 */

const NAMESPACE = 'little_memories';

function makeKey(key: string): string {
  return `${NAMESPACE}:${key}`;
}

export function getItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(makeKey(key));
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.warn(`[storage] Failed to read ${key}:`, err);
    return null;
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(makeKey(key), JSON.stringify(value));
  } catch (err) {
    // Quota exceeded, or private mode. Surface in console but don't crash.
    console.warn(`[storage] Failed to write ${key}:`, err);
  }
}

export function removeItem(key: string): void {
  try {
    localStorage.removeItem(makeKey(key));
  } catch (err) {
    console.warn(`[storage] Failed to remove ${key}:`, err);
  }
}
