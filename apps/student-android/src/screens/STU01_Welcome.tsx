import React, { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { ShieldCheck, ArrowRight, Lock, User } from 'lucide-react';

interface Props {
  onSuccess: () => void;
}

export const STU01_Welcome: React.FC<Props> = ({ onSuccess }) => {
  const [enrollmentId, setEnrollmentId] = useState('2023-CS-042');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      if (enrollmentId.trim() === '2023-CS-042') {
        onSuccess();
      } else {
        setError('Enrollment record not found in approved institutional roster.');
      }
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
      {/* Top Brand Anchor */}
      <div>
        <div style={{
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
        }}>
          <ShieldCheck size={18} /> TRUEMUSTER
        </div>

        <div style={{ marginTop: Spacing.xxl }}>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 700,
            color: Colors.textPrimary,
            lineHeight: 1.25,
          }}>
            Institutional Attendance & Verification
          </h1>
          <p style={{
            marginTop: Spacing.sm,
            fontSize: '15px',
            color: Colors.textSecondary,
            lineHeight: 1.45,
          }}>
            Sign in with your approved university enrollment credentials to verify class presence.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ marginTop: Spacing.xxl }}>
          {error && (
            <div style={{
              backgroundColor: Colors.statusErrorBg,
              color: Colors.statusError,
              padding: Spacing.md,
              borderRadius: Radii.control,
              marginBottom: Spacing.md,
              fontSize: '14px',
              border: `1px solid ${Colors.statusError}30`,
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: Spacing.md }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: Colors.textPrimary,
              marginBottom: 6,
            }}>
              Enrollment ID / Roll No.
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <User size={18} style={{ position: 'absolute', left: 14, color: Colors.textSecondary }} />
              <input
                type="text"
                value={enrollmentId}
                onChange={(e) => setEnrollmentId(e.target.value)}
                required
                style={{
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
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: Spacing.lg }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: Colors.textPrimary,
              marginBottom: 6,
            }}>
              Password / Access Token
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Lock size={18} style={{ position: 'absolute', left: 14, color: Colors.textSecondary }} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
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
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
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
            }}
          >
            {isLoading ? 'Verifying with Roster...' : (
              <>Sign In to Account <ArrowRight size={18} /></>
            )}
          </button>
        </form>
      </div>

      {/* Institutional Safeguards Footer */}
      <div style={{
        marginTop: Spacing.xxl,
        paddingTop: Spacing.md,
        borderTop: `1px solid ${Colors.borderDefault}`,
        fontSize: '12px',
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 1.4,
      }}>
        Authorized student access only. Protected by cryptographic hardware binding and campus geofencing policy.
      </div>
    </div>
  );
};
