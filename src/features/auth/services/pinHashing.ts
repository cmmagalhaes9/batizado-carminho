/**
 * PIN hashing.
 *
 * Threat model: a casual family member who might open DevTools or paste the URL
 * around — NOT a determined attacker. We don't claim cryptographic strength here.
 *
 * The hash is SHA-256 of (salt + pin). The salt is the event ID (which is already
 * present in the event record), so we don't need to store an extra field.
 * This is good enough that someone seeing the hashed value can't guess the PIN
 * back via a simple lookup, while keeping the implementation dependency-free.
 *
 * NOTE: Web Crypto's SHA-256 is fine. We are explicitly NOT pretending bcrypt-grade.
 */

const encoder = new TextEncoder();

async function sha256Hex(input: string): Promise<string> {
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hashes a PIN using the event ID as salt.
 * Returns the lowercase hex digest.
 */
export async function hashPin(pin: string, eventId: string): Promise<string> {
  if (!pin) throw new Error('PIN cannot be empty');
  return sha256Hex(`${eventId}::${pin}`);
}

/**
 * Verifies that a candidate PIN matches the stored hash.
 * Constant-time comparison would be ideal, but at SHA-256 hex length the
 * difference doesn't matter for this threat model.
 */
export async function verifyPin(
  candidate: string,
  eventId: string,
  expectedHash: string,
): Promise<boolean> {
  if (!candidate) return false;
  const candidateHash = await hashPin(candidate, eventId);
  return candidateHash === expectedHash;
}
