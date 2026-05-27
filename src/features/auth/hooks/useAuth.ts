import { useCallback, useState } from 'react';
import { grantAccess, isAuthorized, revokeAccess } from '../services/authSession';
import { verifyPin } from '../services/pinHashing';
import type { Event } from '@/types/domain';

interface UseAuthResult {
  readonly authorized: boolean;
  readonly tryUnlock: (pin: string) => Promise<boolean>;
  readonly lock: () => void;
}

/**
 * Authorization state for a specific event on this device.
 *
 * `tryUnlock` returns true on success (and persists the grant so refreshes
 * stay unlocked). The caller decides what to do on success — typically
 * the route guard re-renders and lets the host through.
 */
export function useAuth(event: Event | null): UseAuthResult {
  const [authorized, setAuthorized] = useState<boolean>(() =>
    event ? isAuthorized(event.id) : false,
  );

  const tryUnlock = useCallback(
    async (pin: string): Promise<boolean> => {
      if (!event || !event.hashedPin) return false;
      const ok = await verifyPin(pin, event.id, event.hashedPin);
      if (ok) {
        grantAccess(event.id);
        setAuthorized(true);
      }
      return ok;
    },
    [event],
  );

  const lock = useCallback(() => {
    if (!event) return;
    revokeAccess(event.id);
    setAuthorized(false);
  }, [event]);

  return { authorized, tryUnlock, lock };
}
