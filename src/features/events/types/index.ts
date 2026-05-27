/**
 * Storage keys used by the events feature.
 * Centralized so renames are safe.
 */
export const STORAGE_KEYS = {
  EVENTS: 'events',
  CURRENT_EVENT: 'currentEventId',
  GUEST_NAME: 'guestName',
} as const;
