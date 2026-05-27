import styles from './SetupNotice.module.css';

export function SetupNotice() {
  return (
    <div className={styles.notice}>
      <strong>a tiny setup step ✿</strong>
      Create a <code>.env.local</code> with your Cloudinary credentials. See the{' '}
      <a href="https://github.com" target="_blank" rel="noreferrer">
        README
      </a>{' '}
      for the 5-minute walkthrough.
    </div>
  );
}
