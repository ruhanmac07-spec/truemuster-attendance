import { AttendanceSession, AttendanceRecord, QRChallenge, StudentProfile } from './index';
export declare const INITIAL_STUDENT: StudentProfile;
export declare const INITIAL_SESSION: AttendanceSession;
export declare const INITIAL_STUDENTS_ROSTER: {
    id: string;
    name: string;
    enrollmentId: string;
    status: string;
}[];
export declare class TrueMusterStore {
    private static CHANNEL_NAME;
    private static channel;
    static getSession(): AttendanceSession;
    static saveSession(session: AttendanceSession): void;
    static getActiveChallenge(): QRChallenge | null;
    static issueNewChallenge(sessionId: string): QRChallenge;
    static getRecords(sessionId: string): AttendanceRecord[];
    static saveRecords(sessionId: string, records: AttendanceRecord[]): void;
    static markAttendance(record: AttendanceRecord): void;
    static subscribe(listener: (event: any) => void): () => void;
    private static broadcast;
}
