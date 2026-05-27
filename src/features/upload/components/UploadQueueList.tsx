import { formatBytes } from '@shared/utils/format';
import type { UploadItem } from '../hooks/useUploadQueue';
import styles from './UploadQueueList.module.css';

interface UploadQueueListProps {
  readonly items: readonly UploadItem[];
}

export function UploadQueueList({ items }: UploadQueueListProps) {
  if (items.length === 0) return null;

  return (
    <div className={styles.queue}>
      {items.map((item) => (
        <QueueItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function QueueItem({ item }: { item: UploadItem }) {
  const statusIcon = getStatusIcon(item.status);
  const meta = getMetaText(item);

  return (
    <div className={styles.item}>
      <div
        className={styles.thumb}
        style={item.previewUrl ? { backgroundImage: `url(${item.previewUrl})` } : undefined}
        aria-hidden="true"
      >
        {!item.previewUrl && <span className={styles.videoIcon}>♥</span>}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{item.file.name}</div>
        <div className={styles.meta}>{meta}</div>
        <div className={styles.barWrap}>
          <div
            className={`${styles.bar} ${item.status === 'done' ? styles.barDone : ''}`}
            style={{ width: `${item.progress}%` }}
          />
        </div>
      </div>
      <span
        className={`${styles.statusIcon} ${item.status === 'uploading' ? styles.spinning : ''} ${
          item.status === 'done' ? styles.statusDone : ''
        } ${item.status === 'failed' ? styles.statusFailed : ''}`}
        aria-label={item.status}
      >
        {statusIcon}
      </span>
    </div>
  );
}

function getStatusIcon(status: UploadItem['status']): string {
  switch (status) {
    case 'pending':
    case 'uploading':
      return '✿';
    case 'done':
      return '♡';
    case 'failed':
      return '!';
  }
}

function getMetaText(item: UploadItem): string {
  const size = formatBytes(item.file.size);
  switch (item.status) {
    case 'pending':
      return `${size} · waiting`;
    case 'uploading':
      return `${size} · sending…`;
    case 'done':
      return `${size} · sent`;
    case 'failed':
      return item.error ?? 'something went wrong';
  }
}
