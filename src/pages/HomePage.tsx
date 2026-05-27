import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@shared/components/AppHeader';
import { Button } from '@shared/components/Button';
import { SetupNotice } from '@shared/components/SetupNotice';
import { useToast } from '@shared/components/useToast';
import { useEvents } from '@features/events/hooks/useEvents';
import { setCurrentEvent } from '@features/events/services/eventRepository';
import { isConfigured } from '@config/env';
import { formatTimeAgo } from '@shared/utils/format';
import styles from './HomePage.module.css';

export function HomePage() {
  const navigate = useNavigate();
  const { events, create } = useEvents();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);

  const configured = isConfigured();

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('give your event a name first ✿');
      return;
    }
    if (pin.trim().length < 4) {
      showToast('pick a PIN of at least 4 digits');
      return;
    }
    setBusy(true);
    try {
      await create(name.trim(), pin.trim());
      navigate('/host');
    } finally {
      setBusy(false);
    }
  };

  const handleOpenEvent = (id: string) => {
    setCurrentEvent(id);
    navigate('/host');
  };

  return (
    <div className="wrap">
      <AppHeader />

      <main>
        {!configured && <SetupNotice />}

        <section className={styles.hero}>
          <span className={styles.tag}>✿ for a day to remember</span>
          <h1 className="display">
            one album,
            <br />
            <span className="script">every smile</span>
          </h1>
          <p className="lead">
            A gentle, shared album where every guest can drop their photos and videos — no app, no
            fuss. Just memories.
          </p>
        </section>

        <form className="card" onSubmit={handleCreate}>
          <h2 className="heading">
            create your album <span className="accent">↓</span>
          </h2>
          <p className="lead" style={{ fontSize: 14, marginBottom: 16 }}>
            give your little event a name
          </p>

          <label htmlFor="event-name">what's the occasion?</label>
          <input
            id="event-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Lua's first birthday 🎂"
            maxLength={60}
            autoComplete="off"
          />

          <label htmlFor="event-pin">
            host PIN <span className={styles.hint}>(so only you can open the dashboard)</span>
          </label>
          <input
            id="event-pin"
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="4+ digits"
            maxLength={20}
            autoComplete="new-password"
          />

          <Button type="submit" variant="pink" disabled={busy}>
            {busy ? 'creating…' : 'start the album →'}
          </Button>
        </form>

        {events.length > 0 && (
          <>
            <div className="divider">your albums</div>
            <div>
              {events.slice(0, 5).map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  className={styles.recentItem}
                  onClick={() => handleOpenEvent(ev.id)}
                >
                  <div>
                    <div className={styles.recentName}>{ev.name}</div>
                    <div className={styles.recentMeta}>opened {formatTimeAgo(ev.createdAt)}</div>
                  </div>
                  <span className={styles.arrow} aria-hidden="true">
                    →
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        <div className={styles.steps}>
          <Step num={1} title="name your event" subtitle="pick a PIN to protect the dashboard" accent="pink" />
          <Step
            num={2}
            title="share a little QR code"
            subtitle="guests scan with their phone — no app"
            accent="butter"
          />
          <Step
            num={3}
            title="watch memories arrive"
            subtitle="browse or play as a slideshow"
            accent="sage"
          />
        </div>
      </main>

      <footer className="app-footer">made with love · for the little ones</footer>
    </div>
  );
}

function Step({
  num,
  title,
  subtitle,
  accent,
}: {
  num: number;
  title: string;
  subtitle: string;
  accent: 'pink' | 'butter' | 'sage';
}) {
  return (
    <div className={styles.step}>
      <div className={`${styles.stepNum} ${styles[`accent_${accent}`]}`}>{num}</div>
      <div className={styles.stepText}>
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </div>
  );
}
