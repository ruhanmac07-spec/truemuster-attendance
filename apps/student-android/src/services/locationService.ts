import { Geolocation, Position } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export const CLASSROOM_ANCHOR = {
  roomNumber: 'Computing Lab 302',
  latitude: 19.0760,
  longitude: 72.8777,
  radiusMetres: 100, // Strict 100-metre attendance policy
  maxAccuracyMetres: 50, // GPS horizontal accuracy must be <= 50m
  maxFixAgeSeconds: 15, // Freshness: fix must be <= 15 seconds old
};

export type LocationCheckStatus = 
  | 'checking'
  | 'passed'
  | 'permission_denied'
  | 'gps_disabled'
  | 'accuracy_too_low'
  | 'stale_fix'
  | 'outside_geofence'
  | 'error';

export interface LocationVerificationResult {
  status: LocationCheckStatus;
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  distanceMetres: number | null;
  fixAgeSeconds: number | null;
  errorMessage?: string;
  uiMessage: string;
}

/**
 * Calculates Haversine distance between two coordinates in metres.
 */
export function calculateHaversineMetres(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Acquires a fresh GPS fix and validates strict institutional geofence rules.
 */
export async function acquireAndVerifyAttendanceLocation(): Promise<LocationVerificationResult> {
  try {
    // 1. Check and request permission
    if (Capacitor.isNativePlatform()) {
      const perm = await Geolocation.checkPermissions();
      if (perm.location !== 'granted') {
        const req = await Geolocation.requestPermissions();
        if (req.location !== 'granted') {
          return {
            status: 'permission_denied',
            latitude: null,
            longitude: null,
            accuracy: null,
            distanceMetres: null,
            fixAgeSeconds: null,
            uiMessage: 'Location permission required to verify physical presence in Lab 302.',
          };
        }
      }
    }

    // 2. Acquire fresh high-accuracy position fix
    let position: Position;
    try {
      position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Demand immediate fresh fix, no stale cached coords
      });
    } catch (posErr: any) {
      return {
        status: 'gps_disabled',
        latitude: null,
        longitude: null,
        accuracy: null,
        distanceMetres: null,
        fixAgeSeconds: null,
        uiMessage: 'GPS / Location services disabled or unavailable. Please enable device location.',
      };
    }

    const { latitude, longitude, accuracy } = position.coords;
    const fixTimestamp = position.timestamp;
    const now = Date.now();
    const fixAgeSeconds = Math.max(0, Math.round((now - fixTimestamp) / 1000));

    // 3. Freshness Check: Fix must be no older than 15 seconds
    if (fixAgeSeconds > CLASSROOM_ANCHOR.maxFixAgeSeconds) {
      return {
        status: 'stale_fix',
        latitude,
        longitude,
        accuracy,
        distanceMetres: null,
        fixAgeSeconds,
        uiMessage: `GPS fix is stale (${fixAgeSeconds}s old > 15s limit). Retrying fresh satellite lock...`,
      };
    }

    // 4. Horizontal Accuracy Check: Must be <= 50 metres
    if (accuracy > CLASSROOM_ANCHOR.maxAccuracyMetres) {
      return {
        status: 'accuracy_too_low',
        latitude,
        longitude,
        accuracy,
        distanceMetres: null,
        fixAgeSeconds,
        uiMessage: `GPS accuracy too imprecise (±${Math.round(accuracy)}m > 50m limit). Move closer to window or clear sky.`,
      };
    }

    // 5. Geofence Distance Calculation
    const distanceMetres = calculateHaversineMetres(
      latitude,
      longitude,
      CLASSROOM_ANCHOR.latitude,
      CLASSROOM_ANCHOR.longitude
    );

    // 6. Geofence Radius Enforcement: Must be <= 100 metres
    if (distanceMetres > CLASSROOM_ANCHOR.radiusMetres) {
      return {
        status: 'outside_geofence',
        latitude,
        longitude,
        accuracy,
        distanceMetres,
        fixAgeSeconds,
        uiMessage: `Outside classroom geofence (${distanceMetres}m away > 100m limit from Computing Lab 302).`,
      };
    }

    // 7. Verified Pass
    return {
      status: 'passed',
      latitude,
      longitude,
      accuracy,
      distanceMetres,
      fixAgeSeconds,
      uiMessage: `✓ Geofence verified: ${distanceMetres}m from Lab 302 (Accuracy: ±${Math.round(accuracy)}m).`,
    };
  } catch (err: any) {
    return {
      status: 'error',
      latitude: null,
      longitude: null,
      accuracy: null,
      distanceMetres: null,
      fixAgeSeconds: null,
      errorMessage: err.message,
      uiMessage: 'Error acquiring location: ' + (err.message || 'Check location settings'),
    };
  }
}
