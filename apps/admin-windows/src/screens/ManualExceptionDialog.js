import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { TrueMusterStore } from '@truemuster/domain-contracts';
import { X, ShieldAlert } from 'lucide-react';
export const ManualExceptionDialog = ({ sessionId, onClose, onSuccess }) => {
    const [studentId, setStudentId] = useState('stu-9904-divya');
    const [studentName, setStudentName] = useState('Divya Patel');
    const [enrollmentId, setEnrollmentId] = useState('2023-CS-088');
    const [reasonCategory, setReasonCategory] = useState('medical');
    const [justification, setJustification] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            const record = {
                id: 'rec-manual-' + Date.now(),
                sessionId,
                studentId,
                studentName,
                enrollmentId,
                courseCode: 'CS401',
                courseName: 'Distributed Systems & Cloud Computing',
                sessionDate: new Date().toISOString().split('T')[0],
                status: 'present',
                verificationMethod: 'teacher_manual_override',
                verifiedAt: new Date().toISOString(),
                overrideReason: `[${reasonCategory.toUpperCase()}] ${justification}`,
                overrideBy: 'Prof. K. Rao (Teacher)',
            };
            TrueMusterStore.markAttendance(record);
            setIsSubmitting(false);
            onSuccess();
        }, 600);
    };
    return (_jsx("div", { style: {
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
        }, children: _jsxs("div", { style: {
                backgroundColor: '#FFFFFF',
                borderRadius: Radii.card,
                width: 480,
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
            }, children: [_jsxs("div", { style: {
                        padding: '18px 24px',
                        borderBottom: `1px solid ${Colors.borderDefault}`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }, children: [_jsxs("div", { children: [_jsx("h3", { style: { fontSize: '17px', fontWeight: 700, color: Colors.textPrimary }, children: "Record Manual Attendance Exception (TCH-07)" }), _jsx("span", { style: { fontSize: '12px', color: Colors.textSecondary }, children: "Audited override with mandatory justification capture" })] }), _jsx("button", { onClick: onClose, style: { background: 'none', border: 'none', cursor: 'pointer' }, children: _jsx(X, { size: 20, color: Colors.textSecondary }) })] }), _jsxs("form", { onSubmit: handleSubmit, style: { padding: '20px 24px' }, children: [_jsxs("div", { style: { marginBottom: Spacing.base }, children: [_jsx("label", { style: { display: 'block', fontSize: '13px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 6 }, children: "Select Student to Override" }), _jsxs("select", { value: studentId, onChange: (e) => {
                                        setStudentId(e.target.value);
                                        if (e.target.value === 'stu-9904-divya') {
                                            setStudentName('Divya Patel');
                                            setEnrollmentId('2023-CS-088');
                                        }
                                        else if (e.target.value === 'stu-9901-alice') {
                                            setStudentName('Alice Sharma');
                                            setEnrollmentId('2023-CS-042');
                                        }
                                        else {
                                            setStudentName('Fiona Gallagher');
                                            setEnrollmentId('2023-CS-067');
                                        }
                                    }, style: {
                                        width: '100%',
                                        height: 38,
                                        borderRadius: Radii.control,
                                        border: `1px solid ${Colors.borderDefault}`,
                                        padding: '0 10px',
                                        fontSize: '13px',
                                        outline: 'none',
                                    }, children: [_jsx("option", { value: "stu-9904-divya", children: "Divya Patel (2023-CS-088)" }), _jsx("option", { value: "stu-9901-alice", children: "Alice Sharma (2023-CS-042)" }), _jsx("option", { value: "stu-9906-fiona", children: "Fiona Gallagher (2023-CS-067)" })] })] }), _jsxs("div", { style: { marginBottom: Spacing.base }, children: [_jsx("label", { style: { display: 'block', fontSize: '13px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 6 }, children: "Exception Reason Category (Mandatory Policy)" }), _jsxs("select", { value: reasonCategory, onChange: (e) => setReasonCategory(e.target.value), style: {
                                        width: '100%',
                                        height: 38,
                                        borderRadius: Radii.control,
                                        border: `1px solid ${Colors.borderDefault}`,
                                        padding: '0 10px',
                                        fontSize: '13px',
                                        outline: 'none',
                                    }, children: [_jsx("option", { value: "medical", children: "Medical Infirmary Leave" }), _jsx("option", { value: "institutional_duty", children: "Authorized Inter-College Competition / Duty" }), _jsx("option", { value: "hardware_malfunction", children: "Student Smartphone GPS / Hardware Failure" }), _jsx("option", { value: "other", children: "Other Academic Exemption" })] })] }), _jsxs("div", { style: { marginBottom: Spacing.base }, children: [_jsx("label", { style: { display: 'block', fontSize: '13px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 6 }, children: "Written Justification Note" }), _jsx("textarea", { rows: 3, required: true, placeholder: "Detail the reason for audit compliance...", value: justification, onChange: (e) => setJustification(e.target.value), style: {
                                        width: '100%',
                                        padding: 10,
                                        borderRadius: Radii.control,
                                        border: `1px solid ${Colors.borderDefault}`,
                                        fontSize: '13px',
                                        outline: 'none',
                                        resize: 'none',
                                    } })] }), _jsxs("div", { style: {
                                padding: Spacing.md,
                                backgroundColor: Colors.surfaceCanvas,
                                borderRadius: Radii.control,
                                fontSize: '12px',
                                color: Colors.textSecondary,
                                lineHeight: 1.4,
                                marginBottom: Spacing.base,
                                display: 'flex',
                                gap: 8,
                            }, children: [_jsx(ShieldAlert, { size: 16, color: Colors.brandNavy, style: { flexShrink: 0, marginTop: 2 } }), _jsx("span", { children: "This override will be logged in the immutable Institutional Audit Ledger with your staff ID." })] }), _jsxs("div", { style: { display: 'flex', gap: 10, justifyContent: 'flex-end' }, children: [_jsx("button", { type: "button", onClick: onClose, style: {
                                        height: 38,
                                        padding: '0 18px',
                                        borderRadius: Radii.control,
                                        backgroundColor: '#FFFFFF',
                                        border: `1px solid ${Colors.borderDefault}`,
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }, children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, style: {
                                        height: 38,
                                        padding: '0 20px',
                                        borderRadius: Radii.control,
                                        backgroundColor: Colors.brandNavy,
                                        color: '#FFFFFF',
                                        border: 'none',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }, children: isSubmitting ? 'Recording...' : 'Commit Exception' })] })] })] }) }));
};
