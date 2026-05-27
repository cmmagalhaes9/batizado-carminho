import { env } from '@config/env';

/**
 * Encodes/decodes the guest upload URL.
 *
 * Format: <origin><base>/upload#<eventId>|<encodedEventName>
 *
 * The hash carries event ID + name so guests see the right event without us
 * needing a database lookup. Hash (not query string) keeps it client-side only.
 */

export function buildGuestUrl(eventId: string, eventName: string): string {
  const base = `${window.location.origin}${env.VITE_BASE_PATH}`;
  // Strip trailing slash for clean concat, then add exactly one.
  const normalizedBase = base.replace(/\/+$/, '');
  return `${normalizedBase}/upload#${eventId}|${encodeURIComponent(eventName)}`;
}

export interface ParsedGuestHash {
  readonly eventId: string;
  readonly eventName: string;
}

export function parseGuestHash(hash: string): ParsedGuestHash | null {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  if (!raw) return null;

  const decoded = decodeURIComponent(raw);
  const sepIndex = decoded.indexOf('|');
  if (sepIndex === -1) {
    // Legacy / malformed — treat the whole thing as the ID with a generic name.
    return { eventId: decoded, eventName: 'Our Event' };
  }

  const eventId = decoded.slice(0, sepIndex);
  const eventName = decoded.slice(sepIndex + 1);
  if (!eventId) return null;

  return { eventId, eventName: eventName || 'Our Event' };
}
