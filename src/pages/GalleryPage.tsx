import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '@shared/components/AppHeader';
import { useEventMedia } from '@features/events/hooks/useEventMedia';
import { GLOBAL_EVENT_ID, GLOBAL_EVENT_NAME } from '@features/events/services/globalEvent';
import { GalleryGrid } from '@features/gallery/components/GalleryGrid';
import { Lightbox } from '@features/gallery/components/Lightbox';
import styles from './GalleryPage.module.css';

export function GalleryPage() {
  const { media, loading, error, refresh } = useEventMedia({ eventId: GLOBAL_EVENT_ID });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <div className="wrap">
      <AppHeader
        action={
          <Link to="/" className={styles.backBtn}>
            ← voltar
          </Link>
        }
      />

      <main>
        {loading && media.length === 0 ? (
          <div className={styles.loading}>reunindo memórias…</div>
        ) : error && media.length === 0 ? (
          <ErrorState message={error.message} />
        ) : media.length === 0 ? (
          <EmptyState eventName={GLOBAL_EVENT_NAME} onRefresh={() => void refresh()} />
        ) : (
          <>
            <div className={styles.head}>
              <div>
                <h1 className={styles.title}>{GLOBAL_EVENT_NAME}</h1>
                <div className={styles.count}>
                  {media.length} {media.length === 1 ? 'lembrança' : 'lembranças'}
                </div>
              </div>
              <button type="button" className={styles.refreshBtn} onClick={() => void refresh()}>
                ↻ atualizar
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

      <footer className="app-footer">atualiza a cada poucos segundos ✿</footer>
    </div>
  );
}

function EmptyState({ eventName, onRefresh }: { eventName: string; onRefresh: () => void }) {
  return (
    <>
      <div className={styles.head}>
        <h1 className={styles.title}>{eventName}</h1>
        <button type="button" className={styles.refreshBtn} onClick={onRefresh}>
          ↻ atualizar
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
        <h2>ainda não há fotos</h2>
        <p>pede aos convidados para enviarem as suas lembranças do batizado</p>
      </div>
    </>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className={styles.empty}>
      <div className={styles.emptyIcon}>!</div>
      <h2>não foi possível carregar</h2>
      <p>{message}</p>
    </div>
  );
}
