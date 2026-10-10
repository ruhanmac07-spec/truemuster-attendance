import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { Smartphone, Camera, MapPin, Fingerprint, ShieldCheck, CheckCircle2 } from 'lucide-react';
export const STU02_DeviceBinding = ({ onSuccess }) => {
    const [isBinding, setIsBinding] = useState(false);
    const [isBound, setIsBound] = useState(false);
    const handleBindDevice = () => {
        setIsBinding(true);
        setTimeout(() => {
            setIsBinding(false);
            setIsBound(true);
            setTimeout(() => {
                onSuccess();
            }, 700);
        }, 1000);
    };
    return (_jsxs("div", { style: {
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: Spacing.xl,
            backgroundColor: Colors.surfaceCanvas,
        }, children: [_jsxs("div", { children: [_jsxs("div", { style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: Spacing.sm,
                            color: Colors.brandNavy,
                            fontWeight: 700,
                            fontSize: '13px',
                            letterSpacing: '0.04em',
                        }, children: [_jsx(ShieldCheck, { size: 18 }), " STEP 2 OF 2: DEVICE ENROLLMENT"] }), _jsx("h1", { style: {
                            fontSize: '24px',
                            fontWeight: 700,
                            color: Colors.textPrimary,
                            marginTop: Spacing.md,
                            lineHeight: 1.25,
                        }, children: "Hardware Device Binding & Permissions" }), _jsxs("p", { style: {
                            fontSize: '14px',
                            color: Colors.textSecondary,
                            marginTop: Spacing.sm,
                            lineHeight: 1.45,
                        }, children: ["TRUEMUSTER mandates a strict ", _jsx("strong", { children: "single active Android device policy" }), " per student to prevent proxy attendance."] }), _jsxs("div", { style: { marginTop: Spacing.xl, display: 'flex', flexDirection: 'column', gap: Spacing.md }, children: [_jsxs("div", { style: {
                                    backgroundColor: Colors.surfaceCard,
                                    padding: Spacing.md,
                                    borderRadius: Radii.card,
                                    border: `1px solid ${Colors.borderDefault}`,
                                    display: 'flex',
                                    gap: Spacing.md,
                                }, children: [_jsx("div", { style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: Radii.control,
                                            backgroundColor: Colors.brandBlueSoft,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: Colors.brandNavy,
                                            flexShrink: 0,
                                        }, children: _jsx(Smartphone, { size: 20 }) }), _jsxs("div", { children: [_jsx("h3", { style: { fontSize: '15px', fontWeight: 600, color: Colors.textPrimary }, children: "Android Keystore Key Pair" }), _jsx("p", { style: { fontSize: '13px', color: Colors.textSecondary, marginTop: 4, lineHeight: 1.4 }, children: "A hardware-backed cryptographic key will be registered. Device replacement requires formal IT administrator recovery." })] })] }), _jsxs("div", { style: {
                                    backgroundColor: Colors.surfaceCard,
                                    padding: Spacing.md,
                                    borderRadius: Radii.card,
                                    border: `1px solid ${Colors.borderDefault}`,
                                    display: 'flex',
                                    gap: Spacing.md,
                                }, children: [_jsx("div", { style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: Radii.control,
                                            backgroundColor: Colors.brandBlueSoft,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: Colors.brandNavy,
                                            flexShrink: 0,
                                        }, children: _jsx(MapPin, { size: 20 }) }), _jsxs("div", { children: [_jsx("h3", { style: { fontSize: '15px', fontWeight: 600, color: Colors.textPrimary }, children: "High-Accuracy GPS (100m Geofence)" }), _jsx("p", { style: { fontSize: '13px', color: Colors.textSecondary, marginTop: 4, lineHeight: 1.4 }, children: "Location is acquired only during active check-in to confirm you are within 100 metres of the assigned classroom anchor." })] })] }), _jsxs("div", { style: {
                                    backgroundColor: Colors.surfaceCard,
                                    padding: Spacing.md,
                                    borderRadius: Radii.card,
                                    border: `1px solid ${Colors.borderDefault}`,
                                    display: 'flex',
                                    gap: Spacing.md,
                                }, children: [_jsx("div", { style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: Radii.control,
                                            backgroundColor: Colors.brandBlueSoft,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: Colors.brandNavy,
                                            flexShrink: 0,
                                        }, children: _jsx(Camera, { size: 20 }) }), _jsxs("div", { children: [_jsx("h3", { style: { fontSize: '15px', fontWeight: 600, color: Colors.textPrimary }, children: "Camera QR Scanner" }), _jsx("p", { style: { fontSize: '13px', color: Colors.textSecondary, marginTop: 4, lineHeight: 1.4 }, children: "Required to scan the teacher's rotating 90-second QR challenge. No photos or video frames are stored." })] })] }), _jsxs("div", { style: {
                                    backgroundColor: Colors.surfaceCard,
                                    padding: Spacing.md,
                                    borderRadius: Radii.card,
                                    border: `1px solid ${Colors.borderDefault}`,
                                    display: 'flex',
                                    gap: Spacing.md,
                                }, children: [_jsx("div", { style: {
                                            width: 40,
                                            height: 40,
                                            borderRadius: Radii.control,
                                            backgroundColor: Colors.brandBlueSoft,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: Colors.brandNavy,
                                            flexShrink: 0,
                                        }, children: _jsx(Fingerprint, { size: 20 }) }), _jsxs("div", { children: [_jsx("h3", { style: { fontSize: '15px', fontWeight: 600, color: Colors.textPrimary }, children: "Android BiometricPrompt" }), _jsx("p", { style: { fontSize: '13px', color: Colors.textSecondary, marginTop: 4, lineHeight: 1.4 }, children: "Invokes your phone's native fingerprint or PIN lock screen to authorize the cryptographic attendance signature." })] })] })] })] }), _jsx("div", { style: { marginTop: Spacing.xl }, children: _jsx("button", { onClick: handleBindDevice, disabled: isBinding || isBound, style: {
                        width: '100%',
                        height: Spacing.minTouchTarget,
                        backgroundColor: isBound ? Colors.statusSuccess : Colors.brandNavy,
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
                        transition: 'background-color 0.2s ease',
                    }, children: isBinding ? 'Registering Device Key...' : isBound ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle2, { size: 20 }), " Device Bound Successfully"] })) : ('Enroll & Authorize This Device') }) })] }));
};
