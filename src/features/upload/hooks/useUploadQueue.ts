import { useCallback, useRef, useState } from 'react';
import { uploadMedia } from '@services/cloudinary';
import { generateLocalId } from '@shared/utils/format';

export type UploadStatus = 'pending' | 'uploading' | 'done' | 'failed';

export interface UploadItem {
  readonly id: string;
  readonly file: File;
  /** Preview data URL for images, or null for videos. Generated client-side. */
  readonly previewUrl: string | null;
  readonly status: UploadStatus;
  /** 0-100 */
  readonly progress: number;
  readonly error: string | null;
}

interface UseUploadQueueOptions {
  readonly eventId: string;
  readonly guestName: string;
  readonly onSuccess?: () => void;
}

interface UseUploadQueueResult {
  readonly items: readonly UploadItem[];
  readonly successCount: number;
  readonly enqueue: (files: readonly File[]) => void;
}

/**
 * Per-file upload state, with each file uploading in parallel.
 *
 * Why a hook instead of dropping it inline:
 *  - Encapsulates the cancellation logic (AbortController per item)
 *  - Keeps the immutable-update boilerplate in one place
 *  - The UI just renders the list; logic is testable in isolation
 */
export function useUploadQueue({
  eventId,
  guestName,
  onSuccess,
}: UseUploadQueueOptions): UseUploadQueueResult {
  const [items, setItems] = useState<readonly UploadItem[]>([]);
  // AbortControllers keyed by item ID. Kept in a ref because they're not render state.
  const controllersRef = useRef<Map<string, AbortController>>(new Map());

  const updateItem = useCallback((id: string, patch: Partial<UploadItem>): void => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const startUpload = useCallback(
    async (item: UploadItem): Promise<void> => {
      const controller = new AbortController();
      controllersRef.current.set(item.id, controller);
      updateItem(item.id, { status: 'uploading' });

      try {
        await uploadMedia({
          file: item.file,
          eventId,
          guestName,
          onProgress: (percent) => updateItem(item.id, { progress: percent }),
          signal: controller.signal,
        });
        updateItem(item.id, { status: 'done', progress: 100 });
        onSuccess?.();
      } catch (err) {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : 'Upload failed';
        updateItem(item.id, { status: 'failed', error: message });
      } finally {
        controllersRef.current.delete(item.id);
      }
    },
    [eventId, guestName, onSuccess, updateItem],
  );

  const enqueue = useCallback(
    (files: readonly File[]): void => {
      const newItems: UploadItem[] = files.map((file) => ({
        id: generateLocalId(),
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        status: 'pending',
        progress: 0,
        error: null,
      }));

      setItems((prev) => [...prev, ...newItems]);

      // Kick off uploads in parallel — Cloudinary handles concurrency fine.
      newItems.forEach((item) => {
        void startUpload(item);
      });
    },
    [startUpload],
  );

  const successCount = items.filter((i) => i.status === 'done').length;

  return { items, successCount, enqueue };
}
