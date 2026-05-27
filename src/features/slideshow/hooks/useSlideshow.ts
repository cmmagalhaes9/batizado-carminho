import { useCallback, useEffect, useRef, useState } from 'react';
import type { MediaItem } from '@/types/domain';

interface UseSlideshowOptions {
  readonly media: readonly MediaItem[];
  readonly intervalMs?: number;
}

interface UseSlideshowResult {
  readonly currentIndex: number;
  readonly current: MediaItem | null;
  readonly progress: number;
  readonly paused: boolean;
  readonly next: () => void;
  readonly previous: () => void;
  readonly togglePause: () => void;
}

/**
 * Auto-advancing slideshow with progress tracking.
 *
 * Encapsulates:
 *  - Timer-driven advance (cleared & restarted on every interaction)
 *  - Progress bar tracking (0-100 across the interval)
 *  - Pause/resume state
 *  - Index wraparound at both ends
 */
export function useSlideshow({ media, intervalMs = 5000 }: UseSlideshowOptions): UseSlideshowResult {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  // Timers held in refs — they're not render state.
  const advanceTimerRef = useRef<number | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (advanceTimerRef.current !== null) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const advance = useCallback((delta: number) => {
    setCurrentIndex((idx) => {
      const len = media.length;
      if (len === 0) return 0;
      return (idx + delta + len) % len;
    });
    setProgress(0);
  }, [media.length]);

  const next = useCallback(() => advance(1), [advance]);
  const previous = useCallback(() => advance(-1), [advance]);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  // Reset the current index if the media list shrinks under our feet.
  useEffect(() => {
    if (currentIndex >= media.length && media.length > 0) {
      setCurrentIndex(0);
    }
  }, [media.length, currentIndex]);

  // Drive the timer.
  useEffect(() => {
    clearTimers();
    if (paused || media.length === 0) return;

    advanceTimerRef.current = window.setTimeout(() => {
      next();
    }, intervalMs);

    const tick = 100;
    progressTimerRef.current = window.setInterval(() => {
      setProgress((p) => Math.min(100, p + (100 * tick) / intervalMs));
    }, tick);

    return clearTimers;
  }, [currentIndex, paused, media.length, intervalMs, next, clearTimers]);

  const current: MediaItem | null = media[currentIndex] ?? null;

  return { currentIndex, current, progress, paused, next, previous, togglePause };
}
