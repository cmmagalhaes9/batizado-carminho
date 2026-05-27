import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { env } from '@config/env';
import { UploadPage } from '@pages/UploadPage';
import { GalleryPage } from '@pages/GalleryPage';
import { SlideshowPage } from '@pages/SlideshowPage';

const routes: RouteObject[] = [
  { path: '/', element: <UploadPage /> },
  { path: '/upload', element: <UploadPage /> },
  { path: '/gallery', element: <GalleryPage /> },
  { path: '/slideshow', element: <SlideshowPage /> },
];

export const router = createBrowserRouter(routes, {
  basename: env.VITE_BASE_PATH === '/' ? undefined : env.VITE_BASE_PATH.replace(/\/$/, ''),
});
