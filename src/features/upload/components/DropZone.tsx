import { useCallback, useId, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import styles from './DropZone.module.css';

interface DropZoneProps {
  readonly onFiles: (files: readonly File[]) => void;
  readonly disabled?: boolean;
}

/**
 * Handles three input methods:
 *  - Tap/click to open camera roll picker (multiple files)
 *  - Drag-and-drop on desktop
 *  - "Take a photo now" button (camera capture)
 *
 * Uses <label htmlFor> instead of a transparent input overlay so that iOS Safari
 * activates the file picker via the browser's native label→input path rather than
 * a programmatic .click() call. Programmatic .click() causes a double-trigger on
 * iOS: the input fires once from the touch, once from the label's onClick, and
 * Safari cancels the picker.
 */
export function DropZone({ onFiles, disabled = false }: DropZoneProps) {
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const uid = useId();
  const galleryId = `${uid}-gallery`;
  const cameraId = `${uid}-camera`;

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFiles(Array.from(files));
        e.target.value = '';
      }
    },
    [onFiles],
  );

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFiles(Array.from(files));
    }
  };

  return (
    <>
      {/* Inputs live off-screen so the label click activates them without a
          transparent overlay — the overlay pattern causes double-triggers on iOS. */}
      <input
        ref={galleryInputRef}
        id={galleryId}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
        disabled={disabled}
        className={styles.offscreenInput}
      />
      <input
        ref={cameraInputRef}
        id={cameraId}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        disabled={disabled}
        className={styles.offscreenInput}
      />

      <label
        htmlFor={galleryId}
        className={`${styles.dropZone} ${isDragging ? styles.over : ''} ${disabled ? styles.dropZoneDisabled : ''}`}
        onDragEnter={disabled ? undefined : handleDragEnter}
        onDragLeave={disabled ? undefined : handleDragLeave}
        onDragOver={disabled ? undefined : handleDragOver}
        onDrop={disabled ? undefined : handleDrop}
        aria-disabled={disabled}
      >
        <div className={styles.iconWrap} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="9" cy="9" r="2" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div className={styles.title}>escolhe da galeria</div>
        <div className={styles.hint}>{disabled ? 'adiciona o teu nome primeiro' : 'fotos · vídeos'}</div>
      </label>

      <label
        htmlFor={cameraId}
        className={`${styles.cameraBtn} ${disabled ? styles.cameraBtnDisabled : ''}`}
        aria-disabled={disabled}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
        tira uma foto agora
      </label>
    </>
  );
}
