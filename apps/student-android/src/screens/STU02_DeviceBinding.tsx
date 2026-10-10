import React, { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { Smartphone, Camera, MapPin, Fingerprint, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { authenticateNativeBiometric } from '../services/nativeBiometric';

interface Props {
  onSuccess: () => void;
}

export const STU02_DeviceBinding: React.FC<Props> = ({ onSuccess }) => {
  const [isBinding, setIsBinding] = useState(false);
  const [isBound, setIsBound] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const handleBindDevice = async () => {
    setIsBinding(true);
    setEnrollError(null);

    // Prompt user to authorize cryptographic hardware binding
    const auth = await authenticateNativeBiometric({
      title: 'Authorize Device Binding',
      subtitle: 'Enroll this Android device for Alice Sharma',
      description: 'Touch sensor or enter PIN to bind device key in Keystore',
    });

    if (auth.isNative && !auth.authenticated) {
      setIsBinding(false);
      setEnrollError(auth.errorMessage || 'Device authorization was cancelled.');
      return;
    }

    setTimeout(() => {
      setIsBinding(false);
      setIsBound(true);
      setTimeout(() => {
        onSuccess();
      }, 700);
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: Spacing.xl,
      backgroundColor: Colors.surfaceCanvas,
    }}>
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: Spacing.sm,
          color: Colors.brandNavy,
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '0.04em',
        }}>
          <ShieldCheck size={18} /> STEP 2 OF 2: DEVICE ENROLLMENT
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: Colors.textPrimary,
          marginTop: Spacing.md,
          lineHeight: 1.25,
        }}>
          Hardware Device Binding & Permissions
        </h1>
        <p style={{
          fontSize: '14px',
          color: Colors.textSecondary,
          marginTop: Spacing.sm,
          lineHeight: 1.45,
        }}>
          TRUEMUSTER mandates a strict <strong>single active Android device policy</strong> per student to prevent proxy attendance.
        </p>

        {/* Card Explanations */}
        <div style={{ marginTop: Spacing.xl, display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
          <div style={{
            backgroundColor: Colors.surfaceCard,
            padding: Spacing.md,
            borderRadius: Radii.card,
            border: `1px solid ${Colors.borderDefault}`,
            display: 'flex',
            gap: Spacing.md,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: Radii.control,
              backgroundColor: Colors.brandBlueSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.brandNavy,
              flexShrink: 0,
            }}>
              <Smartphone size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: Colors.textPrimary }}>
                Android Keystore Key Pair
              </h3>
              <p style={{ fontSize: '13px', color: Colors.textSecondary, marginTop: 4, lineHeight: 1.4 }}>
                A hardware-backed cryptographic key will be registered. Device replacement requires formal IT administrator recovery.
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: Colors.surfaceCard,
            padding: Spacing.md,
            borderRadius: Radii.card,
            border: `1px solid ${Colors.borderDefault}`,
            display: 'flex',
            gap: Spacing.md,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: Radii.control,
              backgroundColor: Colors.brandBlueSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.brandNavy,
              flexShrink: 0,
            }}>
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: Colors.textPrimary }}>
                High-Accuracy GPS (100m Geofence)
              </h3>
              <p style={{ fontSize: '13px', color: Colors.textSecondary, marginTop: 4, lineHeight: 1.4 }}>
                Location is acquired only during active check-in to confirm you are within 100 metres of the assigned classroom anchor.
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: Colors.surfaceCard,
            padding: Spacing.md,
            borderRadius: Radii.card,
            border: `1px solid ${Colors.borderDefault}`,
            display: 'flex',
            gap: Spacing.md,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: Radii.control,
              backgroundColor: Colors.brandBlueSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.brandNavy,
              flexShrink: 0,
            }}>
              <Camera size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: Colors.textPrimary }}>
                Camera QR Scanner
              </h3>
              <p style={{ fontSize: '13px', color: Colors.textSecondary, marginTop: 4, lineHeight: 1.4 }}>
                Required to scan the teacher's rotating 90-second QR challenge. No photos or video frames are stored.
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: Colors.surfaceCard,
            padding: Spacing.md,
            borderRadius: Radii.card,
            border: `1px solid ${Colors.borderDefault}`,
            display: 'flex',
            gap: Spacing.md,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: Radii.control,
              backgroundColor: Colors.brandBlueSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: Colors.brandNavy,
              flexShrink: 0,
            }}>
              <Fingerprint size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: Colors.textPrimary }}>
                Android BiometricPrompt
              </h3>
              <p style={{ fontSize: '13px', color: Colors.textSecondary, marginTop: 4, lineHeight: 1.4 }}>
                Invokes your phone's native fingerprint or PIN lock screen to authorize the cryptographic attendance signature.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: Spacing.xl }}>
        {enrollError && (
          <div style={{
            backgroundColor: '#FEE2E2',
            color: '#B91C1C',
            padding: '10px 14px',
            borderRadius: Radii.control,
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: Spacing.md,
            border: '1px solid #F87171',
          }}>
            {enrollError}
          </div>
        )}
        <button
          onClick={handleBindDevice}
          disabled={isBinding || isBound}
          style={{
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
          }}
        >
          {isBinding ? 'Registering Device Key...' : isBound ? (
            <><CheckCircle2 size={20} /> Device Bound Successfully</>
          ) : (
            'Enroll & Authorize This Device'
          )}
        </button>
      </div>
    </div>
  );
};
