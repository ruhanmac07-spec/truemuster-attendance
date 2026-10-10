import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { ShieldCheck, ArrowRight, Lock, User } from 'lucide-react';
export const STU01_Welcome = ({ onSuccess }) => {
    const [enrollmentId, setEnrollmentId] = useState('2023-CS-042');
    const [password, setPassword] = useState('••••••••••••');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setTimeout(() => {
            setIsLoading(false);
            if (enrollmentId.trim() === '2023-CS-042') {
                onSuccess();
            }
            else {
                setError('Enrollment record not found in approved institutional roster.');
            }
        }, 600);
    };
    return (_jsxs("div", { style: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: Spacing.xl,
            backgroundColor: Colors.surfaceCanvas,
        }, children: [_jsxs("div", { children: [_jsxs("div", { style: {
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: Spacing.sm,
                            backgroundColor: Colors.brandNavy,
                            color: Colors.textInverse,
                            padding: '8px 14px',
                            borderRadius: Radii.control,
                            fontWeight: 700,
                            fontSize: '14px',
                            letterSpacing: '0.05em',
                        }, children: [_jsx(ShieldCheck, { size: 18 }), " TRUEMUSTER"] }), _jsxs("div", { style: { marginTop: Spacing.xxl }, children: [_jsx("h1", { style: {
                                    fontSize: '26px',
                                    fontWeight: 700,
                                    color: Colors.textPrimary,
                                    lineHeight: 1.25,
                                }, children: "Institutional Attendance & Verification" }), _jsx("p", { style: {
                                    marginTop: Spacing.sm,
                                    fontSize: '15px',
                                    color: Colors.textSecondary,
                                    lineHeight: 1.45,
                                }, children: "Sign in with your approved university enrollment credentials to verify class presence." })] }), _jsxs("form", { onSubmit: handleSubmit, style: { marginTop: Spacing.xxl }, children: [error && (_jsx("div", { style: {
                                    backgroundColor: Colors.statusErrorBg,
                                    color: Colors.statusError,
                                    padding: Spacing.md,
                                    borderRadius: Radii.control,
                                    marginBottom: Spacing.md,
                                    fontSize: '14px',
                                    border: `1px solid ${Colors.statusError}30`,
                                }, children: error })), _jsxs("div", { style: { marginBottom: Spacing.md }, children: [_jsx("label", { style: {
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: Colors.textPrimary,
                                            marginBottom: 6,
                                        }, children: "Enrollment ID / Roll No." }), _jsxs("div", { style: {
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }, children: [_jsx(User, { size: 18, style: { position: 'absolute', left: 14, color: Colors.textSecondary } }), _jsx("input", { type: "text", value: enrollmentId, onChange: (e) => setEnrollmentId(e.target.value), required: true, style: {
                                                    width: '100%',
                                                    height: Spacing.minTouchTarget,
                                                    paddingLeft: 42,
                                                    paddingRight: 14,
                                                    fontSize: '15px',
                                                    borderRadius: Radii.control,
                                                    border: `1px solid ${Colors.borderDefault}`,
                                                    backgroundColor: Colors.surfaceCard,
                                                    color: Colors.textPrimary,
                                                    outline: 'none',
                                                } })] })] }), _jsxs("div", { style: { marginBottom: Spacing.lg }, children: [_jsx("label", { style: {
                                            display: 'block',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: Colors.textPrimary,
                                            marginBottom: 6,
                                        }, children: "Password / Access Token" }), _jsxs("div", { style: {
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                        }, children: [_jsx(Lock, { size: 18, style: { position: 'absolute', left: 14, color: Colors.textSecondary } }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, style: {
                                                    width: '100%',
                                                    height: Spacing.minTouchTarget,
                                                    paddingLeft: 42,
                                                    paddingRight: 14,
                                                    fontSize: '15px',
                                                    borderRadius: Radii.control,
                                                    border: `1px solid ${Colors.borderDefault}`,
                                                    backgroundColor: Colors.surfaceCard,
                                                    color: Colors.textPrimary,
                                                    outline: 'none',
                                                } })] })] }), _jsx("button", { type: "submit", disabled: isLoading, style: {
                                    width: '100%',
                                    height: Spacing.minTouchTarget,
                                    backgroundColor: Colors.brandNavy,
                                    color: Colors.textInverse,
                                    borderRadius: Radii.button,
                                    fontSize: '16px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.15s ease',
                                }, children: isLoading ? 'Verifying with Roster...' : (_jsxs(_Fragment, { children: ["Sign In to Account ", _jsx(ArrowRight, { size: 18 })] })) })] })] }), _jsx("div", { style: {
                    marginTop: Spacing.xxl,
                    paddingTop: Spacing.md,
                    borderTop: `1px solid ${Colors.borderDefault}`,
                    fontSize: '12px',
                    color: Colors.textSecondary,
                    textAlign: 'center',
                    lineHeight: 1.4,
                }, children: "Authorized student access only. Protected by cryptographic hardware binding and campus geofencing policy." })] }));
};
