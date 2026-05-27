import { useCallback, useEffect, useRef, useState } from 'react';
import { getEventMedia } from '@services/cloudinary';
import type { MediaItem } from '@/types/domain';

interface UseEventMediaResult {
  readonly media: readonly MediaItem[];
  readonly loading: boolean;
  readonly error: Error | null;
  readonly refresh: () => Promise<void>;
}

interface UseEventMediaOptions {
  readonly eventId: string | null;
  /** Poll interval in ms. Set to 0 to disable polling. Default: 15000. */
  readonly pollIntervalMs?: number;
}

/**
 * Fetches an event's media list with optional polling.
 *
 * Handles:
 *  - In-flight request cancellation when eventId changes or component unmounts
 *  - Stale-response protection (ignores results for an event we no longer care about)
 *  - Loading & error states for the UI
 */
export function useEventMedia({
  eventId,
  pollIntervalMs = 15_000,
}: UseEventMediaOptions): UseEventMediaResult {
  const [media, setMedia] = useState<readonly MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(eventId !== null);
  const [error, setError] = useState<Error | null>(null);

  // Track the active AbortController so we can cancel it on cleanup.
  const abortRef = useRef<AbortController | null>(null);

  const fetchOnce = useCallback(async (id: string): Promise<void> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await getEventMedia(id, controller.signal);
      // Only commit if this request wasn't superseded.
      if (!controller.signal.aborted) {
        setMedia(result);
        setError(null);
      }
    } catch (err) {
      if (controller.signal.aborted) return; // expected, ignore
      const error = err instanceof Error ? err : new Error('Failed to load media');
      setError(error);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const refresh = useCallback(async (): Promise<void> => {
    if (eventId !== null) {
      await fetchOnce(eventId);
    }
  }, [eventId, fetchOnce]);

  // Initial fetch + polling
  useEffect(() => {
    if (eventId === null) {
      setMedia([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    void fetchOnce(eventId);

    if (pollIntervalMs <= 0) {
      return () => abortRef.current?.abort();
    }

    const handle = window.setInterval(() => {
      void fetchOnce(eventId);
    }, pollIntervalMs);

    return () => {
      window.clearInterval(handle);
      abortRef.current?.abort();
    };
  }, [eventId, pollIntervalMs, fetchOnce]);

  return { media, loading, error, refresh };
}
