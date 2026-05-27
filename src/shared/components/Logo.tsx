import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

interface LogoProps {
  /** Whether the logo should link to the home page. Defaults to true. */
  readonly asLink?: boolean;
}

export function Logo({ asLink = true }: LogoProps) {
  const content = (
    <>
      <span className={styles.mark} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" />
        </svg>
      </span>
      <span className={styles.text}>little memories</span>
    </>
  );

  if (asLink) {
    return (
      <Link to="/" className={styles.logo}>
        {content}
      </Link>
    );
  }

  return <div className={styles.logo}>{content}</div>;
}
