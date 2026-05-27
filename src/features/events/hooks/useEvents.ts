import { useCallback, useState } from 'react';
import type { Event } from '@/types/domain';
import {
  createEvent as createEventInRepo,
  getAllEvents,
} from '../services/eventRepository';

/**
 * Manages the host's event list (read + create).
 *
 * State stays in sync because every mutation goes through the repository,
 * then we re-read. Single source of truth is localStorage, this hook is a view.
 */
export function useEvents() {
  const [events, setEvents] = useState<readonly Event[]>(() => getAllEvents());

  const refresh = useCallback(() => {
    setEvents(getAllEvents());
  }, []);

  const create = useCallback(
    async (name: string, pin: string): Promise<Event> => {
      const event = await createEventInRepo({ name, pin });
      refresh();
      return event;
    },
    [refresh],
  );

  return { events, create, refresh };
}
