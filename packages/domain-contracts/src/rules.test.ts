import { describe, it, expect } from 'vitest';

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

describe('TRUEMUSTER Core Attendance Domain Rules', () => {
  it('validates that QR challenges have exactly 90 seconds of validity', () => {
    const base = 1000000;
    const issuedAt = new Date(base).toISOString();
    const expiresAt = new Date(base + 90 * 1000).toISOString();

    expect(isQRChallengeValid(issuedAt, expiresAt, base + 45 * 1000)).toBe(true);
    expect(isQRChallengeValid(issuedAt, expiresAt, base + 89 * 1000)).toBe(true);
    expect(isQRChallengeValid(issuedAt, expiresAt, base + 91 * 1000)).toBe(false); // Expired
  });

  it('rejects challenges with altered validity windows', () => {
    const base = 1000000;
    const issuedAt = new Date(base).toISOString();
    const forgedExpiresAt = new Date(base + 120 * 1000).toISOString(); // 120s not allowed
    expect(isQRChallengeValid(issuedAt, forgedExpiresAt, base + 10 * 1000)).toBe(false);
  });

  it('validates that check-in attempts have strictly 45 seconds to commit', () => {
    const base = 2000000;
    const startedAt = new Date(base).toISOString();
    const deadlineAt = new Date(base + 45 * 1000).toISOString();

    expect(isAttemptWithinDeadline(startedAt, deadlineAt, base + 20 * 1000)).toBe(true);
    expect(isAttemptWithinDeadline(startedAt, deadlineAt, base + 44 * 1000)).toBe(true);
    expect(isAttemptWithinDeadline(startedAt, deadlineAt, base + 46 * 1000)).toBe(false); // Expired deadline
  });

  it('correctly validates classroom geofence within 100-metre policy', () => {
    // Room 302 anchor coordinates
    const anchorLat = 19.0760;
    const anchorLng = 72.8777;

    // Student 25 metres away inside room
    const insideLat = 19.0762;
    const insideLng = 72.8777;
    const distInside = calculateDistanceMetres(anchorLat, anchorLng, insideLat, insideLng);
    expect(distInside).toBeLessThanOrEqual(100);

    // Student 350 metres away off-campus
    const outsideLat = 19.0790;
    const outsideLng = 72.8777;
    const distOutside = calculateDistanceMetres(anchorLat, anchorLng, outsideLat, outsideLng);
    expect(distOutside).toBeGreaterThan(100);
  });
});
