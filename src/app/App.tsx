import { RouterProvider } from 'react-router-dom';
import { ToastProvider } from '@shared/components/ToastProvider';
import { router } from './router';

/**
 * App-level providers wrap the router.
 * Order matters: ToastProvider must be OUTSIDE the router so toasts
 * survive navigation.
 */
export function App() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}
