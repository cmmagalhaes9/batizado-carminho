import type { MediaItem } from '@/types/domain';
import styles from './GalleryGrid.module.css';

interface GalleryGridProps {
  readonly media: readonly MediaItem[];
  readonly onSelect: (index: number) => void;
}

export function GalleryGrid({ media, onSelect }: GalleryGridProps) {
  return (
    <div className={styles.grid}>
      {media.map((item, idx) => (
        <button
          key={item.id}
          type="button"
          className={styles.tile}
          onClick={() => onSelect(idx)}
          aria-label={`Ver lembrança ${idx + 1} de ${media.length}${item.guestName ? ` por ${item.guestName}` : ''}`}
        >
          <img src={item.thumbUrl} alt="" loading="lazy" />
          {item.kind === 'video' && <span className={styles.videoMark}>▶ vídeo</span>}
          {item.guestName && <span className={styles.guestTag}>{item.guestName}</span>}
        </button>
      ))}
    </div>
  );
}
