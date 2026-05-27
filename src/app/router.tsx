import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { env } from '@config/env';
import { HostRoute } from '@features/auth/components/HostRoute';
import { HomePage } from '@pages/HomePage';
import { HostPage } from '@pages/HostPage';
import { UploadPage } from '@pages/UploadPage';
import { GalleryPage } from '@pages/GalleryPage';
import { SlideshowPage } from '@pages/SlideshowPage';

/**
 * Route table.
 *
 * Public routes: `/` (home) and `/upload` (guest upload — the only route guests need).
 * Protected routes: `/host`, `/gallery`, `/slideshow` — gated by HostRoute,
 * which requires the device to have proven knowledge of the event PIN.
 */
const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/upload', element: <UploadPage /> },
  {
    path: '/host',
    element: (
      <HostRoute>
        <HostPage />
      </HostRoute>
    ),
  },
  {
    path: '/gallery',
    element: (
      <HostRoute>
        <GalleryPage />
      </HostRoute>
    ),
  },
  {
    path: '/slideshow',
    element: (
      <HostRoute>
        <SlideshowPage />
      </HostRoute>
    ),
  },
];

export const router = createBrowserRouter(routes, {
  basename: env.VITE_BASE_PATH === '/' ? undefined : env.VITE_BASE_PATH.replace(/\/$/, ''),
});
