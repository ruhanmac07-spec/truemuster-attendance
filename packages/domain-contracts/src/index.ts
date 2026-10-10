/**
 * TRUEMUSTER — Shared Domain Contracts & Types
 * Authoritative types across Android Student App, Windows Admin/Teacher App, and Supabase Backend.
 */

export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface StudentProfile extends UserProfile {
  role: 'student';
  enrollmentId: string;
  department: string;
  batch: string;
  activeDeviceId?: string;
  deviceBoundAt?: string;
}

export interface TeacherProfile extends UserProfile {
  role: 'teacher';
  department: string;
  employeeId: string;
}

export interface RegisteredDevice {
  id: string;
  studentId: string;
  deviceFingerprint: string;
  deviceName: string;
  osVersion: string;
  status: 'active' | 'revoked' | 'pending_transfer';
  registeredAt: string;
  revokedAt?: string;
}

export interface CourseSection {
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  department: string;
  semester: number;
}

export interface ClassroomLocation {
  id: string;
  roomNumber: string;
  building: string;
  latitude: number;
  longitude: number;
  radiusMetres: number; // Default 100m policy
}

export type SessionState = 'scheduled' | 'active' | 'closed' | 'finalized';

export interface AttendanceSession {
  id: string;
  courseSectionId: string;
  teacherId: string;
  classroomLocationId: string;
  courseCode: string;
  courseName: string;
  section: string;
  roomNumber: string;
  scheduledStart: string;
  scheduledEnd: string;
  state: SessionState;
  activeChallengeId?: string;
  currentChallengeToken?: string;
  challengeExpiresAt?: string;
  totalEnrolled: number;
  totalPresent: number;
  createdAt: string;
}

export interface QRChallenge {
  id: string;
  sessionId: string;
  token: string; // High-entropy opaque challenge token
  issuedAt: string;
  expiresAt: string; // Exactly 90s server validity window
  isConsumed: boolean;
}

export type AttemptStatus = 
  | 'attempt_accepted' 
  | 'location_pending' 
  | 'auth_pending' 
  | 'evidence_submitting' 
  | 'confirmed' 
  | 'location_failed' 
  | 'auth_failed' 
  | 'expired' 
  | 'needs_review' 
  | 'unknown_reconciling';

export interface CheckInAttempt {
  id: string;
  sessionId: string;
  studentId: string;
  challengeId: string;
  status: AttemptStatus;
  startedAt: string; // Server timestamp
  deadlineAt: string; // Exactly startedAt + 45 seconds
  locationAccuracy?: number;
  distanceMetres?: number;
  outcomeReason?: string;
  committedAt?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'pending_review';

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentId: string;
  studentName: string;
  enrollmentId: string;
  courseCode: string;
  courseName: string;
  sessionDate: string;
  status: AttendanceStatus;
  verificationMethod: 'qr_biometric_geofence' | 'teacher_manual_override' | 'admin_correction';
  verifiedAt: string;
  overrideReason?: string;
  overrideBy?: string;
}

export interface ManualAdjustmentRequest {
  recordId: string;
  sessionId: string;
  studentId: string;
  newStatus: AttendanceStatus;
  reasonCategory: 'medical' | 'institutional_duty' | 'device_issue' | 'other';
  reasonText: string;
}

export interface VerificationEvidencePayload {
  attemptId: string;
  studentId: string;
  deviceId: string;
  latitude: number;
  longitude: number;
  accuracyMetres: number;
  gpsTimestamp: string;
  biometricSuccess: boolean;
  biometricType?: 'biometric' | 'device_credential';
  deviceSignature?: string;
}

export interface CheckInResult {
  success: boolean;
  status: 'confirmed' | 'rejected' | 'expired' | 'out_of_bounds' | 'auth_failed';
  message: string;
  attendanceRecord?: AttendanceRecord;
  reconciliationRequired?: boolean;
}

export * from './store';

