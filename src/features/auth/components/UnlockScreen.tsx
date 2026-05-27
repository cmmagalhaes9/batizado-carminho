import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '@shared/components/AppHeader';
import { Button } from '@shared/components/Button';
import { useToast } from '@shared/components/useToast';
import styles from './UnlockScreen.module.css';

interface UnlockScreenProps {
  readonly eventName: string;
  readonly onUnlock: (pin: string) => Promise<boolean>;
}

/**
 * Shown when a device tries to access protected routes (host, gallery, slideshow)
 * without having proven knowledge of the event PIN.
 *
 * This is intentionally gentle — it could be the host on a new device, not
 * necessarily an intruder. Soft language, friendly framing.
 */
export function UnlockScreen({ eventName, onUnlock }: UnlockScreenProps) {
  const [pin, setPin] = useState('');
  const [busy, setBusy] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pin.trim()) {
      showToast('type your PIN to continue');
      return;
    }
    setBusy(true);
    const ok = await onUnlock(pin.trim());
    setBusy(false);
    if (!ok) {
      showToast('that PIN doesn\'t match');
      setPin('');
    }
  };

  return (
    <div className="wrap">
      <AppHeader />
      <main>
        <div className={styles.lockCard}>
          <div className={styles.iconWrap} aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className={styles.title}>just for the host ✿</h1>
          <p className={styles.subtitle}>
            this is the dashboard for <em>{eventName}</em>. enter the PIN to continue.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="pin-input">host PIN</label>
            <input
              id="pin-input"
              type="password"
              inputMode="numeric"
              autoComplete="off"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••"
              maxLength={20}
              autoFocus
            />
            <Button type="submit" variant="pink" disabled={busy}>
              {busy ? 'checking…' : 'unlock →'}
            </Button>
          </form>

          <p className={styles.guestHint}>
            looking for the upload page? you'll get there from the host's QR code or shared link.
          </p>
        </div>

        <p className={styles.backLink}>
          <Link to="/">← back to home</Link>
        </p>
      </main>
    </div>
  );
}
