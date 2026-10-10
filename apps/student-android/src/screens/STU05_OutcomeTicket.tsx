import React from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { AttendanceRecord } from '@truemuster/domain-contracts';
import { CheckCircle2, AlertTriangle, ArrowLeft, Clock, MapPin, ShieldCheck, User } from 'lucide-react';

interface Props {
  isSuccess: boolean;
  record?: AttendanceRecord;
  failureReason?: string;
  onReturnHome: () => void;
}

export const STU05_OutcomeTicket: React.FC<Props> = ({
  isSuccess,
  record,
  failureReason,
  onReturnHome,
}) => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: Colors.surfaceCanvas,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: Spacing.xl,
    }}>
      <div>
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: Spacing.sm,
          color: Colors.brandNavy,
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '0.04em',
          marginBottom: Spacing.xl,
        }}>
          <ShieldCheck size={18} /> VERIFICATION RECEIPT
        </div>

        {/* Outcome Card */}
        {isSuccess ? (
          <div style={{
            backgroundColor: Colors.surfaceCard,
            borderRadius: Radii.card,
            padding: Spacing.xl,
            border: `1px solid ${Colors.statusSuccess}`,
            boxShadow: '0 8px 24px rgba(22, 118, 71, 0.08)',
            textAlign: 'center',
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: Colors.statusSuccessBg,
              color: Colors.statusSuccess,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <CheckCircle2 size={36} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 700, color: Colors.textPrimary }}>
              Confirmed Present
            </h2>
            <p style={{ fontSize: '14px', color: Colors.textSecondary, marginTop: 4 }}>
              Cryptographically committed to institutional ledger
            </p>

            {/* Ticket Breakdown */}
            <div style={{
              marginTop: Spacing.xl,
              paddingTop: Spacing.base,
              borderTop: `1px dashed ${Colors.borderDefault}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              textAlign: 'left',
              fontSize: '13px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: Colors.textSecondary }}>Course:</span>
                <span style={{ fontWeight: 600, color: Colors.textPrimary }}>
                  {record?.courseCode || 'CS401'} — {record?.courseName || 'Distributed Systems'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: Colors.textSecondary }}>Student:</span>
                <span style={{ fontWeight: 600, color: Colors.textPrimary }}>
                  {record?.studentName || 'Alice Sharma'} ({record?.enrollmentId || '2023-CS-042'})
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: Colors.textSecondary }}>Verified Time:</span>
                <span style={{ fontWeight: 600, color: Colors.textPrimary }}>
                  {new Date(record?.verifiedAt || Date.now()).toLocaleTimeString()}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: Colors.textSecondary }}>Verification Method:</span>
                <span style={{ fontWeight: 700, color: Colors.statusSuccess }}>
                  QR + Facial Liveness + Hardware Fingerprint
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: Colors.textSecondary }}>Ledger Token:</span>
                <span style={{ fontWeight: 600, fontFamily: 'monospace', color: Colors.textSecondary }}>
                  {record?.id || 'REC-CONFIRMED-8891'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: Colors.surfaceCard,
            borderRadius: Radii.card,
            padding: Spacing.xl,
            border: `1px solid ${Colors.statusError}`,
            boxShadow: '0 8px 24px rgba(180, 35, 44, 0.08)',
            textAlign: 'center',
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              backgroundColor: Colors.statusErrorBg,
              color: Colors.statusError,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <AlertTriangle size={36} />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 700, color: Colors.textPrimary }}>
              Check-in Unsuccessful
            </h2>
            <p style={{
              fontSize: '14px',
              color: Colors.statusError,
              marginTop: 6,
              fontWeight: 500,
              lineHeight: 1.45,
            }}>
              {failureReason || 'Verification check failed to satisfy security policy.'}
            </p>

            <div style={{
              marginTop: Spacing.xl,
              padding: Spacing.md,
              backgroundColor: Colors.surfaceSubtle,
              borderRadius: Radii.control,
              textAlign: 'left',
              fontSize: '13px',
              color: Colors.textSecondary,
              lineHeight: 1.45,
            }}>
              <strong>Guidance:</strong> A failed check does not constitute an accusation. Ensure you are inside the classroom and ask the teacher for the updated 90-second QR projection.
            </div>
          </div>
        )}
      </div>

      {/* Return to Home Driver */}
      <div style={{ marginTop: Spacing.xxl }}>
        <button
          onClick={onReturnHome}
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
          }}
        >
          <ArrowLeft size={18} /> Return to Student Schedule
        </button>
      </div>
    </div>
  );
};
