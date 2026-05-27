import { useEffect, useMemo } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useEventMedia } from '@features/events/hooks/useEventMedia';
import { getCurrentEvent } from '@features/events/services/eventRepository';
import { useSlideshow } from '@features/slideshow/hooks/useSlideshow';
import type { MediaItem } from '@/types/domain';
import styles from './SlideshowPage.module.css';

export function SlideshowPage() {
  const event = getCurrentEvent();
  // Slideshow polls less aggressively — 30s feels fine for a party.
  const { media } = useEventMedia({ eventId: event?.id ?? null, pollIntervalMs: 30_000 });

  // Slideshow plays oldest → newest so the most recent additions feel "fresh"
  const orderedMedia = useMemo(() => [...media].reverse(), [media]);

  const { current, currentIndex, progress, paused, next, previous, togglePause } = useSlideshow({
    media: orderedMedia,
  });

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        previous();
      } else if (e.key === 'p' || e.key === 'P') {
        togglePause();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, previous, togglePause]);

  if (!event) return <Navigate to="/" replace />;

  if (orderedMedia.length === 0) {
    return (
      <div className={styles.centerMsg}>
        <div className={styles.iconWrap}>
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <h1>waiting for memories…</h1>
        <p>share the QR with your guests</p>
        <Link to="/host" className={styles.backLink}>
          ← back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.body}>
      <div className={styles.progress}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.titleBar}>
        <div className={styles.eventTitle}>
          <span className={styles.heart}>♡</span>
          {event.name}
        </div>
        <div className={styles.counter}>
          {currentIndex + 1} / {orderedMedia.length}
        </div>
      </div>

      {/* Ambient blurred background of current image */}
      {current && (
        <div
          className={styles.ambient}
          style={{ backgroundImage: `url(${current.thumbUrl})` }}
        />
      )}

      <div className={styles.stage}>
        {current && <Slide key={current.id} item={current} />}
      </div>

      {current?.guestName && (
        <div className={styles.caption}>
          <span className={styles.by}>by</span>
          {current.guestName}
        </div>
      )}

      <div className={styles.controls}>
        <button type="button" className={styles.ctrl} onClick={previous} aria-label="Previous">
          ‹
        </button>
        <button type="button" className={styles.ctrl} onClick={togglePause} aria-label={paused ? 'Play' : 'Pause'}>
          {paused ? '▶' : '⏸'}
        </button>
        <button type="button" className={styles.ctrl} onClick={next} aria-label="Next">
          ›
        </button>
        <button type="button" className={styles.ctrl} onClick={toggleFullscreen} aria-label="Fullscreen">
          ⛶
        </button>
        <Link to="/host" className={styles.ctrl} aria-label="Back">
          ←
        </Link>
      </div>
    </div>
  );
}

function Slide({ item }: { item: MediaItem }) {
  return (
    <div className={styles.slide}>
      {item.kind === 'video' ? (
        <video src={item.fullUrl} autoPlay muted playsInline />
      ) : (
        <img src={item.fullUrl} alt="" />
      )}
    </div>
  );
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    void document.documentElement.requestFullscreen();
  } else {
    void document.exitFullscreen();
  }
}
