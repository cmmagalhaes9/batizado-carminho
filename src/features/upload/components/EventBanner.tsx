import styles from './EventBanner.module.css';

interface EventBannerProps {
  readonly eventName: string;
}

export function EventBanner({ eventName }: EventBannerProps) {
  return (
    <section className={styles.banner}>
      <div className={styles.decor}>you're invited to</div>
      <div className={styles.name}>{eventName}</div>
    </section>
  );
}
