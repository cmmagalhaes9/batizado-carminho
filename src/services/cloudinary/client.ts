import { env } from '@config/env';
import {
  cloudinaryListResponseSchema,
  cloudinaryUploadResponseSchema,
  type CloudinaryListResource,
  type CloudinaryUploadResponse,
} from './types';

/**
 * Low-level HTTP client for Cloudinary.
 *
 * Responsibilities:
 *  - Build correct URLs from cloud name + resource type
 *  - Parse and validate responses with Zod
 *  - Surface progress events on upload (XHR — fetch doesn't support upload progress)
 *
 * Does NOT know about domain concepts (events, guests). That's the
 * repository's job. This client could be swapped for a mock or different
 * provider without touching the rest of the app.
 */

const API_BASE = 'https://api.cloudinary.com/v1_1';
const RES_BASE = 'https://res.cloudinary.com';

export class CloudinaryError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'CloudinaryError';
  }
}

export interface UploadOptions {
  file: File;
  /** Cloudinary tag — we use the event ID. */
  tag: string;
  /** Optional metadata stored as Cloudinary context (e.g. guest=Sara). */
  context?: Record<string, string>;
  /** Progress callback, 0-100. */
  onProgress?: (percent: number) => void;
  /** AbortController.signal for cancellation. */
  signal?: AbortSignal;
}

/**
 * Uploads a single file to Cloudinary using the configured unsigned preset.
 * Resolves with the validated upload response, or rejects with CloudinaryError.
 */
export function uploadFile(opts: UploadOptions): Promise<CloudinaryUploadResponse> {
  const { file, tag, context, onProgress, signal } = opts;
  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  const endpoint = `${API_BASE}/${env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`;

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', env.VITE_CLOUDINARY_UPLOAD_PRESET);
  form.append('tags', tag);
  if (context) {
    const contextStr = Object.entries(context)
      // Cloudinary's context format: key1=value1|key2=value2.
      // Sanitize separators to avoid corrupting the format.
      .map(([k, v]) => `${k}=${v.replace(/[|=]/g, '')}`)
      .join('|');
    form.append('context', contextStr);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', endpoint);

    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
    }

    if (signal) {
      const abort = () => xhr.abort();
      signal.addEventListener('abort', abort, { once: true });
      // Cleanup: when xhr completes either way, stop listening.
      const cleanup = () => signal.removeEventListener('abort', abort);
      xhr.addEventListener('loadend', cleanup, { once: true });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json: unknown = JSON.parse(xhr.responseText);
          resolve(cloudinaryUploadResponseSchema.parse(json));
        } catch (err) {
          reject(new CloudinaryError(`Invalid response: ${(err as Error).message}`));
        }
      } else {
        let msg = `Upload failed (${xhr.status})`;
        try {
          const parsed: unknown = JSON.parse(xhr.responseText);
          if (
            typeof parsed === 'object' &&
            parsed !== null &&
            'error' in parsed &&
            typeof (parsed as { error: unknown }).error === 'object'
          ) {
            const errObj = (parsed as { error: { message?: string } }).error;
            if (errObj?.message) msg = errObj.message;
          }
        } catch {
          /* keep default message */
        }
        reject(new CloudinaryError(msg, xhr.status));
      }
    });

    xhr.addEventListener('error', () => reject(new CloudinaryError('Network error')));
    xhr.addEventListener('abort', () => reject(new CloudinaryError('Upload cancelled')));

    xhr.send(form);
  });
}

/**
 * Lists resources tagged with `tag` for a specific resource type.
 * Cloudinary's list-by-tag endpoint requires the resource_list restriction
 * to be DISABLED in the Cloudinary dashboard's Security settings.
 */
export async function listByTag(
  tag: string,
  resourceType: 'image' | 'video',
  signal?: AbortSignal,
): Promise<CloudinaryListResource[]> {
  const url = `${RES_BASE}/${env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/list/${encodeURIComponent(tag)}.json`;
  const response = await fetch(url, { cache: 'no-store', signal });

  if (response.status === 404) {
    // No resources tagged yet — treat as empty list, not an error.
    return [];
  }
  if (!response.ok) {
    throw new CloudinaryError(`List failed: ${response.statusText}`, response.status);
  }

  const json: unknown = await response.json();
  const parsed = cloudinaryListResponseSchema.parse(json);
  return parsed.resources;
}

/**
 * Builds a transformed delivery URL.
 * Cloudinary transformations go between `/upload/` and the public_id.
 */
export function buildDeliveryUrl(
  publicId: string,
  format: string,
  resourceType: 'image' | 'video',
  transformations: string[] = [],
): string {
  const transform = transformations.length > 0 ? `${transformations.join(',')}/` : '';
  // For video thumbnails we don't append format the same way — caller handles that.
  return `${RES_BASE}/${env.VITE_CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/${transform}${publicId}.${format}`;
}
