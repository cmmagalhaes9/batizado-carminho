import { getItem, removeItem, setItem } from '@services/storage';
import type { Event } from '@/types/domain';
import { shortId, slugify } from '@shared/utils/format';
import { hashPin } from '@features/auth/services/pinHashing';
import { grantAccess } from '@features/auth/services/authSession';
import { STORAGE_KEYS } from '../types';

/**
 * The host's event registry lives in localStorage.
 * The events store full event metadata; the PIN is stored hashed (see pinHashing).
 */

type EventMap = Record<string, Event>;

function getAllEventsMap(): EventMap {
  return getItem<EventMap>(STORAGE_KEYS.EVENTS) ?? {};
}

export function getAllEvents(): Event[] {
  return Object.values(getAllEventsMap()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getEventById(id: string): Event | null {
  return getAllEventsMap()[id] ?? null;
}

export function getCurrentEventId(): string | null {
  return getItem<string>(STORAGE_KEYS.CURRENT_EVENT);
}

export function getCurrentEvent(): Event | null {
  const id = getCurrentEventId();
  return id ? getEventById(id) : null;
}

export function setCurrentEvent(id: string): void {
  setItem(STORAGE_KEYS.CURRENT_EVENT, id);
}

export function clearCurrentEvent(): void {
  removeItem(STORAGE_KEYS.CURRENT_EVENT);
}

interface CreateEventInput {
  readonly name: string;
  readonly pin: string;
}

/**
 * Creates a new event with an associated PIN.
 * The PIN is hashed before storage; the creating device is automatically
 * marked as authorized so the host doesn't have to enter their own PIN twice.
 */
export async function createEvent({ name, pin }: CreateEventInput): Promise<Event> {
  const id = `${slugify(name) || 'event'}-${shortId(5)}`;
  const hashedPin = await hashPin(pin, id);
  const event: Event = { id, name, createdAt: Date.now(), hashedPin };

  const all = getAllEventsMap();
  all[id] = event;
  setItem(STORAGE_KEYS.EVENTS, all);
  setCurrentEvent(id);
  // Creator gets immediate access on this device.
  grantAccess(id);

  return event;
}
