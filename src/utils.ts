export function extractToken(authHeader: string) {
  const match = authHeader.match(/bearer\s+(.+)/i);
  if (!match) {
    throw new Error('Invalid authorization header');
  }
  return match[1];
}