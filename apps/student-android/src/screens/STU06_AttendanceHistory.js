import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { CheckCircle2, AlertCircle, FileText, X, Send } from 'lucide-react';
export const STU06_AttendanceHistory = ({ records }) => {
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [disputeReason, setDisputeReason] = useState('medical');
    const [disputeNote, setDisputeNote] = useState('');
    const [submittedMessage, setSubmittedMessage] = useState(null);
    const handleDisputeSubmit = (e) => {
        e.preventDefault();
        setSubmittedMessage('Dispute request submitted to Academic Administration for review.');
        setTimeout(() => {
            setSelectedRecord(null);
            setSubmittedMessage(null);
            setDisputeNote('');
        }, 2000);
    };
    return (_jsxs("div", { style: {
            padding: Spacing.md,
            paddingBottom: 90,
            backgroundColor: Colors.surfaceCanvas,
            minHeight: '100vh',
        }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: 700, color: Colors.textPrimary, marginTop: Spacing.sm, marginBottom: 4 }, children: "Attendance Ledger" }), _jsx("p", { style: { fontSize: '13px', color: Colors.textSecondary, marginBottom: Spacing.lg }, children: "Authoritative cryptographic history for enrolled student 2023-CS-042" }), _jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: Spacing.sm }, children: records.length === 0 ? (_jsx("div", { style: {
                        padding: Spacing.xl,
                        textAlign: 'center',
                        backgroundColor: Colors.surfaceCard,
                        borderRadius: Radii.card,
                        color: Colors.textSecondary,
                    }, children: "No attendance records recorded yet." })) : (records.map((rec) => (_jsxs("div", { style: {
                        backgroundColor: Colors.surfaceCard,
                        borderRadius: Radii.card,
                        padding: Spacing.base,
                        border: `1px solid ${Colors.borderDefault}`,
                    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }, children: [_jsxs("div", { children: [_jsxs("span", { style: { fontSize: '12px', fontWeight: 600, color: Colors.brandNavy }, children: [rec.courseCode, " \u00B7 ", rec.sessionDate] }), _jsx("h4", { style: { fontSize: '15px', fontWeight: 600, color: Colors.textPrimary, marginTop: 2 }, children: rec.courseName })] }), rec.status === 'present' ? (_jsxs("span", { style: {
                                        backgroundColor: Colors.statusSuccessBg,
                                        color: Colors.statusSuccess,
                                        padding: '3px 8px',
                                        borderRadius: Radii.full,
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                    }, children: [_jsx(CheckCircle2, { size: 12 }), " PRESENT"] })) : (_jsxs("span", { style: {
                                        backgroundColor: Colors.statusErrorBg,
                                        color: Colors.statusError,
                                        padding: '3px 8px',
                                        borderRadius: Radii.full,
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                    }, children: [_jsx(AlertCircle, { size: 12 }), " ABSENT"] }))] }), _jsxs("div", { style: {
                                marginTop: Spacing.md,
                                paddingTop: Spacing.sm,
                                borderTop: `1px solid ${Colors.surfaceSubtle}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: '12px',
                                color: Colors.textSecondary,
                            }, children: [_jsxs("span", { children: ["Verified: ", new Date(rec.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })] }), _jsxs("button", { onClick: () => setSelectedRecord(rec), style: {
                                        background: 'none',
                                        border: 'none',
                                        color: Colors.brandNavy,
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 4,
                                    }, children: [_jsx(FileText, { size: 14 }), " File Dispute"] })] })] }, rec.id)))) }), selectedRecord && (_jsx("div", { style: {
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: Spacing.md,
                    zIndex: 200,
                }, children: _jsxs("div", { style: {
                        backgroundColor: Colors.surfaceCard,
                        borderRadius: Radii.sheet,
                        padding: Spacing.lg,
                        width: '100%',
                        maxWidth: 400,
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
                    }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }, children: [_jsx("h3", { style: { fontSize: '17px', fontWeight: 700, color: Colors.textPrimary }, children: "File Attendance Dispute" }), _jsx("button", { onClick: () => setSelectedRecord(null), style: { background: 'none', border: 'none', cursor: 'pointer' }, children: _jsx(X, { size: 20, color: Colors.textSecondary }) })] }), _jsxs("p", { style: { fontSize: '13px', color: Colors.textSecondary, marginBottom: Spacing.md, lineHeight: 1.4 }, children: ["Dispute for ", _jsx("strong", { children: selectedRecord.courseCode }), " (", selectedRecord.sessionDate, "). This request requires approval from Academic Administration."] }), submittedMessage ? (_jsx("div", { style: {
                                padding: Spacing.md,
                                backgroundColor: Colors.statusSuccessBg,
                                color: Colors.statusSuccess,
                                borderRadius: Radii.control,
                                fontSize: '13px',
                                fontWeight: 600,
                                textAlign: 'center',
                            }, children: submittedMessage })) : (_jsxs("form", { onSubmit: handleDisputeSubmit, children: [_jsxs("div", { style: { marginBottom: Spacing.md }, children: [_jsx("label", { style: { display: 'block', fontSize: '12px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 4 }, children: "Reason Category" }), _jsxs("select", { value: disputeReason, onChange: (e) => setDisputeReason(e.target.value), style: {
                                                width: '100%',
                                                height: 42,
                                                borderRadius: Radii.control,
                                                border: `1px solid ${Colors.borderDefault}`,
                                                padding: '0 10px',
                                                fontSize: '14px',
                                                backgroundColor: Colors.surfaceCard,
                                                outline: 'none',
                                            }, children: [_jsx("option", { value: "medical", children: "Medical / Health Leave" }), _jsx("option", { value: "institutional_duty", children: "Approved Institutional Duty" }), _jsx("option", { value: "device_issue", children: "Hardware GPS / Scanner Malfunction" }), _jsx("option", { value: "other", children: "Other Official Reason" })] })] }), _jsxs("div", { style: { marginBottom: Spacing.lg }, children: [_jsx("label", { style: { display: 'block', fontSize: '12px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 4 }, children: "Supporting Explanation" }), _jsx("textarea", { rows: 3, value: disputeNote, onChange: (e) => setDisputeNote(e.target.value), required: true, placeholder: "Provide details for administrative review...", style: {
                                                width: '100%',
                                                padding: 10,
                                                borderRadius: Radii.control,
                                                border: `1px solid ${Colors.borderDefault}`,
                                                fontSize: '13px',
                                                outline: 'none',
                                                resize: 'none',
                                            } })] }), _jsxs("div", { style: { display: 'flex', gap: 10 }, children: [_jsx("button", { type: "button", onClick: () => setSelectedRecord(null), style: {
                                                flex: 1,
                                                height: 44,
                                                borderRadius: Radii.button,
                                                border: `1px solid ${Colors.borderDefault}`,
                                                backgroundColor: Colors.surfaceCard,
                                                color: Colors.textPrimary,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                            }, children: "Cancel" }), _jsxs("button", { type: "submit", style: {
                                                flex: 1,
                                                height: 44,
                                                borderRadius: Radii.button,
                                                border: 'none',
                                                backgroundColor: Colors.brandNavy,
                                                color: Colors.textInverse,
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: 6,
                                            }, children: [_jsx(Send, { size: 16 }), " Submit"] })] })] }))] }) }))] }));
};
