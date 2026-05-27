import { useCallback, useRef, useState, type ChangeEvent, type DragEvent } from 'react';
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
 * The native <input type="file" capture="environment"> opens the camera directly
 * on mobile browsers — much smoother than guessing at MediaStream APIs.
 */
export function DropZone({ onFiles, disabled = false }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFiles(Array.from(files));
        // Reset so the same file can be re-selected if needed
        e.target.value = '';
      }
    },
    [onFiles],
  );

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFiles(Array.from(files));
    }
  };

  return (
    <>
      <div
        className={`${styles.dropZone} ${isDragging ? styles.over : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label="Pick photos from camera roll"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={disabled}
          className={styles.hiddenInput}
        />
        <div className={styles.iconWrap} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="9" cy="9" r="2" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div className={styles.title}>pick from your camera roll</div>
        <div className={styles.hint}>photos · videos · all welcome</div>
      </div>

      <button
        type="button"
        className={styles.cameraBtn}
        onClick={() => cameraInputRef.current?.click()}
        disabled={disabled}
      >
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className={styles.hiddenInput}
        />
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
        take a photo now
      </button>
    </>
  );
}
