import { createContext, useContext } from 'react';

export interface ToastContextValue {
  showToast: (message: string) => void;
}

/**
 * Toast context. Exported as a separate file from the provider so React Fast Refresh
 * works correctly (only-export-components rule).
 */
export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
