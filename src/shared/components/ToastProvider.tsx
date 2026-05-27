import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ToastContext } from './useToast';
import styles from './ToastProvider.module.css';

interface ToastState {
  readonly id: number;
  readonly message: string;
}

/**
 * Provides a single global toast. Components call `useToast().showToast(msg)`.
 * Auto-dismisses after 2.4s. Newer toasts replace older ones (no queue).
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message });
  }, []);

  useEffect(() => {
    if (toast === null) return;
    const handle = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(handle);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={styles.toast} key={toast.id} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}
