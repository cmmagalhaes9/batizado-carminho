import styles from './SuccessBadge.module.css';

interface SuccessBadgeProps {
  readonly count: number;
}

export function SuccessBadge({ count }: SuccessBadgeProps) {
  if (count === 0) return null;

  return (
    <div className={styles.badge} role="status" aria-live="polite">
      <svg className={styles.heart} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
      </svg>
      <h3>
        {count} {count === 1 ? 'lembrança enviada' : 'lembranças enviadas'}
      </h3>
      <p>adiciona mais quando quiser — o link permanece aberto</p>
    </div>
  );
}
