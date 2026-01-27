// lib/refreshHelpers/isTokenExpired.js. ✅ Simple expiration check.
export function isTokenExpired(tokenDoc) {
  if (!tokenDoc.expiresAt) return false;
  return Date.now() > new Date(tokenDoc.expiresAt).getTime();
}
