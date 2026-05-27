import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { UploadPage } from '@pages/UploadPage';
import { GalleryPage } from '@pages/GalleryPage';
import { SlideshowPage } from '@pages/SlideshowPage';

const routes: RouteObject[] = [
  { path: '/', element: <UploadPage /> },
  { path: '/upload', element: <UploadPage /> },
  { path: '/gallery', element: <GalleryPage /> },
  { path: '/slideshow', element: <SlideshowPage /> },
];

export const router = createBrowserRouter(routes);
