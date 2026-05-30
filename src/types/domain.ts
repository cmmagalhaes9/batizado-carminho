/**
 * Domain types shared across features.
 *
 * Keep these focused on the *domain* (Event, Media, Guest) rather than
 * implementation details (Cloudinary's response shape — those live in
 * services/cloudinary/types.ts and get mapped to these here).
 */

export interface Event {
  /** Stable URL-safe identifier. Used as the Cloudinary tag. */
  readonly id: string;
  /** Human-readable name shown to host and guests. */
  readonly name: string;
  /** Unix ms timestamp of creation. */
  readonly createdAt: number;
  /**
   * SHA-256 hash of the host's PIN.
   * Never the plaintext — even though we live in localStorage on the host's own device,
   * hashing keeps the bar above "casual DevTools poking".
   *
   * Optional only for backwards-compatibility with pre-PIN events stored in
   * old localStorage. New events always set this.
   */
  readonly hashedPin?: string;
}

export type MediaKind = 'image' | 'video';

export interface MediaItem {
  readonly id: string;
  readonly kind: MediaKind;
  /** Full-resolution URL for lightbox / slideshow. */
  readonly fullUrl: string;
  /** Thumbnail URL for grid views (Cloudinary-transformed). */
  readonly thumbUrl: string;
  /** Original upload timestamp (ISO string). */
  readonly createdAt: string;
  /** Bytes. Absent when fetched from the list endpoint (Cloudinary omits it there). */
  readonly bytes?: number;
  /** Guest who uploaded it, if known. */
  readonly guestName: string | null;
}

export interface GuestIdentity {
  readonly name: string;
}
