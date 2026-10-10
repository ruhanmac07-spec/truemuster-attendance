import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { TrueMusterStore } from '@truemuster/domain-contracts';
import { STU01_Welcome } from './screens/STU01_Welcome';
import { STU02_DeviceBinding } from './screens/STU02_DeviceBinding';
import { STU03_StudentHome } from './screens/STU03_StudentHome';
import { STU04_LiveScanner } from './screens/STU04_LiveScanner';
import { STU05_OutcomeTicket } from './screens/STU05_OutcomeTicket';
import { STU06_AttendanceHistory } from './screens/STU06_AttendanceHistory';
import { STU07_Profile } from './screens/STU07_Profile';
import { BottomNav } from './components/BottomNav';
export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(true); // default true for immediate demo
    const [isDeviceBound, setIsDeviceBound] = useState(true); // default bound
    const [activeTab, setActiveTab] = useState('home');
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [outcomeData, setOutcomeData] = useState(null);
    const [session, setSession] = useState(TrueMusterStore.getSession());
    const [records, setRecords] = useState(TrueMusterStore.getRecords(session.id));
    const student = {
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
            }
            else if (event.type === 'RECORDS_UPDATED') {
                if (event.payload.sessionId === session.id) {
                    setRecords(event.payload.records);
                }
            }
        });
        return unsubscribe;
    }, [session.id]);
    const isMarkedPresent = records.some(r => r.studentId === student.id && r.status === 'present');
    const handleScanSuccess = (result) => {
        setIsScannerOpen(false);
        setOutcomeData({
            isSuccess: true,
            record: result.attendanceRecord,
        });
        // refresh records
        setRecords(TrueMusterStore.getRecords(session.id));
    };
    const handleScanFailure = (reason) => {
        setIsScannerOpen(false);
        setOutcomeData({
            isSuccess: false,
            failureReason: reason,
        });
    };
    if (!isAuthenticated) {
        return _jsx(STU01_Welcome, { onSuccess: () => setIsAuthenticated(true) });
    }
    if (!isDeviceBound) {
        return _jsx(STU02_DeviceBinding, { onSuccess: () => setIsDeviceBound(true) });
    }
    return (_jsxs("div", { style: { maxWidth: 480, margin: '0 auto', minHeight: '100vh', position: 'relative' }, children: [isScannerOpen && (_jsx(STU04_LiveScanner, { onClose: () => setIsScannerOpen(false), onSuccess: handleScanSuccess, onFailure: handleScanFailure })), outcomeData && (_jsx(STU05_OutcomeTicket, { isSuccess: outcomeData.isSuccess, record: outcomeData.record, failureReason: outcomeData.failureReason, onReturnHome: () => setOutcomeData(null) })), !isScannerOpen && !outcomeData && (_jsxs(_Fragment, { children: [activeTab === 'home' && (_jsx(STU03_StudentHome, { student: student, session: session, isMarkedPresent: isMarkedPresent, onOpenScanner: () => setIsScannerOpen(true), onOpenHistory: () => setActiveTab('history') })), activeTab === 'history' && (_jsx(STU06_AttendanceHistory, { records: records })), activeTab === 'profile' && (_jsx(STU07_Profile, { student: student, onSignOut: () => setIsAuthenticated(false) })), _jsx(BottomNav, { activeTab: activeTab, onSelectTab: setActiveTab })] }))] }));
}
