import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { ArrowLeft } from 'lucide-react';
export const CorrectionApprovalQueue = ({ onBack }) => {
    const [requests, setRequests] = useState([
        {
            id: 'req-01',
            studentName: 'Alice Sharma',
            enrollmentId: '2023-CS-042',
            courseCode: 'CS401',
            sessionDate: '2026-10-08',
            reason: 'Infirmary Visit for acute fever (Medical slip attached)',
            status: 'pending',
        },
        {
            id: 'req-02',
            studentName: 'Ethan Hunt',
            enrollmentId: '2023-CS-051',
            courseCode: 'CS402',
            sessionDate: '2026-10-07',
            reason: 'Representing university in Inter-College Robotics Hackathon',
            status: 'pending',
        },
    ]);
    const handleAction = (id, newStatus) => {
        setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };
    return (_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: Spacing.xl }, children: [_jsxs("button", { onClick: onBack, style: { background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: Colors.brandNavy, fontWeight: 600 }, children: [_jsx(ArrowLeft, { size: 18 }), " Back"] }), _jsxs("div", { children: [_jsx("h1", { style: { fontSize: '22px', fontWeight: 700, color: Colors.textPrimary }, children: "Correction Approval Queue (ADM-10)" }), _jsx("span", { style: { fontSize: '13px', color: Colors.textSecondary }, children: "Review post-finalization student dispute and teacher exception claims" })] })] }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: Spacing.base }, children: requests.map((req) => (_jsxs("div", { style: {
                        backgroundColor: '#FFFFFF',
                        borderRadius: Radii.card,
                        padding: Spacing.base,
                        border: `1px solid ${Colors.borderDefault}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }, children: [_jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 10 }, children: [_jsxs("span", { style: { fontWeight: 700, fontSize: '15px', color: Colors.textPrimary }, children: [req.studentName, " (", req.enrollmentId, ")"] }), _jsxs("span", { style: {
                                                backgroundColor: Colors.brandBlueSoft,
                                                color: Colors.brandNavy,
                                                padding: '2px 8px',
                                                borderRadius: Radii.sm,
                                                fontSize: '11px',
                                                fontWeight: 600,
                                            }, children: [req.courseCode, " \u00B7 ", req.sessionDate] })] }), _jsxs("p", { style: { fontSize: '13px', color: Colors.textSecondary, marginTop: 6 }, children: [_jsx("strong", { children: "Justification:" }), " ", req.reason] })] }), _jsx("div", { children: req.status === 'pending' ? (_jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsx("button", { onClick: () => handleAction(req.id, 'rejected'), style: {
                                            height: 36,
                                            padding: '0 14px',
                                            borderRadius: Radii.control,
                                            backgroundColor: Colors.surfaceSubtle,
                                            border: `1px solid ${Colors.borderDefault}`,
                                            color: Colors.statusError,
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }, children: "Reject" }), _jsx("button", { onClick: () => handleAction(req.id, 'approved'), style: {
                                            height: 36,
                                            padding: '0 16px',
                                            borderRadius: Radii.control,
                                            backgroundColor: Colors.statusSuccess,
                                            border: 'none',
                                            color: '#FFFFFF',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }, children: "Approve" })] })) : (_jsx("span", { style: {
                                    padding: '4px 10px',
                                    borderRadius: Radii.full,
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    backgroundColor: req.status === 'approved' ? Colors.statusSuccessBg : Colors.statusErrorBg,
                                    color: req.status === 'approved' ? Colors.statusSuccess : Colors.statusError,
                                }, children: req.status.toUpperCase() })) })] }, req.id))) })] }));
};
