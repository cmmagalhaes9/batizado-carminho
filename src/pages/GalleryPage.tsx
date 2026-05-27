import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AppHeader } from '@shared/components/AppHeader';
import { useEventMedia } from '@features/events/hooks/useEventMedia';
import { getCurrentEvent } from '@features/events/services/eventRepository';
import { GalleryGrid } from '@features/gallery/components/GalleryGrid';
import { Lightbox } from '@features/gallery/components/Lightbox';
import styles from './GalleryPage.module.css';

export function GalleryPage() {
  const event = getCurrentEvent();
  const { media, loading, error, refresh } = useEventMedia({ eventId: event?.id ?? null });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!event) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="wrap">
      <AppHeader
        action={
          <Link to="/host" className={styles.backBtn}>
            ← back
          </Link>
        }
      />

      <main>
        {loading && media.length === 0 ? (
          <div className={styles.loading}>gathering memories…</div>
        ) : error && media.length === 0 ? (
          <ErrorState message={error.message} />
        ) : media.length === 0 ? (
          <EmptyState eventName={event.name} onRefresh={() => void refresh()} />
        ) : (
          <>
            <div className={styles.head}>
              <div>
                <h1 className={styles.title}>{event.name}</h1>
                <div className={styles.count}>
                  {media.length} {media.length === 1 ? 'memory' : 'memories'}
                </div>
              </div>
              <button type="button" className={styles.refreshBtn} onClick={() => void refresh()}>
                ↻ refresh
              </button>
            </div>
            <GalleryGrid media={media} onSelect={setLightboxIndex} />
          </>
        )}
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          media={media}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}

      <footer className="app-footer">refreshes every few seconds ✿</footer>
    </div>
  );
}

function EmptyState({ eventName, onRefresh }: { eventName: string; onRefresh: () => void }) {
  return (
    <>
      <div className={styles.head}>
        <h1 className={styles.title}>{eventName}</h1>
        <button type="button" className={styles.refreshBtn} onClick={onRefresh}>
          ↻ refresh
        </button>
      </div>
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          <svg
            width="34"
            height="34"
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
        <h2>no photos yet</h2>
        <p>share the QR with your guests to begin</p>
      </div>
    </>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>!</div>
      <h2>could not load</h2>
      <p>{message}</p>
    </div>
  );
}
