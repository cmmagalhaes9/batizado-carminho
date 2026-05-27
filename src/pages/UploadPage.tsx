import { useEffect, useMemo, useState } from 'react';
import { AppHeader } from '@shared/components/AppHeader';
import { parseGuestHash } from '@features/events/services/guestLink';
import { EventBanner } from '@features/upload/components/EventBanner';
import { GuestNameCard } from '@features/upload/components/GuestNameCard';
import { DropZone } from '@features/upload/components/DropZone';
import { UploadQueueList } from '@features/upload/components/UploadQueueList';
import { SuccessBadge } from '@features/upload/components/SuccessBadge';
import { useGuestName } from '@features/upload/hooks/useGuestName';
import { useUploadQueue } from '@features/upload/hooks/useUploadQueue';
import { useToast } from '@shared/components/useToast';
import { isConfigured } from '@config/env';
import styles from './UploadPage.module.css';

export function UploadPage() {
  // Parse event info from the URL hash once on mount; track in state so we
  // can react if a guest navigates with the back/forward buttons.
  const [eventInfo, setEventInfo] = useState(() => parseGuestHash(window.location.hash));

  useEffect(() => {
    const onHashChange = () => setEventInfo(parseGuestHash(window.location.hash));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (!eventInfo) {
    return <ErrorScreen icon="🔗" title="this link looks incomplete" message="ask the host to share the QR code or full link again" />;
  }

  if (!isConfigured()) {
    return (
      <ErrorScreen
        icon="⚙️"
        title="not quite ready yet"
        message="the host needs to finish a small setup step. see README for details."
      />
    );
  }

  return <UploadFlow eventId={eventInfo.eventId} eventName={eventInfo.eventName} />;
}

function UploadFlow({ eventId, eventName }: { eventId: string; eventName: string }) {
  const { name, setName, clearName } = useGuestName();
  const { showToast } = useToast();

  // useUploadQueue requires a guestName — use empty string when missing, and gate the UI instead.
  const { items, successCount, enqueue } = useUploadQueue({
    eventId,
    guestName: name ?? '',
  });

  const handleFiles = useMemo(
    () => (files: readonly File[]) => {
      if (!name) {
        showToast('add your name first ✿');
        return;
      }
      enqueue(files);
    },
    [name, enqueue, showToast],
  );

  return (
    <div className="wrap">
      <AppHeader logoAsLink={false} />

      <main>
        <EventBanner eventName={eventName} />

        <GuestNameCard name={name} onSave={setName} onClear={clearName} />

        <section className="card">
          <h2 className="heading">
            share a memory <span className="accent">♡</span>
          </h2>
          <p className="lead" style={{ fontSize: 14, marginBottom: 18 }}>
            your photos and videos go straight to the host's album
          </p>

          <DropZone onFiles={handleFiles} disabled={!name} />

          <UploadQueueList items={items} />

          <p className={styles.help}>tip: you can pick a bunch at once ✿</p>
        </section>

        <SuccessBadge count={successCount} />
      </main>

      <footer className="app-footer">thank you for sharing ♡</footer>
    </div>
  );
}

function ErrorScreen({ icon, title, message }: { icon: string; title: string; message: string }) {
  return (
    <div className="wrap">
      <AppHeader logoAsLink={false} />
      <main>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>{icon}</div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
      </main>
    </div>
  );
}
