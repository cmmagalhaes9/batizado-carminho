import { env } from '@config/env';
import type { MediaItem, MediaKind } from '@/types/domain';
import { buildDeliveryUrl, listByTag, uploadFile, type UploadOptions } from './client';
import type { CloudinaryListResource } from './types';

/**
 * Repository pattern: the rest of the app calls these domain-shaped methods
 * (`uploadMedia`, `getEventMedia`) without knowing anything about Cloudinary.
 *
 * If we ever swap storage providers, only this file changes.
 */

const RES_BASE = 'https://res.cloudinary.com';

interface UploadMediaParams {
  file: File;
  eventId: string;
  guestName: string;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

export async function uploadMedia(params: UploadMediaParams): Promise<MediaItem> {
  const { file, eventId, guestName, onProgress, signal } = params;

  const uploadOpts: UploadOptions = {
    file,
    tag: eventId,
    context: { guest: guestName },
    ...(onProgress ? { onProgress } : {}),
    ...(signal ? { signal } : {}),
  };

  const response = await uploadFile(uploadOpts);

  const kind: MediaKind = response.resource_type === 'video' ? 'video' : 'image';

  return {
    id: response.public_id,
    kind,
    fullUrl: response.secure_url,
    thumbUrl: buildThumbUrl(response.public_id, response.format, kind),
    createdAt: response.created_at,
    bytes: response.bytes,
    guestName,
  };
}

export async function getEventMedia(
  eventId: string,
  signal?: AbortSignal,
): Promise<MediaItem[]> {
  // Cloudinary requires separate calls per resource type.
  const [images, videos] = await Promise.all([
    listByTag(eventId, 'image', signal),
    listByTag(eventId, 'video', signal),
  ]);

  const items: MediaItem[] = [
    ...images.map((r) => mapResourceToMedia(r, 'image')),
    ...videos.map((r) => mapResourceToMedia(r, 'video')),
  ];

  // Newest first — slideshow reverses if it wants chronological.
  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

function mapResourceToMedia(resource: CloudinaryListResource, kind: MediaKind): MediaItem {
  const guestName = resource.context?.custom?.['guest'] ?? null;

  return {
    id: resource.public_id,
    kind,
    fullUrl: buildFullUrl(resource.public_id, resource.format, kind),
    thumbUrl: buildThumbUrl(resource.public_id, resource.format, kind),
    createdAt: resource.created_at,
    bytes: resource.bytes,
    guestName,
  };
}

function buildFullUrl(publicId: string, format: string, kind: MediaKind): string {
  if (kind === 'video') {
    return `${RES_BASE}/${env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/${publicId}.${format}`;
  }
  return buildDeliveryUrl(publicId, format, 'image', ['q_auto', 'f_auto']);
}

function buildThumbUrl(publicId: string, format: string, kind: MediaKind): string {
  if (kind === 'video') {
    // `so_0` = grab frame at second 0; output as JPG thumbnail.
    return `${RES_BASE}/${env.VITE_CLOUDINARY_CLOUD_NAME}/video/upload/c_fill,w_400,h_400,q_auto,so_0/${publicId}.jpg`;
  }
  return buildDeliveryUrl(publicId, format, 'image', ['c_fill', 'w_400', 'h_400', 'q_auto', 'f_auto']);
}
