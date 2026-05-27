import styles from './EventBanner.module.css';

interface EventBannerProps {
  readonly eventName: string;
}

export function EventBanner({ eventName }: EventBannerProps) {
  return (
    <section className={styles.banner}>
      <div className={styles.decor}>partilha uma memória</div>
      <div className={styles.name}>{eventName}</div>
    </section>
  );
}
