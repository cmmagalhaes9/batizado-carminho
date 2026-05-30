import type { ReactNode } from 'react';
import { Logo } from './Logo';
import styles from './AppHeader.module.css';

interface AppHeaderProps {
  /** Optional right-aligned action (back button, etc.) */
  readonly action?: ReactNode;
  /** Whether the logo links home. Disabled on the upload page where guests don't need to navigate. */
  readonly logoAsLink?: boolean;
}

export function AppHeader({ action, logoAsLink = true }: AppHeaderProps) {
  return (
    <header className={`${styles.header} ${action ? styles.headerWithAction : ''}`}>
      <Logo asLink={logoAsLink} />
      {action && <div className={styles.action}>{action}</div>}
    </header>
  );
}
