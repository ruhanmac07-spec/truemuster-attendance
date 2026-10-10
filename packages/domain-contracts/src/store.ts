import { AttendanceSession, AttendanceRecord, QRChallenge, CheckInAttempt, StudentProfile } from './index';

export const INITIAL_STUDENT: StudentProfile = {
  id: 'stu-9901-alice',
  email: 'alice.sharma@institution.edu',
  fullName: 'Alice Sharma',
  role: 'student',
  enrollmentId: '2023-CS-042',
  department: 'Computer Science & Engineering',
  batch: '2023-2027',
  activeDeviceId: 'dev-pixel7-hw-01',
  deviceBoundAt: '2026-09-15T09:00:00Z',
  createdAt: '2026-08-01T10:00:00Z',
};

export const INITIAL_SESSION: AttendanceSession = {
  id: 'ses-cs401-001',
  courseSectionId: 'cs401-a',
  teacherId: 'tch-prof-rao',
  classroomLocationId: 'loc-lab-302',
  courseCode: 'CS401',
  courseName: 'Distributed Systems & Cloud Computing',
  section: 'Section A (Lab)',
  roomNumber: 'Computing Lab 302',
  scheduledStart: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  scheduledEnd: new Date(Date.now() + 50 * 60 * 1000).toISOString(),
  state: 'active',
  totalEnrolled: 45,
  totalPresent: 18,
  createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
};

export const INITIAL_STUDENTS_ROSTER = [
  { id: 'stu-9901-alice', name: 'Alice Sharma', enrollmentId: '2023-CS-042', status: 'absent' },
  { id: 'stu-9902-bob', name: 'Bob Jenkins', enrollmentId: '2023-CS-015', status: 'present' },
  { id: 'stu-9903-charlie', name: 'Charlie Dave', enrollmentId: '2023-CS-022', status: 'present' },
  { id: 'stu-9904-divya', name: 'Divya Patel', enrollmentId: '2023-CS-088', status: 'absent' },
  { id: 'stu-9905-ethan', name: 'Ethan Hunt', enrollmentId: '2023-CS-051', status: 'present' },
];

export class TrueMusterStore {
  private static CHANNEL_NAME = 'truemuster_sync_v1';
  private static channel: BroadcastChannel | null = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(TrueMusterStore.CHANNEL_NAME) : null;

  public static getSession(): AttendanceSession {
    const raw = localStorage.getItem('tm_active_session');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    this.saveSession(INITIAL_SESSION);
    return INITIAL_SESSION;
  }

  public static saveSession(session: AttendanceSession): void {
    localStorage.setItem('tm_active_session', JSON.stringify(session));
    this.broadcast({ type: 'SESSION_UPDATED', payload: session });
  }

  public static getActiveChallenge(): QRChallenge | null {
    const raw = localStorage.getItem('tm_active_challenge');
    if (raw) {
      try {
        const challenge: QRChallenge = JSON.parse(raw);
        if (new Date(challenge.expiresAt).getTime() > Date.now()) {
          return challenge;
        }
      } catch (e) {}
    }
    return null;
  }

  public static issueNewChallenge(sessionId: string): QRChallenge {
    const now = Date.now();
    const challenge: QRChallenge = {
      id: 'chl-' + Math.random().toString(36).substring(2, 9),
      sessionId,
      token: 'TM-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + (now % 10000),
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + 90 * 1000).toISOString(), // Exactly 90s server validity
      isConsumed: false,
    };
    localStorage.setItem('tm_active_challenge', JSON.stringify(challenge));
    this.broadcast({ type: 'CHALLENGE_ISSUED', payload: challenge });
    return challenge;
  }

  public static getRecords(sessionId: string): AttendanceRecord[] {
    const raw = localStorage.getItem('tm_records_' + sessionId);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    const defaults: AttendanceRecord[] = [
      {
        id: 'rec-01',
        sessionId,
        studentId: 'stu-9902-bob',
        studentName: 'Bob Jenkins',
        enrollmentId: '2023-CS-015',
        courseCode: 'CS401',
        courseName: 'Distributed Systems & Cloud Computing',
        sessionDate: new Date().toISOString().split('T')[0],
        status: 'present',
        verificationMethod: 'qr_biometric_geofence',
        verifiedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      },
      {
        id: 'rec-02',
        sessionId,
        studentId: 'stu-9903-charlie',
        studentName: 'Charlie Dave',
        enrollmentId: '2023-CS-022',
        courseCode: 'CS401',
        courseName: 'Distributed Systems & Cloud Computing',
        sessionDate: new Date().toISOString().split('T')[0],
        status: 'present',
        verificationMethod: 'qr_biometric_geofence',
        verifiedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
    ];
    this.saveRecords(sessionId, defaults);
    return defaults;
  }

  public static saveRecords(sessionId: string, records: AttendanceRecord[]): void {
    localStorage.setItem('tm_records_' + sessionId, JSON.stringify(records));
    this.broadcast({ type: 'RECORDS_UPDATED', payload: { sessionId, records } });
  }

  public static markAttendance(record: AttendanceRecord): void {
    const records = this.getRecords(record.sessionId);
    const existingIndex = records.findIndex(r => r.studentId === record.studentId);
    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.push(record);
    }
    this.saveRecords(record.sessionId, records);

    // Update session counts
    const session = this.getSession();
    if (session.id === record.sessionId) {
      session.totalPresent = records.filter(r => r.status === 'present').length;
      this.saveSession(session);
    }
  }

  public static subscribe(listener: (event: any) => void): () => void {
    if (this.channel) {
      const handler = (e: MessageEvent) => listener(e.data);
      this.channel.addEventListener('message', handler);
      return () => this.channel?.removeEventListener('message', handler);
    }
    return () => {};
  }

  private static broadcast(data: any): void {
    if (this.channel) {
      this.channel.postMessage(data);
    }
  }
}
