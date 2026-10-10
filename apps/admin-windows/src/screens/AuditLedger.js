import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { ArrowLeft } from 'lucide-react';
export const AuditLedger = ({ onBack }) => {
    const auditEntries = [
        {
            id: 'aud-0091',
            actor: 'Prof. K. Rao (Teacher)',
            action: 'TEACHER_MANUAL_OVERRIDE',
            target: 'attendance_records/rec-manual-01',
            details: 'Marked Divya Patel (2023-CS-088) as Present with reason [MEDICAL]',
            timestamp: '2026-10-10 10:48:22 UTC',
        },
        {
            id: 'aud-0090',
            actor: 'Alice Sharma (Student)',
            action: 'CHECKIN_COMMITTED',
            target: 'attendance_records/rec-alice-cs401',
            details: 'Verified via QR Challenge + BiometricPrompt + Geofence (Distance: 24.5m)',
            timestamp: '2026-10-10 10:44:10 UTC',
        },
        {
            id: 'aud-0089',
            actor: 'System / Teacher Client',
            action: 'QR_CHALLENGE_ROTATED',
            target: 'qr_challenges/chl-cs401-rot-03',
            details: 'Generated 90-second opaque dynamic challenge TM-W81X-9012',
            timestamp: '2026-10-10 10:43:00 UTC',
        },
        {
            id: 'aud-0088',
            actor: 'Prof. K. Rao (Teacher)',
            action: 'SESSION_OPENED',
            target: 'attendance_sessions/ses-cs401-001',
            details: 'Activated session CS401 at Computing Lab 302 anchor (Lat: 19.0760, Lng: 72.8777)',
            timestamp: '2026-10-10 10:30:00 UTC',
        },
    ];
    return (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: Spacing.xl }, children: [_jsxs("button", { onClick: onBack, style: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: Colors.brandNavy, fontWeight: 600 }, children: [_jsx(ArrowLeft, { size: 18 }), " Back"] }), _jsxs("div", { children: [_jsx("h1", { style: { fontSize: '22px', fontWeight: 700, color: Colors.textPrimary }, children: "System Audit Ledger (ADM-13)" }), _jsx("span", { style: { fontSize: '13px', color: Colors.textSecondary }, children: "Append-only tamper-evident institutional transaction ledger" })] })] }), _jsx("div", { style: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: Radii.card,
                    border: `1px solid ${Colors.borderDefault}`,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                }, children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { backgroundColor: Colors.surfaceCanvas, borderBottom: `1px solid ${Colors.borderDefault}` }, children: [_jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "EVENT ID" }), _jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "TIMESTAMP (UTC)" }), _jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "ACTOR" }), _jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "ACTION TYPE" }), _jsx("th", { style: { padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }, children: "VERIFICATION DETAILS" })] }) }), _jsx("tbody", { children: auditEntries.map((entry, idx) => (_jsxs("tr", { style: {
                                    borderBottom: `1px solid ${Colors.surfaceSubtle}`,
                                    backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFE',
                                }, children: [_jsx("td", { style: { padding: '14px 18px', fontFamily: 'monospace', fontWeight: 600, color: Colors.brandNavy }, children: entry.id }), _jsx("td", { style: { padding: '14px 18px', color: Colors.textSecondary, whiteSpace: 'nowrap' }, children: entry.timestamp }), _jsx("td", { style: { padding: '14px 18px', fontWeight: 600, color: Colors.textPrimary }, children: entry.actor }), _jsx("td", { style: { padding: '14px 18px' }, children: _jsx("span", { style: {
                                                backgroundColor: Colors.brandBlueSoft,
                                                color: Colors.brandNavy,
                                                padding: '3px 8px',
                                                borderRadius: Radii.sm,
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                fontFamily: 'monospace',
                                            }, children: entry.action }) }), _jsx("td", { style: { padding: '14px 18px', color: Colors.textSecondary }, children: entry.details })] }, entry.id))) })] }) })] }));
};
