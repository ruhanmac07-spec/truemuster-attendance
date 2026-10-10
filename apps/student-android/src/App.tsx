import React, { useState, useEffect } from 'react';
import { TrueMusterStore, AttendanceSession, AttendanceRecord, StudentProfile, CheckInResult } from '@truemuster/domain-contracts';
import { STU01_Welcome } from './screens/STU01_Welcome';
import { STU02_DeviceBinding } from './screens/STU02_DeviceBinding';
import { STU03_StudentHome } from './screens/STU03_StudentHome';
import { STU04_LiveScanner } from './screens/STU04_LiveScanner';
import { STU05_OutcomeTicket } from './screens/STU05_OutcomeTicket';
import { STU06_AttendanceHistory } from './screens/STU06_AttendanceHistory';
import { STU07_Profile } from './screens/STU07_Profile';
import { BottomNav, StudentTab } from './components/BottomNav';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // default true for immediate demo
  const [isDeviceBound, setIsDeviceBound] = useState(true); // default bound
  const [activeTab, setActiveTab] = useState<StudentTab>('home');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState<'environment' | 'user'>('environment');
  const [outcomeData, setOutcomeData] = useState<{ isSuccess: boolean; record?: AttendanceRecord; failureReason?: string } | null>(null);

  const [session, setSession] = useState<AttendanceSession>(TrueMusterStore.getSession());
  const [records, setRecords] = useState<AttendanceRecord[]>(TrueMusterStore.getRecords(session.id));

  const student: StudentProfile = {
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

  useEffect(() => {
    const unsubscribe = TrueMusterStore.subscribe((event) => {
      if (event.type === 'SESSION_UPDATED') {
        setSession(event.payload);
      } else if (event.type === 'RECORDS_UPDATED') {
        if (event.payload.sessionId === session.id) {
          setRecords(event.payload.records);
        }
      }
    });
    return unsubscribe;
  }, [session.id]);

  const isMarkedPresent = records.some(r => r.studentId === student.id && r.status === 'present');

  const handleScanSuccess = (result: CheckInResult) => {
    setIsScannerOpen(false);
    setOutcomeData({
      isSuccess: true,
      record: result.attendanceRecord,
    });
    // refresh records
    setRecords(TrueMusterStore.getRecords(session.id));
  };

  const handleScanFailure = (reason: string) => {
    setIsScannerOpen(false);
    setOutcomeData({
      isSuccess: false,
      failureReason: reason,
    });
  };

  if (!isAuthenticated) {
    return <STU01_Welcome onSuccess={() => setIsAuthenticated(true)} />;
  }

  if (!isDeviceBound) {
    return <STU02_DeviceBinding onSuccess={() => setIsDeviceBound(true)} />;
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>
      {isScannerOpen && (
        <STU04_LiveScanner
          initialFacingMode={scannerMode}
          onClose={() => setIsScannerOpen(false)}
          onSuccess={handleScanSuccess}
          onFailure={handleScanFailure}
        />
      )}

      {outcomeData && (
        <STU05_OutcomeTicket
          isSuccess={outcomeData.isSuccess}
          record={outcomeData.record}
          failureReason={outcomeData.failureReason}
          onReturnHome={() => setOutcomeData(null)}
        />
      )}

      {!isScannerOpen && !outcomeData && (
        <>
          {activeTab === 'home' && (
            <STU03_StudentHome
              student={student}
              session={session}
              isMarkedPresent={isMarkedPresent}
              onOpenScanner={(mode = 'environment') => {
                setScannerMode(mode);
                setIsScannerOpen(true);
              }}
              onOpenHistory={() => setActiveTab('history')}
            />
          )}

          {activeTab === 'history' && (
            <STU06_AttendanceHistory records={records} />
          )}

          {activeTab === 'profile' && (
            <STU07_Profile
              student={student}
              onSignOut={() => setIsAuthenticated(false)}
            />
          )}

          <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />
        </>
      )}
    </div>
  );
}
