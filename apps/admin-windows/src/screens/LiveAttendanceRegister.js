import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { ArrowLeft, Search, CheckCircle2, AlertCircle, Plus, QrCode } from 'lucide-react';
export const LiveAttendanceRegister = ({ session, records, onBack, onOpenQR, onOpenManualDialog, }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    // Complete student roster including present and absent
    const fullRoster = [
        { id: 'stu-9901-alice', name: 'Alice Sharma', enrollmentId: '2023-CS-042' },
        { id: 'stu-9902-bob', name: 'Bob Jenkins', enrollmentId: '2023-CS-015' },
        { id: 'stu-9903-charlie', name: 'Charlie Dave', enrollmentId: '2023-CS-022' },
        { id: 'stu-9904-divya', name: 'Divya Patel', enrollmentId: '2023-CS-088' },
        { id: 'stu-9905-ethan', name: 'Ethan Hunt', enrollmentId: '2023-CS-051' },
        { id: 'stu-9906-fiona', name: 'Fiona Gallagher', enrollmentId: '2023-CS-067' },
        { id: 'stu-9907-george', name: 'George Clark', enrollmentId: '2023-CS-019' },
    ];
    const mergedRoster = fullRoster.map((stu) => {
        const rec = records.find(r => r.studentId === stu.id);
        return {
            ...stu,
            isMarked: !!rec,
            status: rec ? rec.status : 'absent',
            verifiedAt: rec ? rec.verifiedAt : null,
            method: rec ? rec.verificationMethod : null,
        };
    });
    const filtered = mergedRoster.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase());
        if (statusFilter === 'all')
            return matchesSearch;
        return matchesSearch && item.status === statusFilter;
    });
    const presentCount = mergedRoster.filter(r => r.status === 'present').length;
    return (_jsxs("div", { children: [_jsxs("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: Spacing.lg,
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 14 }, children: [_jsxs("button", { onClick: onBack, style: {
                                    background: 'none',
                                    border: 'none',
                                    color: Colors.brandNavy,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }, children: [_jsx(ArrowLeft, { size: 18 }), " Back"] }), _jsxs("div", { children: [_jsx("h1", { style: { fontSize: '22px', fontWeight: 700, color: Colors.textPrimary }, children: "Live Attendance Register (TCH-05)" }), _jsxs("span", { style: { fontSize: '13px', color: Colors.textSecondary }, children: [session.courseCode, " \u00B7 ", session.courseName, " \u00B7 ", session.section] })] })] }), _jsxs("div", { style: { display: 'flex', gap: 10 }, children: [_jsxs("button", { onClick: onOpenQR, style: {
                                    height: 38,
                                    padding: '0 16px',
                                    borderRadius: Radii.control,
                                    backgroundColor: '#FFFFFF',
                                    color: Colors.brandNavy,
                                    border: `1px solid ${Colors.borderDefault}`,
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }, children: [_jsx(QrCode, { size: 16 }), " QR Projection"] }), _jsxs("button", { onClick: onOpenManualDialog, style: {
                                    height: 38,
                                    padding: '0 16px',
                                    borderRadius: Radii.control,
                                    backgroundColor: Colors.brandNavy,
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                }, children: [_jsx(Plus, { size: 16 }), " Record Exception (TCH-07)"] })] })] }), _jsxs("div", { style: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: Radii.card,
                    border: `1px solid ${Colors.borderDefault}`,
                    padding: Spacing.base,
                    marginBottom: Spacing.base,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10, width: 340 }, children: [_jsx(Search, { size: 18, color: Colors.textSecondary }), _jsx("input", { type: "text", placeholder: "Search student by name or roll number...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), style: {
                                    width: '100%',
                                    height: 36,
                                    border: 'none',
                                    fontSize: '13px',
                                    outline: 'none',
                                    backgroundColor: 'transparent',
                                } })] }), _jsx("div", { style: { display: 'flex', alignItems: 'center', gap: 16 }, children: _jsxs("div", { style: { display: 'flex', gap: 6 }, children: [_jsxs("button", { onClick: () => setStatusFilter('all'), style: {
                                        padding: '6px 12px',
                                        borderRadius: Radii.control,
                                        border: 'none',
                                        backgroundColor: statusFilter === 'all' ? Colors.brandNavy : Colors.surfaceSubtle,
                                        color: statusFilter === 'all' ? '#FFFFFF' : Colors.textPrimary,
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }, children: ["All (", mergedRoster.length, ")"] }), _jsxs("button", { onClick: () => setStatusFilter('present'), style: {
                                        padding: '6px 12px',
                                        borderRadius: Radii.control,
                                        border: 'none',
                                        backgroundColor: statusFilter === 'present' ? Colors.statusSuccess : Colors.surfaceSubtle,
                                        color: statusFilter === 'present' ? '#FFFFFF' : Colors.textPrimary,
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }, children: ["Present (", presentCount, ")"] }), _jsxs("button", { onClick: () => setStatusFilter('absent'), style: {
                                        padding: '6px 12px',
                                        borderRadius: Radii.control,
                                        border: 'none',
                                        backgroundColor: statusFilter === 'absent' ? Colors.statusError : Colors.surfaceSubtle,
                                        color: statusFilter === 'absent' ? '#FFFFFF' : Colors.textPrimary,
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }, children: ["Absent (", mergedRoster.length - presentCount, ")"] })] }) })] }), _jsx("div", { style: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: Radii.card,
                    border: `1px solid ${Colors.borderDefault}`,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: Colors.surfaceCanvas, borderBottom: `1px solid ${Colors.borderDefault}` }, children: [_jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "STUDENT NAME" }), _jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "ENROLLMENT ID" }), _jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "STATUS" }), _jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "VERIFIED TIMESTAMP" }), _jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "VERIFICATION METHOD" })] }) }), _jsx("tbody", { children: filtered.map((item, idx) => (_jsxs("tr", { style: {
                                    borderBottom: `1px solid ${Colors.surfaceSubtle}`,
                                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFE',
                                }, children: [_jsx("td", { style: { padding: '14px 18px', fontWeight: 600, color: Colors.textPrimary }, children: item.name }), _jsx("td", { style: { padding: '14px 18px', color: Colors.textSecondary, fontFamily: 'monospace' }, children: item.enrollmentId }), _jsx("td", { style: { padding: '14px 18px' }, children: item.status === 'present' ? (_jsxs("span", { style: {
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                backgroundColor: Colors.statusSuccessBg,
                                                color: Colors.statusSuccess,
                                                padding: '4px 10px',
                                                borderRadius: Radii.full,
                                                fontWeight: 700,
                                                fontSize: '11px',
                                            }, children: [_jsx(CheckCircle2, { size: 13 }), " PRESENT"] })) : (_jsxs("span", { style: {
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 4,
                                                backgroundColor: Colors.statusErrorBg,
                                                color: Colors.statusError,
                                                padding: '4px 10px',
                                                borderRadius: Radii.full,
                                                fontWeight: 700,
                                                fontSize: '11px',
                                            }, children: [_jsx(AlertCircle, { size: 13 }), " ABSENT"] })) }), _jsx("td", { style: { padding: '14px 18px', color: Colors.textSecondary }, children: item.verifiedAt ? new Date(item.verifiedAt).toLocaleTimeString() : '—' }), _jsx("td", { style: { padding: '14px 18px', color: Colors.textSecondary }, children: item.method ? (item.method === 'qr_biometric_geofence' ? 'QR + Biometric + Geofence' : 'Teacher Manual Override') : 'Not Checked In' })] }, item.id))) })] }) })] }));
};
