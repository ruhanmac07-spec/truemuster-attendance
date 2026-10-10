import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { ShieldCheck, Smartphone, CheckCircle2, LogOut } from 'lucide-react';
export const STU07_Profile = ({ student, onSignOut }) => {
    return (_jsxs("div", { style: {
            padding: Spacing.md,
            paddingBottom: 90,
            backgroundColor: Colors.surfaceCanvas,
            minHeight: '100vh',
        }, children: [_jsx("h2", { style: { fontSize: '20px', fontWeight: 700, color: Colors.textPrimary, marginTop: Spacing.sm, marginBottom: 4 }, children: "Student Identity & Security" }), _jsx("p", { style: { fontSize: '13px', color: Colors.textSecondary, marginBottom: Spacing.lg }, children: "Active hardware device bindings and security credentials" }), _jsx("div", { style: {
                    backgroundColor: Colors.surfaceCard,
                    borderRadius: Radii.card,
                    padding: Spacing.base,
                    border: `1px solid ${Colors.borderDefault}`,
                    marginBottom: Spacing.md,
                }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 14 }, children: [_jsx("div", { style: {
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                backgroundColor: Colors.brandNavy,
                                color: Colors.textInverse,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '18px',
                                fontWeight: 700,
                            }, children: "AS" }), _jsxs("div", { children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: 700, color: Colors.textPrimary }, children: student.fullName }), _jsxs("span", { style: { fontSize: '13px', color: Colors.textSecondary }, children: [student.enrollmentId, " \u00B7 ", student.department] })] })] }) }), _jsxs("div", { style: {
                    backgroundColor: Colors.surfaceCard,
                    borderRadius: Radii.card,
                    padding: Spacing.base,
                    border: `1px solid ${Colors.borderDefault}`,
                    marginBottom: Spacing.md,
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: Spacing.sm }, children: [_jsx(Smartphone, { size: 18, color: Colors.brandNavy }), _jsx("h4", { style: { fontSize: '14px', fontWeight: 700, color: Colors.textPrimary }, children: "ACTIVE REGISTERED ANDROID DEVICE" })] }), _jsxs("div", { style: {
                            backgroundColor: Colors.surfaceSubtle,
                            padding: Spacing.md,
                            borderRadius: Radii.control,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            fontSize: '13px',
                        }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("span", { style: { color: Colors.textSecondary }, children: "Device Name:" }), _jsx("span", { style: { fontWeight: 600 }, children: "Google Pixel 7 (Android 14)" })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("span", { style: { color: Colors.textSecondary }, children: "Keystore Token:" }), _jsx("span", { style: { fontFamily: 'monospace', fontWeight: 600 }, children: "dev-pixel7-hw-01" })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: [_jsx("span", { style: { color: Colors.textSecondary }, children: "Binding Status:" }), _jsxs("span", { style: { color: Colors.statusSuccess, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }, children: [_jsx(CheckCircle2, { size: 14 }), " Active & Verified"] })] })] }), _jsx("div", { style: {
                            marginTop: Spacing.md,
                            fontSize: '12px',
                            color: Colors.textSecondary,
                            lineHeight: 1.4,
                        }, children: "To transfer attendance authorization to a new phone, contact the College IT Administration to request device replacement and binding revocation." })] }), _jsxs("div", { style: {
                    backgroundColor: Colors.surfaceCard,
                    borderRadius: Radii.card,
                    padding: Spacing.base,
                    border: `1px solid ${Colors.borderDefault}`,
                    marginBottom: Spacing.lg,
                }, children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: Spacing.sm }, children: [_jsx(ShieldCheck, { size: 18, color: Colors.brandNavy }), _jsx("h4", { style: { fontSize: '14px', fontWeight: 700, color: Colors.textPrimary }, children: "HARDWARE VERIFICATION HEALTH" })] }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 8, fontSize: '13px' }, children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { children: "Fused Location GPS Provider" }), _jsx("span", { style: { color: Colors.statusSuccess, fontWeight: 600 }, children: "Pass (Accuracy: 12m)" })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { children: "AndroidX BiometricPrompt" }), _jsx("span", { style: { color: Colors.statusSuccess, fontWeight: 600 }, children: "Enrolled (Strong Class 3)" })] }), _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsx("span", { children: "CameraX Scanner Frame" }), _jsx("span", { style: { color: Colors.statusSuccess, fontWeight: 600 }, children: "Active (QR Barcode Ready)" })] })] })] }), _jsxs("button", { onClick: onSignOut, style: {
                    width: '100%',
                    height: Spacing.minTouchTarget,
                    backgroundColor: Colors.surfaceCard,
                    color: Colors.statusError,
                    borderRadius: Radii.button,
                    border: `1px solid ${Colors.statusError}40`,
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                }, children: [_jsx(LogOut, { size: 18 }), " Sign Out of Account"] })] }));
};
