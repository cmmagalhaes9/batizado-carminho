import { z } from 'zod';

/**
 * Environment schema.
 *
 * Validation is lenient by design: missing Cloudinary credentials should
 * trigger an in-app setup screen, NOT a startup crash. A developer who just
 * cloned the repo can `npm run dev` and see a helpful setup guide.
 *
 * Strict validation happens via `isConfigured()` at the call site that
 * actually needs Cloudinary.
 */
const envSchema = z.object({
  VITE_CLOUDINARY_CLOUD_NAME: z.string().default(''),
  VITE_CLOUDINARY_UPLOAD_PRESET: z.string().default(''),
  VITE_BASE_PATH: z.string().default('/'),
});

export type AppEnv = z.infer<typeof envSchema>;

function loadEnv(): AppEnv {
  // `import.meta.env` is Vite's typed env (VITE_-prefixed vars are exposed client-side).
  const result = envSchema.safeParse(import.meta.env);
  if (!result.success) {
    console.error('[config] Env parse failed:', result.error.issues);
    return envSchema.parse({});
  }
  return Object.freeze(result.data);
}

export const env = loadEnv();

/**
 * Whether the app has the credentials it needs to talk to Cloudinary.
 */
export const isConfigured = (): boolean =>
  env.VITE_CLOUDINARY_CLOUD_NAME.trim().length > 0 &&
  env.VITE_CLOUDINARY_UPLOAD_PRESET.trim().length > 0;
