import { createHmac } from "crypto";

const SECRET = () => process.env.UNSUBSCRIBE_SECRET!;

/**
 * Generate an HMAC token for a given email address.
 * Used for unsubscribe and confirmation links so we never
 * expose raw emails in URLs.
 */
export function generateToken(email: string): string {
  return createHmac("sha256", SECRET()).update(email).digest("hex");
}

/**
 * Verify that a token matches the expected email.
 */
export function verifyToken(email: string, token: string): boolean {
  const expected = generateToken(email);
  // Constant-time comparison
  if (expected.length !== token.length) return false;
  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Build a full unsubscribe URL for a subscriber.
 */
export function unsubscribeUrl(email: string): string {
  const base = process.env.BASE_URL || "https://openclawdfw.com";
  const token = generateToken(email);
  return `${base}/api/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

/**
 * Build a double opt-in confirmation URL.
 */
export function confirmUrl(email: string): string {
  const base = process.env.BASE_URL || "https://openclawdfw.com";
  const token = generateToken(email);
  return `${base}/api/confirm?email=${encodeURIComponent(email)}&token=${token}`;
}
