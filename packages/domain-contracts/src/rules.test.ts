import { describe, it, expect } from 'vitest';
import { TrueMusterStore, INITIAL_STUDENT, TrueMusterApiClient } from './index';
import { calculateDistanceMetres, isQRChallengeValid, isAttemptWithinDeadline } from './rules';

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

  it('manages challenge issuance with 90s validity window in TrueMusterStore', () => {
    // Mock localStorage for test environment
    const storage: Record<string, string> = {};
    global.localStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, val: string) => { storage[key] = val; },
      removeItem: (key: string) => { delete storage[key]; },
      clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
      key: (i: number) => Object.keys(storage)[i] || null,
      length: Object.keys(storage).length,
    } as any;

    const challenge = TrueMusterStore.issueNewChallenge('ses-test-101');
    expect(challenge.sessionId).toBe('ses-test-101');
    expect(challenge.token).toContain('TM-');

    const issueTime = new Date(challenge.issuedAt).getTime();
    const expiryTime = new Date(challenge.expiresAt).getTime();
    expect((expiryTime - issueTime) / 1000).toBe(90);

    const retrieved = TrueMusterStore.getActiveChallenge();
    expect(retrieved?.id).toBe(challenge.id);
  });

  it('atomically records student check-in and updates attendance count in TrueMusterStore', () => {
    const session = TrueMusterStore.getSession();
    const initialPresent = session.totalPresent;

    TrueMusterStore.markAttendance({
      id: 'rec-test-alice',
      sessionId: session.id,
      studentId: INITIAL_STUDENT.id,
      studentName: INITIAL_STUDENT.fullName,
      enrollmentId: INITIAL_STUDENT.enrollmentId,
      courseCode: session.courseCode,
      courseName: session.courseName,
      sessionDate: new Date().toISOString().split('T')[0],
      status: 'present',
      verificationMethod: 'qr_biometric_geofence',
      verifiedAt: new Date().toISOString(),
    });

    const records = TrueMusterStore.getRecords(session.id);
    const aliceRecord = records.find(r => r.studentId === INITIAL_STUDENT.id);
    expect(aliceRecord).toBeDefined();
    expect(aliceRecord?.status).toBe('present');

    const updatedSession = TrueMusterStore.getSession();
    expect(updatedSession.totalPresent).toBe(records.filter(r => r.status === 'present').length);
  });

  describe('TrueMusterApiClient End-to-End Protocol Verification', () => {
    it('successfully processes full check-in flow within policy', async () => {
      const client = new TrueMusterApiClient();
      const session = await client.getSession();
      const challenge = await client.issueQRChallenge(session.id);

      // Student scans QR and starts check-in attempt
      const attempt = await client.startCheckIn(session.id, challenge.token, INITIAL_STUDENT.id);
      expect(attempt.status).toBe('attempt_accepted');
      expect(attempt.challengeId).toBe(challenge.id);

      // Student submits evidence: inside Lab 302 (19.0761, 72.8777, ~11m), biometric passed
      const result = await client.submitVerification({
        attemptId: attempt.id,
        studentId: INITIAL_STUDENT.id,
        deviceId: 'dev-pixel7-hw-01',
        latitude: 19.0761,
        longitude: 72.8777,
        accuracyMetres: 8.5,
        gpsTimestamp: new Date().toISOString(),
        biometricSuccess: true,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe('confirmed');
      expect(result.attendanceRecord?.status).toBe('present');
    });

    it('rejects attempt if location is outside 100m geofence', async () => {
      const client = new TrueMusterApiClient();
      const session = await client.getSession();
      const challenge = await client.issueQRChallenge(session.id);

      const attempt = await client.startCheckIn(session.id, challenge.token, INITIAL_STUDENT.id);

      // Off-campus coordinates (>300m away)
      const result = await client.submitVerification({
        attemptId: attempt.id,
        studentId: INITIAL_STUDENT.id,
        deviceId: 'dev-pixel7-hw-01',
        latitude: 19.0800,
        longitude: 72.8777,
        accuracyMetres: 12.0,
        gpsTimestamp: new Date().toISOString(),
        biometricSuccess: true,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe('out_of_bounds');
      expect(result.message).toContain('exceeds 100m classroom boundary');
    });

    it('rejects attempt if biometric authentication failed', async () => {
      const client = new TrueMusterApiClient();
      const session = await client.getSession();
      const challenge = await client.issueQRChallenge(session.id);

      const attempt = await client.startCheckIn(session.id, challenge.token, INITIAL_STUDENT.id);

      const result = await client.submitVerification({
        attemptId: attempt.id,
        studentId: INITIAL_STUDENT.id,
        deviceId: 'dev-pixel7-hw-01',
        latitude: 19.0760,
        longitude: 72.8777,
        accuracyMetres: 5.0,
        gpsTimestamp: new Date().toISOString(),
        biometricSuccess: false,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe('auth_failed');
    });

    it('allows teacher manual adjustment with mandatory reason code', async () => {
      const client = new TrueMusterApiClient();
      const session = await client.getSession();

      const adjusted = await client.adjustRecord({
        recordId: 'rec-01',
        sessionId: session.id,
        studentId: 'stu-9902-bob',
        newStatus: 'excused',
        reasonCategory: 'medical',
        reasonText: 'Presented signed medical certificate from campus clinic',
      }, 'tch-prof-rao');

      expect(adjusted.status).toBe('excused');
      expect(adjusted.overrideReason).toBe('medical: Presented signed medical certificate from campus clinic');
      expect(adjusted.verificationMethod).toBe('teacher_manual_override');
    });
  });
});


