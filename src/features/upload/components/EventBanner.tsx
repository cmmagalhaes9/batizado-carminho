import styles from './EventBanner.module.css';

interface EventBannerProps {
  readonly eventName: string;
}

/** Watercolour-style garland: soft flowers with stems and leaves along a vine */
function Garland() {
  return (
    <svg
      width="280"
      height="58"
      viewBox="0 0 280 58"
      fill="none"
      aria-hidden="true"
      style={{ filter: 'blur(0.4px)', overflow: 'visible' }}
    >
      {/* Vine */}
      <path
        d="M5 50 Q50 44 95 48 Q140 52 185 46 Q225 41 275 47"
        stroke="#bccfb4"
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      {/* — Flower 1 blush pink — */}
      <line x1="22" y1="50" x2="22" y2="33" stroke="#b8cbb0" strokeWidth="0.8" strokeLinecap="round"/>
      <circle cx="22" cy="27" r="8" fill="#f5dde4" opacity="0.7"/>
      <circle cx="22" cy="27" r="3" fill="#c4a0b4" opacity="0.85"/>
      <ellipse cx="17.5" cy="41" rx="5.5" ry="2.4" fill="#c0d0b8" opacity="0.65" transform="rotate(-38 17.5 41)"/>

      {/* — Flower 2 lavender, tallest — */}
      <line x1="65" y1="50" x2="65" y2="20" stroke="#b8cbb0" strokeWidth="0.8" strokeLinecap="round"/>
      <circle cx="65" cy="14" r="9" fill="#ddd0ec" opacity="0.68"/>
      <circle cx="65" cy="14" r="3.3" fill="#b0a0cc" opacity="0.85"/>
      <ellipse cx="60" cy="33" rx="6" ry="2.5" fill="#c0d0b8" opacity="0.62" transform="rotate(-42 60 33)"/>
      <ellipse cx="70" cy="33" rx="6" ry="2.5" fill="#c0d0b8" opacity="0.62" transform="rotate(42 70 33)"/>

      {/* — Flower 3 butter/yellow — */}
      <line x1="112" y1="50" x2="112" y2="30" stroke="#b8cbb0" strokeWidth="0.8" strokeLinecap="round"/>
      <circle cx="112" cy="24" r="7.5" fill="#f2e8c0" opacity="0.75"/>
      <circle cx="112" cy="24" r="2.8" fill="#c8b080" opacity="0.85"/>
      <ellipse cx="117" cy="41" rx="5.5" ry="2.4" fill="#c0d0b8" opacity="0.6" transform="rotate(32 117 41)"/>

      {/* — Flower 4 blush, medium — */}
      <line x1="155" y1="50" x2="155" y2="26" stroke="#b8cbb0" strokeWidth="0.8" strokeLinecap="round"/>
      <circle cx="155" cy="20" r="8" fill="#f5dde4" opacity="0.68"/>
      <circle cx="155" cy="20" r="3" fill="#c4a0b4" opacity="0.82"/>
      <ellipse cx="151" cy="36" rx="5.5" ry="2.4" fill="#c0d0b8" opacity="0.6" transform="rotate(-35 151 36)"/>
      <ellipse cx="160" cy="37" rx="5" ry="2.2" fill="#c0d0b8" opacity="0.6" transform="rotate(38 160 37)"/>

      {/* — Flower 5 lavender, tall — */}
      <line x1="205" y1="50" x2="205" y2="18" stroke="#b8cbb0" strokeWidth="0.8" strokeLinecap="round"/>
      <circle cx="205" cy="12" r="8.5" fill="#ddd0ec" opacity="0.68"/>
      <circle cx="205" cy="12" r="3.2" fill="#b0a0cc" opacity="0.85"/>
      <ellipse cx="200" cy="30" rx="6" ry="2.5" fill="#c0d0b8" opacity="0.62" transform="rotate(-40 200 30)"/>
      <ellipse cx="211" cy="31" rx="5.5" ry="2.3" fill="#c0d0b8" opacity="0.6" transform="rotate(38 211 31)"/>

      {/* — Flower 6 blush bud, small right — */}
      <line x1="252" y1="50" x2="252" y2="34" stroke="#b8cbb0" strokeWidth="0.8" strokeLinecap="round"/>
      <circle cx="252" cy="28" r="6.5" fill="#f5dde4" opacity="0.7"/>
      <circle cx="252" cy="28" r="2.5" fill="#c4a0b4" opacity="0.82"/>
      <ellipse cx="248" cy="42" rx="5" ry="2.3" fill="#c0d0b8" opacity="0.6" transform="rotate(-32 248 42)"/>

      {/* Tiny accent dots along vine */}
      <circle cx="42" cy="48" r="1.4" fill="#c4a0b4" opacity="0.4"/>
      <circle cx="87" cy="50" r="1.2" fill="#b0a0cc" opacity="0.4"/>
      <circle cx="133" cy="49" r="1.4" fill="#c8b080" opacity="0.4"/>
      <circle cx="180" cy="47" r="1.2" fill="#c4a0b4" opacity="0.4"/>
      <circle cx="230" cy="46" r="1.4" fill="#b0a0cc" opacity="0.38"/>
      <circle cx="268" cy="48" r="1.2" fill="#c4a0b4" opacity="0.38"/>
    </svg>
  );
}

export function EventBanner({ eventName }: EventBannerProps) {
  return (
    <section className={styles.banner}>
      <div className={styles.garland}>
        <Garland />
      </div>
      <div className={styles.decor}>partilha uma memória</div>
      <div className={styles.name}>{eventName}</div>
      <div className={styles.date}>31 · 05 · 2026</div>
      <div className={styles.garlandBottom}>
        <Garland />
      </div>
    </section>
  );
}
