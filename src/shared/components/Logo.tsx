import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

interface LogoProps {
  /** Whether the logo should link to the home page. Defaults to true. */
  readonly asLink?: boolean;
}

export function Logo({ asLink = true }: LogoProps) {
  const content = (
    <>
      <span className={styles.text}>Memórias da Carminho</span>
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
