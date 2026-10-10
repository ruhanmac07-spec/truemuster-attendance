/**
 * TRUEMUSTER — Attendance API Client Interface & Store-Backed Implementation
 * Provides unified access whether running against Supabase or offline/local store.
 */

import {
  AttendanceSession,
  QRChallenge,
  CheckInAttempt,
  AttendanceRecord,
  VerificationEvidencePayload,
  CheckInResult,
  ManualAdjustmentRequest,
  TrueMusterStore,
  calculateDistanceMetres,
  isQRChallengeValid,
  isAttemptWithinDeadline
} from './index';

export interface IAttendanceApiClient {
  getSession(sessionId?: string): Promise<AttendanceSession>;
  issueQRChallenge(sessionId: string): Promise<QRChallenge>;
  startCheckIn(sessionId: string, challengeToken: string, studentId: string): Promise<CheckInAttempt>;
  submitVerification(evidence: VerificationEvidencePayload): Promise<CheckInResult>;
  adjustRecord(request: ManualAdjustmentRequest, actorId: string): Promise<AttendanceRecord>;
  getRecords(sessionId: string): Promise<AttendanceRecord[]>;
}

export class TrueMusterApiClient implements IAttendanceApiClient {
  private inMemoryAttempts: Map<string, CheckInAttempt> = new Map();

  async getSession(sessionId?: string): Promise<AttendanceSession> {
    return TrueMusterStore.getSession();
  }

  async issueQRChallenge(sessionId: string): Promise<QRChallenge> {
    return TrueMusterStore.issueNewChallenge(sessionId);
  }

  async startCheckIn(sessionId: string, challengeToken: string, studentId: string): Promise<CheckInAttempt> {
    const activeChallenge = TrueMusterStore.getActiveChallenge();
    const now = Date.now();

    if (!activeChallenge || activeChallenge.token !== challengeToken) {
      throw new Error('QR_REJECTED: Invalid or expired QR challenge');
    }

    if (!isQRChallengeValid(activeChallenge.issuedAt, activeChallenge.expiresAt, now)) {
      throw new Error('QR_REJECTED: Challenge expired server validity window (90s)');
    }

    const startedAt = new Date(now).toISOString();
    const deadlineAt = new Date(now + 45 * 1000).toISOString(); // Strict 45s attempt deadline

    const attempt: CheckInAttempt = {
      id: 'att-' + Math.random().toString(36).substring(2, 9),
      sessionId,
      studentId,
      challengeId: activeChallenge.id,
      status: 'attempt_accepted',
      startedAt,
      deadlineAt,
    };

    this.inMemoryAttempts.set(attempt.id, attempt);
    return attempt;
  }

  async submitVerification(evidence: VerificationEvidencePayload): Promise<CheckInResult> {
    const attempt = this.inMemoryAttempts.get(evidence.attemptId);
    const now = Date.now();

    if (!attempt) {
      return {
        success: false,
        status: 'rejected',
        message: 'Check-in attempt not found or already processed.',
      };
    }

    // 1. Verify 45-second deadline
    if (!isAttemptWithinDeadline(attempt.startedAt, attempt.deadlineAt, now)) {
      attempt.status = 'expired';
      return {
        success: false,
        status: 'expired',
        message: 'Check-in attempt expired. Verification exceeded 45-second deadline.',
      };
    }

    // 2. Verify Geofence (100m policy)
    // Classroom anchor: Lab 302 (19.0760, 72.8777)
    const anchorLat = 19.0760;
    const anchorLng = 72.8777;
    const distance = calculateDistanceMetres(anchorLat, anchorLng, evidence.latitude, evidence.longitude);

    if (distance > 100) {
      attempt.status = 'location_failed';
      return {
        success: false,
        status: 'out_of_bounds',
        message: `Location check failed: Distance (${Math.round(distance)}m) exceeds 100m classroom boundary.`,
      };
    }

    // 3. Verify Biometric / OS Auth
    if (!evidence.biometricSuccess) {
      attempt.status = 'auth_failed';
      return {
        success: false,
        status: 'auth_failed',
        message: 'Device biometric authentication was cancelled or failed.',
      };
    }

    // 4. Commit Attendance Atomically
    const session = TrueMusterStore.getSession();
    const record: AttendanceRecord = {
      id: 'rec-' + Math.random().toString(36).substring(2, 9),
      sessionId: session.id,
      studentId: evidence.studentId,
      studentName: 'Alice Sharma',
      enrollmentId: '2023-CS-042',
      courseCode: session.courseCode,
      courseName: session.courseName,
      sessionDate: new Date().toISOString().split('T')[0],
      status: 'present',
      verificationMethod: 'qr_biometric_geofence',
      verifiedAt: new Date(now).toISOString(),
    };

    TrueMusterStore.markAttendance(record);
    attempt.status = 'confirmed';
    attempt.committedAt = record.verifiedAt;

    return {
      success: true,
      status: 'confirmed',
      message: 'Attendance verified and committed to authoritative ledger.',
      attendanceRecord: record,
    };
  }

  async adjustRecord(request: ManualAdjustmentRequest, actorId: string): Promise<AttendanceRecord> {
    const records = TrueMusterStore.getRecords(request.sessionId);
    const existing = records.find(r => r.id === request.recordId || r.studentId === request.studentId);
    if (!existing) {
      throw new Error('Record not found');
    }

    existing.status = request.newStatus;
    existing.overrideReason = `${request.reasonCategory}: ${request.reasonText}`;
    existing.overrideBy = actorId;
    existing.verificationMethod = 'teacher_manual_override';

    TrueMusterStore.saveRecords(request.sessionId, records);
    return existing;
  }

  async getRecords(sessionId: string): Promise<AttendanceRecord[]> {
    return TrueMusterStore.getRecords(sessionId);
  }
}
