import React from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { StudentProfile } from '@truemuster/domain-contracts';
import { ShieldCheck, Smartphone, CheckCircle2, RefreshCw, Key, Info, LogOut } from 'lucide-react';

interface Props {
  student: StudentProfile;
  onSignOut: () => void;
}

export const STU07_Profile: React.FC<Props> = ({ student, onSignOut }) => {
  return (
    <div style={{
      padding: Spacing.md,
      paddingBottom: 90,
      backgroundColor: Colors.surfaceCanvas,
      minHeight: '100vh',
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: Colors.textPrimary, marginTop: Spacing.sm, marginBottom: 4 }}>
        Student Identity & Security
      </h2>
      <p style={{ fontSize: '13px', color: Colors.textSecondary, marginBottom: Spacing.lg }}>
        Active hardware device bindings and security credentials
      </p>

      {/* Student Identity Card */}
      <div style={{
        backgroundColor: Colors.surfaceCard,
        borderRadius: Radii.card,
        padding: Spacing.base,
        border: `1px solid ${Colors.borderDefault}`,
        marginBottom: Spacing.md,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
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
          }}>
            AS
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: Colors.textPrimary }}>
              {student.fullName}
            </h3>
            <span style={{ fontSize: '13px', color: Colors.textSecondary }}>
              {student.enrollmentId} · {student.department}
            </span>
          </div>
        </div>
      </div>

      {/* Bound Hardware Security Card */}
      <div style={{
        backgroundColor: Colors.surfaceCard,
        borderRadius: Radii.card,
        padding: Spacing.base,
        border: `1px solid ${Colors.borderDefault}`,
        marginBottom: Spacing.md,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: Spacing.sm }}>
          <Smartphone size={18} color={Colors.brandNavy} />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: Colors.textPrimary }}>
            ACTIVE REGISTERED ANDROID DEVICE
          </h4>
        </div>

        <div style={{
          backgroundColor: Colors.surfaceSubtle,
          padding: Spacing.md,
          borderRadius: Radii.control,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          fontSize: '13px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: Colors.textSecondary }}>Device Name:</span>
            <span style={{ fontWeight: 600 }}>Google Pixel 7 (Android 14)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: Colors.textSecondary }}>Keystore Token:</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>dev-pixel7-hw-01</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: Colors.textSecondary }}>Binding Status:</span>
            <span style={{ color: Colors.statusSuccess, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={14} /> Active & Verified
            </span>
          </div>
        </div>

        <div style={{
          marginTop: Spacing.md,
          fontSize: '12px',
          color: Colors.textSecondary,
          lineHeight: 1.4,
        }}>
          To transfer attendance authorization to a new phone, contact the College IT Administration to request device replacement and binding revocation.
        </div>
      </div>

      {/* Sensor & Hardware Health */}
      <div style={{
        backgroundColor: Colors.surfaceCard,
        borderRadius: Radii.card,
        padding: Spacing.base,
        border: `1px solid ${Colors.borderDefault}`,
        marginBottom: Spacing.lg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: Spacing.sm }}>
          <ShieldCheck size={18} color={Colors.brandNavy} />
          <h4 style={{ fontSize: '14px', fontWeight: 700, color: Colors.textPrimary }}>
            HARDWARE VERIFICATION HEALTH
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Fused Location GPS Provider</span>
            <span style={{ color: Colors.statusSuccess, fontWeight: 600 }}>Pass (Accuracy: 12m)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>AndroidX BiometricPrompt</span>
            <span style={{ color: Colors.statusSuccess, fontWeight: 600 }}>Enrolled (Strong Class 3)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>CameraX Scanner Frame</span>
            <span style={{ color: Colors.statusSuccess, fontWeight: 600 }}>Active (QR Barcode Ready)</span>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={onSignOut}
        style={{
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
        }}
      >
        <LogOut size={18} /> Sign Out of Account
      </button>
    </div>
  );
};
