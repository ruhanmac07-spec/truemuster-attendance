/**
 * TRUEMUSTER — Attendance Verification Rule Utilities
 */

// Haversine distance calculator
export function calculateDistanceMetres(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const r = 6371000; // Earth radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return r * c;
}

// 90s QR challenge validity checker
export function isQRChallengeValid(issuedAt: string, expiresAt: string, now: number): boolean {
  const expiryTime = new Date(expiresAt).getTime();
  const issueTime = new Date(issuedAt).getTime();
  const validityWindow = (expiryTime - issueTime) / 1000;
  // Verify strictly 90-second validity window
  if (validityWindow !== 90) return false;
  return now <= expiryTime;
}

// 45s attempt deadline checker
export function isAttemptWithinDeadline(startedAt: string, deadlineAt: string, now: number): boolean {
  const deadlineTime = new Date(deadlineAt).getTime();
  const startTime = new Date(startedAt).getTime();
  const duration = (deadlineTime - startTime) / 1000;
  // Verify strictly 45-second deadline
  if (duration !== 45) return false;
  return now <= deadlineTime;
}
