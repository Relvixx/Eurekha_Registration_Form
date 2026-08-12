import { createHmac } from 'crypto';

const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'fallback-secret-for-development-only';

// Helper to sign a token
export function signToken(token: string): string {
  const hmac = createHmac('sha256', SESSION_SECRET);
  hmac.update(token);
  return hmac.digest('hex');
}

// Helper to verify a signed cookie value
export function verifySessionCookie(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  
  const parts = cookieValue.split(':');
  if (parts.length !== 2) return false;
  
  const [token, signature] = parts;
  const expectedSignature = signToken(token);
  
  return signature === expectedSignature;
}
