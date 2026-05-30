import { z } from 'zod';

/**
 * Zod schemas for Cloudinary's REST responses.
 *
 * We validate at the I/O boundary so the rest of the app can trust its types.
 * If Cloudinary changes a field name, validation fails loudly here rather
 * than producing `undefined` somewhere deep in the UI.
 */

export const cloudinaryUploadResponseSchema = z.object({
  public_id: z.string(),
  format: z.string(),
  resource_type: z.enum(['image', 'video', 'raw', 'auto']),
  bytes: z.number(),
  created_at: z.string(),
  url: z.string().url(),
  secure_url: z.string().url(),
  tags: z.array(z.string()).optional(),
  context: z.record(z.unknown()).optional(),
});

export type CloudinaryUploadResponse = z.infer<typeof cloudinaryUploadResponseSchema>;

/**
 * Schema for the "list by tag" endpoint (used to fetch all media for an event).
 * Endpoint shape: GET /v1_1/{cloud_name}/{resource_type}/list/{tag}.json
 */
const cloudinaryListResourceSchema = z.object({
  public_id: z.string(),
  format: z.string(),
  bytes: z.number().optional(),
  created_at: z.string(),
  context: z
    .object({
      custom: z.record(z.string()).optional(),
    })
    .optional(),
});

export const cloudinaryListResponseSchema = z.object({
  resources: z.array(cloudinaryListResourceSchema),
});

export type CloudinaryListResource = z.infer<typeof cloudinaryListResourceSchema>;
