import { useEffect } from 'react';
import type { MediaItem } from '@/types/domain';
import styles from './Lightbox.module.css';

interface LightboxProps {
  readonly media: readonly MediaItem[];
  readonly currentIndex: number;
  readonly onClose: () => void;
  readonly onNavigate: (index: number) => void;
}

export function Lightbox({ media, currentIndex, onClose, onNavigate }: LightboxProps) {
  const item = media[currentIndex];

  const next = () => onNavigate((currentIndex + 1) % media.length);
  const previous = () => onNavigate((currentIndex - 1 + media.length) % media.length);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') previous();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, media.length]);

  if (!item) return null;

  return (
    <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="visualizador de mídia">
      <button type="button" className={styles.close} onClick={onClose} aria-label="Fechar">
        ×
      </button>
      <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={previous} aria-label="Anterior">
        ‹
      </button>
      <button type="button" className={`${styles.nav} ${styles.next}`} onClick={next} aria-label="Próximo">
        ›
      </button>

      <div className={styles.content}>
        {item.kind === 'video' ? (
          <video src={item.fullUrl} controls autoPlay playsInline />
        ) : (
          <img src={item.fullUrl} alt="" />
        )}
      </div>

      <div className={styles.info}>
        {item.guestName && (
          <>
            por <strong>{item.guestName}</strong> ·{' '}
          </>
        )}
        {currentIndex + 1} of {media.length}
      </div>
    </div>
  );
}
