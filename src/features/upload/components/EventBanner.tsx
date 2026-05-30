import styles from './EventBanner.module.css';

interface EventBannerProps {
  readonly eventName: string;
}

function BotanicalSprig() {
  return (
    <svg width="180" height="38" viewBox="0 0 180 38" fill="none" aria-hidden="true">
      {/* Main horizontal stem */}
      <path d="M18 19 Q55 12 90 19 Q125 26 162 19" stroke="#95a98a" strokeWidth="1" strokeLinecap="round"/>
      {/* Left branch up */}
      <path d="M42 16 Q40 8 48 10" stroke="#95a98a" strokeWidth="0.9" strokeLinecap="round"/>
      <ellipse cx="46" cy="8" rx="4" ry="6" fill="#c8d5c1" opacity="0.8" transform="rotate(-20 46 8)"/>
      {/* Left branch down */}
      <path d="M62 18 Q60 26 68 24" stroke="#95a98a" strokeWidth="0.9" strokeLinecap="round"/>
      <ellipse cx="66" cy="25" rx="3.5" ry="5.5" fill="#c8d5c1" opacity="0.7" transform="rotate(15 66 25)"/>
      {/* Center flower */}
      <circle cx="90" cy="17" r="5" fill="#f2d0d8" opacity="0.9"/>
      <circle cx="90" cy="17" r="2" fill="#b87d90" opacity="0.8"/>
      {/* Right branch up */}
      <path d="M116 16 Q118 8 110 10" stroke="#95a98a" strokeWidth="0.9" strokeLinecap="round"/>
      <ellipse cx="112" cy="8" rx="4" ry="6" fill="#c8d5c1" opacity="0.8" transform="rotate(20 112 8)"/>
      {/* Right branch down */}
      <path d="M135 19 Q137 27 129 25" stroke="#95a98a" strokeWidth="0.9" strokeLinecap="round"/>
      <ellipse cx="131" cy="26" rx="3.5" ry="5.5" fill="#c8d5c1" opacity="0.7" transform="rotate(-15 131 26)"/>
      {/* Small accent dots */}
      <circle cx="30" cy="19" r="1.5" fill="#b87d90" opacity="0.4"/>
      <circle cx="150" cy="19" r="1.5" fill="#b87d90" opacity="0.4"/>
    </svg>
  );
}

export function EventBanner({ eventName }: EventBannerProps) {
  return (
    <section className={styles.banner}>
      <div className={styles.botanical}>
        <BotanicalSprig />
      </div>
      <div className={styles.decor}>partilha uma memória</div>
      <div className={styles.name}>{eventName}</div>
      <div className={styles.date}>31 · 05 · 2026</div>
      <div className={styles.botanicalBottom}>
        <BotanicalSprig />
      </div>
    </section>
  );
}
