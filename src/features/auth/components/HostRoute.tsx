import { Navigate } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { UnlockScreen } from '@features/auth/components/UnlockScreen';
import { getCurrentEvent } from '@features/events/services/eventRepository';
import { grantAccess } from '@features/auth/services/authSession';

/**
 * Wraps protected pages (Host, Gallery, Slideshow).
 *
 * Three states:
 *  - No current event selected → redirect home
 *  - Event exists, this device is unauthorized → show PIN unlock
 *  - Event exists, device is authorized → render children
 *
 * This prevents guests who scanned the QR (and thus know the deploy URL)
 * from poking around at /host or /gallery just by typing the path.
 *
 * Legacy events (created before the PIN feature) have no hashedPin — those
 * are auto-granted on first access since there's no PIN to enter.
 */
export function HostRoute({ children }: { children: ReactNode }) {
  const event = getCurrentEvent();
  const { authorized, tryUnlock } = useAuth(event);

  // Auto-grant access to legacy events with no PIN configured.
  useEffect(() => {
    if (event && !event.hashedPin) {
      grantAccess(event.id);
    }
  }, [event]);

  if (!event) {
    return <Navigate to="/" replace />;
  }

  if (!authorized && event.hashedPin) {
    return <UnlockScreen eventName={event.name} onUnlock={tryUnlock} />;
  }

  return <>{children}</>;
}
