import React, { useState, useEffect } from 'react';
import { TrueMusterStore, AttendanceSession, AttendanceRecord } from '@truemuster/domain-contracts';
import { Sidebar, DesktopDestination } from './components/Sidebar';
import { TeacherDashboard } from './screens/TeacherDashboard';
import { QRProjectionScreen } from './screens/QRProjectionScreen';
import { LiveAttendanceRegister } from './screens/LiveAttendanceRegister';
import { ManualExceptionDialog } from './screens/ManualExceptionDialog';
import { AdminOverview } from './screens/AdminOverview';
import { CorrectionApprovalQueue } from './screens/CorrectionApprovalQueue';
import { AuditLedger } from './screens/AuditLedger';

export default function App() {
  const [currentRole, setCurrentRole] = useState<'teacher' | 'admin'>('teacher');
  const [destination, setDestination] = useState<DesktopDestination>('tch_dashboard');
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const [session, setSession] = useState<AttendanceSession>(TrueMusterStore.getSession());
  const [records, setRecords] = useState<AttendanceRecord[]>(TrueMusterStore.getRecords(session.id));

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

  const totalPresent = records.filter(r => r.status === 'present').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      {/* Left Persistent Navigation Rail (250px) */}
      <Sidebar
        currentRole={currentRole}
        destination={destination}
        onSelect={setDestination}
        onToggleRole={setCurrentRole}
      />

      {/* Main Desktop Content Workspace */}
      <main style={{ marginLeft: 250, flex: 1, padding: '28px 36px', minWidth: 900 }}>
        {destination === 'tch_dashboard' && (
          <TeacherDashboard
            session={session}
            totalPresent={totalPresent}
            onLaunchQR={() => setDestination('tch_qr')}
            onViewRegister={() => setDestination('tch_register')}
          />
        )}

        {destination === 'tch_qr' && (
          <QRProjectionScreen
            session={session}
            totalPresent={totalPresent}
            onBack={() => setDestination('tch_dashboard')}
            onViewRegister={() => setDestination('tch_register')}
          />
        )}

        {destination === 'tch_register' && (
          <LiveAttendanceRegister
            session={session}
            records={records}
            onBack={() => setDestination('tch_dashboard')}
            onOpenQR={() => setDestination('tch_qr')}
            onOpenManualDialog={() => setIsManualModalOpen(true)}
          />
        )}

        {destination === 'adm_overview' && (
          <AdminOverview
            onNavigateCorrections={() => setDestination('adm_corrections')}
            onNavigateAudit={() => setDestination('adm_audit')}
          />
        )}

        {destination === 'adm_corrections' && (
          <CorrectionApprovalQueue
            onBack={() => setDestination('adm_overview')}
          />
        )}

        {destination === 'adm_audit' && (
          <AuditLedger
            onBack={() => setDestination('adm_overview')}
          />
        )}
      </main>

      {/* Manual Exception Dialog Modal */}
      {isManualModalOpen && (
        <ManualExceptionDialog
          sessionId={session.id}
          onClose={() => setIsManualModalOpen(false)}
          onSuccess={() => {
            setIsManualModalOpen(false);
            setRecords(TrueMusterStore.getRecords(session.id));
          }}
        />
      )}
    </div>
  );
}
