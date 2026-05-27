import { useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { AppHeader } from '@shared/components/AppHeader';
import { Button } from '@shared/components/Button';
import { useToast } from '@shared/components/useToast';
import { useEventMedia } from '@features/events/hooks/useEventMedia';
import { getCurrentEvent } from '@features/events/services/eventRepository';
import { buildGuestUrl } from '@features/events/services/guestLink';
import { QRCodeCanvas } from '@features/events/components/QRCodeCanvas';
import { useAuth } from '@features/auth/hooks/useAuth';
import styles from './HostPage.module.css';

export function HostPage() {
  const event = getCurrentEvent();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { lock } = useAuth(event);

  // useEventMedia needs to be called unconditionally before any early return.
  const { media } = useEventMedia({ eventId: event?.id ?? null });

  const stats = useMemo(() => {
    const photos = media.filter((m) => m.kind === 'image').length;
    const videos = media.filter((m) => m.kind === 'video').length;
    const guests = new Set(media.map((m) => m.guestName).filter((g): g is string => g !== null));
    return { photos, videos, guests: guests.size };
  }, [media]);

  if (!event) {
    return <Navigate to="/" replace />;
  }

  const guestLink = buildGuestUrl(event.id, event.name);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(guestLink);
      showToast('link copied ♡');
    } catch {
      showToast('could not copy');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: `share photos from ${event.name}`,
          url: guestLink,
        });
      } catch {
        // user cancelled — that's fine
      }
    } else {
      void handleCopy();
    }
  };

  return (
    <div className="wrap">
      <AppHeader
        action={
          <Link to="/" className={styles.linkBtn}>
            all albums
          </Link>
        }
      />

      <main>
        <section className={styles.eventCard}>
          <div className={styles.eventLabel}>your album</div>
          <div className={styles.eventName}>{event.name}</div>
          <div className={styles.stats}>
            <Stat num={stats.photos} label="photos" />
            <Stat num={stats.videos} label="videos" />
            <Stat num={stats.guests} label="guests" />
          </div>
        </section>

        <section className={styles.qrCard}>
          <span className="eyebrow">share with guests</span>
          <h2 className="heading" style={{ marginTop: 8 }}>
            scan or tap to upload
          </h2>
          <div className={styles.qrFrame}>
            <QRCodeCanvas value={guestLink} />
          </div>
          <button
            type="button"
            className={styles.shareLink}
            onClick={handleCopy}
            title="tap to copy"
          >
            {guestLink}
          </button>
          <div className={styles.qrActions}>
            <Button onClick={handleCopy}>📋 copy link</Button>
            <Button variant="ghost" onClick={handleShare}>
              ↗ share
            </Button>
          </div>
        </section>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionTile}
            onClick={() => navigate('/gallery')}
          >
            <div className={styles.actionIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className={styles.actionLabel}>gallery</div>
            <div className={styles.actionSub}>browse all memories</div>
          </button>
          <button
            type="button"
            className={`${styles.actionTile} ${styles.actionTileDark}`}
            onClick={() => navigate('/slideshow')}
          >
            <div className={styles.actionIconWrap}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div className={styles.actionLabel}>slideshow</div>
            <div className={styles.actionSub}>play on a big screen</div>
          </button>
        </div>
      </main>

      <footer className="app-footer">
        <button
          type="button"
          className={styles.lockBtn}
          onClick={() => {
            lock();
            showToast('locked ✿ enter PIN to unlock');
          }}
        >
          ⏏ lock this device
        </button>
        <div style={{ marginTop: 8 }}>your event lives in this browser ♡</div>
      </footer>
    </div>
  );
}

function Stat({ num, label }: { num: number; label: string }) {
  return (
    <div className={styles.stat}>
      <div className={styles.statNum}>{num}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  );
}
