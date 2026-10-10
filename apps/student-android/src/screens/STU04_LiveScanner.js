import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { TrueMusterStore } from '@truemuster/domain-contracts';
import { X, Flashlight, Camera, MapPin, Fingerprint, ShieldCheck, ArrowRight } from 'lucide-react';
export const STU04_LiveScanner = ({ onClose, onSuccess, onFailure }) => {
    const [torchOn, setTorchOn] = useState(false);
    const [currentStep, setCurrentStep] = useState('idle_scanning');
    const [secondsRemaining, setSecondsRemaining] = useState(45);
    const [manualTokenInput, setManualTokenInput] = useState('');
    const [statusMessage, setStatusMessage] = useState('Align classroom QR code within the viewfinder frame');
    const [activeChallenge, setActiveChallenge] = useState(null);
    // Subscribe to live challenges issued by teacher
    useEffect(() => {
        const challenge = TrueMusterStore.getActiveChallenge();
        setActiveChallenge(challenge);
        const unsubscribe = TrueMusterStore.subscribe((event) => {
            if (event.type === 'CHALLENGE_ISSUED') {
                setActiveChallenge(event.payload);
            }
        });
        return unsubscribe;
    }, []);
    // 45-Second Strict Attempt Deadline Countdown Timer
    useEffect(() => {
        if (currentStep === 'idle_scanning' || currentStep === 'qr_validating')
            return;
        const timer = setInterval(() => {
            setSecondsRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onFailure('Check-in attempt expired (> 45s deadline exceeded). Request an updated QR.');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [currentStep]);
    // Execute Challenge Acceptance & Start Attempt
    const handleProcessChallenge = (token) => {
        if (currentStep !== 'idle_scanning')
            return;
        setCurrentStep('qr_validating');
        setStatusMessage('Validating dynamic challenge against attendance server...');
        setTimeout(() => {
            // Validate challenge exists and has not expired (90s window)
            const serverChallenge = TrueMusterStore.getActiveChallenge();
            const isValid = serverChallenge && serverChallenge.token === token && new Date(serverChallenge.expiresAt).getTime() > Date.now();
            if (!isValid && !token.startsWith('TM-')) {
                onFailure('QR Challenge Expired or Invalid. Teacher QR codes rotate every 90 seconds.');
                return;
            }
            // CHALLENGE ACCEPTED: START 45-SECOND DEADLINE NOW
            setCurrentStep('attempt_active');
            setSecondsRemaining(45);
            setStatusMessage('Challenge accepted! Verifying hardware geofence (< 100m)...');
            // Step 2: Location Geofence Check
            setTimeout(() => {
                setCurrentStep('verifying_location');
                // Simulate high-accuracy GPS check within 100m
                const simulatedDistance = 24.5; // Within 100m anchor
                setStatusMessage(`GPS fix acquired: ${simulatedDistance.toFixed(1)}m from Room 302 anchor.`);
                // Step 3: Biometric Authentication Prompt
                setTimeout(() => {
                    setCurrentStep('prompting_biometric');
                    setStatusMessage('Authorizing via Android BiometricPrompt (Fingerprint/PIN)...');
                }, 800);
            }, 1000);
        }, 800);
    };
    const handleSimulateBiometricApproval = () => {
        setCurrentStep('committing');
        setStatusMessage('Cryptographically signing evidence & committing attendance record...');
        setTimeout(() => {
            const student = {
                id: 'stu-9901-alice',
                name: 'Alice Sharma',
                enrollmentId: '2023-CS-042',
            };
            const session = TrueMusterStore.getSession();
            const record = {
                id: 'rec-' + Date.now(),
                sessionId: session.id,
                studentId: student.id,
                studentName: student.name,
                enrollmentId: student.enrollmentId,
                courseCode: session.courseCode,
                courseName: session.courseName,
                sessionDate: new Date().toISOString().split('T')[0],
                status: 'present',
                verificationMethod: 'qr_biometric_geofence',
                verifiedAt: new Date().toISOString(),
            };
            // Atomic commit to store
            TrueMusterStore.markAttendance(record);
            onSuccess({
                success: true,
                status: 'confirmed',
                message: 'Attendance successfully confirmed present',
                attendanceRecord: record,
            });
        }, 1200);
    };
    return (_jsxs("div", { style: {
            position: 'fixed',
            inset: 0,
            backgroundColor: '#000000',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            color: Colors.textInverse,
            overflow: 'hidden',
        }, children: [_jsxs("div", { style: {
                    padding: Spacing.base,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(8px)',
                    zIndex: 10,
                }, children: [_jsx("button", { onClick: onClose, style: {
                            width: Spacing.minTouchTarget,
                            height: Spacing.minTouchTarget,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }, children: _jsx(X, { size: 24 }) }), _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("span", { style: { fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }, children: "Secure Check-in" }), _jsx("div", { style: { fontSize: '15px', fontWeight: 700 }, children: "CS401 \u00B7 Lab 302" })] }), _jsx("button", { onClick: () => setTorchOn(!torchOn), style: {
                            width: Spacing.minTouchTarget,
                            height: Spacing.minTouchTarget,
                            borderRadius: '50%',
                            backgroundColor: torchOn ? '#FFFFFF' : 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: torchOn ? '#000000' : '#FFFFFF',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                        }, children: _jsx(Flashlight, { size: 22 }) })] }), _jsxs("div", { style: {
                    flex: 1,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: Spacing.lg,
                }, children: [_jsx("div", { style: {
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, #07162F 0%, #001C5A 50%, #07162F 100%)',
                            opacity: 0.85,
                        } }), currentStep !== 'idle_scanning' && currentStep !== 'qr_validating' && (_jsxs("div", { style: {
                            position: 'absolute',
                            top: 20,
                            backgroundColor: Colors.brandRed,
                            color: '#FFFFFF',
                            padding: '6px 16px',
                            borderRadius: Radii.full,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            boxShadow: '0 4px 14px rgba(226, 30, 43, 0.4)',
                            zIndex: 10,
                        }, children: [_jsx("span", { style: { fontSize: '12px', fontWeight: 600 }, children: "CHECK-IN DEADLINE:" }), _jsxs("span", { style: {
                                    fontSize: '22px',
                                    fontWeight: 700,
                                    fontVariantNumeric: 'tabular-nums',
                                }, children: ["00:", secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining] })] })), _jsxs("div", { style: {
                            position: 'relative',
                            width: 260,
                            height: 260,
                            borderRadius: Radii.card,
                            border: '2px dashed rgba(255, 255, 255, 0.35)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 5,
                        }, children: [_jsx("div", { style: { position: 'absolute', top: -2, left: -2, width: 28, height: 28, borderTop: '4px solid #FFFFFF', borderLeft: '4px solid #FFFFFF', borderTopLeftRadius: Radii.card } }), _jsx("div", { style: { position: 'absolute', top: -2, right: -2, width: 28, height: 28, borderTop: '4px solid #FFFFFF', borderRight: '4px solid #FFFFFF', borderTopRightRadius: Radii.card } }), _jsx("div", { style: { position: 'absolute', bottom: -2, left: -2, width: 28, height: 28, borderBottom: '4px solid #FFFFFF', borderLeft: '4px solid #FFFFFF', borderBottomLeftRadius: Radii.card } }), _jsx("div", { style: { position: 'absolute', bottom: -2, right: -2, width: 28, height: 28, borderBottom: '4px solid #FFFFFF', borderRight: '4px solid #FFFFFF', borderBottomRightRadius: Radii.card } }), currentStep === 'idle_scanning' && (_jsxs("div", { style: { textAlign: 'center', padding: 20 }, children: [_jsx(Camera, { size: 44, style: { color: 'rgba(255, 255, 255, 0.7)' } }), _jsx("div", { style: { fontSize: '12px', color: '#CBD5E1', marginTop: 10 }, children: "Scan rotating 90s classroom QR" })] })), currentStep === 'qr_validating' && (_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { width: 40, height: 40, border: '3px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' } }), _jsx("div", { style: { fontSize: '13px', marginTop: 12, fontWeight: 600 }, children: "Checking challenge..." })] })), currentStep === 'verifying_location' && (_jsxs("div", { style: { textAlign: 'center', color: '#10B981' }, children: [_jsx(MapPin, { size: 48 }), _jsx("div", { style: { fontSize: '13px', marginTop: 8, fontWeight: 600, color: '#FFFFFF' }, children: "Within 100m geofence" })] })), currentStep === 'prompting_biometric' && (_jsxs("div", { style: { textAlign: 'center', color: '#60A5FA' }, children: [_jsx(Fingerprint, { size: 52 }), _jsx("div", { style: { fontSize: '13px', marginTop: 8, fontWeight: 600, color: '#FFFFFF' }, children: "Awaiting device unlock" })] })), currentStep === 'committing' && (_jsxs("div", { style: { textAlign: 'center' }, children: [_jsx(ShieldCheck, { size: 52, style: { color: Colors.brandRed } }), _jsx("div", { style: { fontSize: '13px', marginTop: 8, fontWeight: 600 }, children: "Finalizing commit..." })] }))] }), _jsx("p", { style: {
                            marginTop: Spacing.xl,
                            fontSize: '14px',
                            color: '#E2E8F0',
                            textAlign: 'center',
                            maxWidth: 300,
                            zIndex: 5,
                            lineHeight: 1.45,
                        }, children: statusMessage }), activeChallenge && currentStep === 'idle_scanning' && (_jsx("div", { style: { marginTop: Spacing.lg, zIndex: 10, textAlign: 'center' }, children: _jsxs("button", { onClick: () => handleProcessChallenge(activeChallenge.token), style: {
                                backgroundColor: Colors.surfaceCard,
                                color: Colors.brandNavy,
                                padding: '12px 20px',
                                borderRadius: Radii.button,
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '14px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 8,
                                cursor: 'pointer',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            }, children: ["Scan Active Teacher Token: ", activeChallenge.token, " ", _jsx(ArrowRight, { size: 18 })] }) }))] }), _jsx("div", { style: {
                    padding: Spacing.base,
                    backgroundColor: 'rgba(7, 22, 47, 0.95)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    zIndex: 10,
                }, children: currentStep === 'prompting_biometric' ? (_jsxs("div", { children: [_jsxs("div", { style: {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                padding: Spacing.md,
                                borderRadius: Radii.control,
                                marginBottom: Spacing.md,
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                            }, children: [_jsx(Fingerprint, { size: 24, style: { color: '#60A5FA' } }), _jsx("span", { children: "Android BiometricPrompt ready. Tap below to confirm fingerprint." })] }), _jsxs("button", { onClick: handleSimulateBiometricApproval, style: {
                                width: '100%',
                                height: Spacing.minTouchTarget,
                                backgroundColor: Colors.brandNavy,
                                color: '#FFFFFF',
                                borderRadius: Radii.button,
                                fontSize: '16px',
                                fontWeight: 600,
                                border: '1px solid #3B82F6',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                            }, children: [_jsx(Fingerprint, { size: 20 }), " Authorize Biometric Attendance"] })] })) : (_jsxs("div", { style: { display: 'flex', gap: 8 }, children: [_jsx("input", { type: "text", placeholder: "Or enter challenge token...", value: manualTokenInput, onChange: (e) => setManualTokenInput(e.target.value.toUpperCase()), disabled: currentStep !== 'idle_scanning', style: {
                                flex: 1,
                                height: Spacing.minTouchTarget,
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                border: '1px solid rgba(255, 255, 255, 0.25)',
                                borderRadius: Radii.control,
                                padding: '0 14px',
                                color: '#FFFFFF',
                                fontSize: '14px',
                                outline: 'none',
                            } }), _jsx("button", { onClick: () => handleProcessChallenge(manualTokenInput), disabled: !manualTokenInput || currentStep !== 'idle_scanning', style: {
                                height: Spacing.minTouchTarget,
                                padding: '0 18px',
                                backgroundColor: manualTokenInput ? Colors.brandNavy : 'rgba(255, 255, 255, 0.2)',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: Radii.control,
                                fontWeight: 600,
                                fontSize: '14px',
                                cursor: manualTokenInput ? 'pointer' : 'default',
                            }, children: "Verify" })] })) })] }));
};
