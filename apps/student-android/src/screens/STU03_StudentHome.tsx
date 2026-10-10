import React from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { AttendanceSession, StudentProfile } from '@truemuster/domain-contracts';
import { QrCode, Clock, MapPin, CheckCircle2, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';

interface Props {
  student: StudentProfile;
  session: AttendanceSession;
  isMarkedPresent: boolean;
  onOpenScanner: () => void;
  onOpenHistory: () => void;
}

export const STU03_StudentHome: React.FC<Props> = ({
  student,
  session,
  isMarkedPresent,
  onOpenScanner,
  onOpenHistory,
}) => {
  return (
    <div style={{
      padding: Spacing.md,
      paddingBottom: 90, // Room for bottom nav
      backgroundColor: Colors.surfaceCanvas,
      minHeight: '100vh',
    }}>
      {/* Top Profile Context */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Spacing.sm,
        marginBottom: Spacing.lg,
      }}>
        <div>
          <span style={{ fontSize: '13px', color: Colors.textSecondary, fontWeight: 500 }}>
            {student.department}
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: Colors.textPrimary, marginTop: 2 }}>
            Welcome, {student.fullName}
          </h2>
        </div>
        <div style={{
          backgroundColor: Colors.brandBlueSoft,
          color: Colors.brandNavy,
          padding: '6px 12px',
          borderRadius: Radii.full,
          fontSize: '12px',
          fontWeight: 600,
        }}>
          {student.enrollmentId}
        </div>
      </div>

      {/* Attendance Standing Overview Card */}
      <div style={{
        backgroundColor: Colors.surfaceCard,
        borderRadius: Radii.card,
        padding: Spacing.base,
        border: `1px solid ${Colors.borderDefault}`,
        marginBottom: Spacing.lg,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <span style={{ fontSize: '12px', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
            Semester Standing
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: Colors.statusSuccess, marginTop: 4 }}>
            88.9%
          </div>
          <span style={{ fontSize: '12px', color: Colors.textSecondary }}>
            Eligible for semester examinations (&ge; 75%)
          </span>
        </div>
        <button
          onClick={onOpenHistory}
          style={{
            background: 'none',
            border: 'none',
            color: Colors.brandNavy,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
        >
          View Ledger <ChevronRight size={16} />
        </button>
      </div>

      {/* Current / Active Class Session Card */}
      <div style={{ marginBottom: Spacing.base }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: Spacing.sm,
        }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: Colors.textPrimary }}>
            CURRENT LIVE SESSION
          </h3>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: '12px',
            color: Colors.statusSuccess,
            fontWeight: 600,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: Colors.statusSuccess }} />
            Session Open
          </span>
        </div>

        <div style={{
          backgroundColor: Colors.surfaceCard,
          borderRadius: Radii.card,
          padding: Spacing.base,
          border: `1px solid ${session.state === 'active' ? Colors.brandNavy : Colors.borderDefault}`,
          boxShadow: '0 4px 12px rgba(0, 28, 90, 0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{
                display: 'inline-block',
                backgroundColor: Colors.surfaceSubtle,
                color: Colors.brandNavy,
                padding: '3px 8px',
                borderRadius: Radii.sm,
                fontSize: '12px',
                fontWeight: 600,
                marginBottom: 6,
              }}>
                {session.courseCode} · {session.section}
              </span>
              <h4 style={{ fontSize: '17px', fontWeight: 700, color: Colors.textPrimary, lineHeight: 1.3 }}>
                {session.courseName}
              </h4>
            </div>
            {isMarkedPresent ? (
              <span style={{
                backgroundColor: Colors.statusSuccessBg,
                color: Colors.statusSuccess,
                padding: '4px 10px',
                borderRadius: Radii.full,
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <CheckCircle2 size={14} /> PRESENT
              </span>
            ) : (
              <span style={{
                backgroundColor: Colors.statusWarningBg,
                color: Colors.statusWarning,
                padding: '4px 10px',
                borderRadius: Radii.full,
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}>
                <AlertCircle size={14} /> NOT MARKED
              </span>
            )}
          </div>

          <div style={{
            marginTop: Spacing.base,
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            fontSize: '13px',
            color: Colors.textSecondary,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={16} /> 10:30 AM – 11:30 AM (Ends in 45m)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} /> {session.roomNumber} (100m Geofence Anchor)
            </div>
          </div>

          {/* Action Driver */}
          <div style={{ marginTop: Spacing.base }}>
            {isMarkedPresent ? (
              <div style={{
                padding: Spacing.md,
                backgroundColor: Colors.statusSuccessBg,
                borderRadius: Radii.control,
                color: Colors.statusSuccess,
                fontSize: '14px',
                fontWeight: 600,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}>
                <CheckCircle2 size={18} /> Attendance Recorded & Verified
              </div>
            ) : (
              <button
                onClick={onOpenScanner}
                style={{
                  width: '100%',
                  height: Spacing.minTouchTarget,
                  backgroundColor: Colors.brandNavy,
                  color: Colors.textInverse,
                  borderRadius: Radii.button,
                  fontSize: '15px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0, 28, 90, 0.15)',
                }}
              >
                <QrCode size={20} /> Scan Classroom QR to Check In
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Classes Section */}
      <div style={{ marginTop: Spacing.lg }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: Colors.textPrimary, marginBottom: Spacing.sm }}>
          UPCOMING TODAY
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
          <div style={{
            backgroundColor: Colors.surfaceCard,
            padding: Spacing.md,
            borderRadius: Radii.card,
            border: `1px solid ${Colors.borderDefault}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: Colors.brandNavy }}>CS402 · 01:30 PM</span>
              <h5 style={{ fontSize: '14px', fontWeight: 600, color: Colors.textPrimary, marginTop: 2 }}>
                High Performance Database Systems
              </h5>
              <span style={{ fontSize: '12px', color: Colors.textSecondary }}>Lecture Hall 104</span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: Colors.textSecondary,
              backgroundColor: Colors.surfaceSubtle,
              padding: '4px 8px',
              borderRadius: Radii.sm,
            }}>
              Scheduled
            </span>
          </div>

          <div style={{
            backgroundColor: Colors.surfaceCard,
            padding: Spacing.md,
            borderRadius: Radii.card,
            border: `1px solid ${Colors.borderDefault}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: Colors.brandNavy }}>MA301 · 03:00 PM</span>
              <h5 style={{ fontSize: '14px', fontWeight: 600, color: Colors.textPrimary, marginTop: 2 }}>
                Applied Linear Algebra & Statistics
              </h5>
              <span style={{ fontSize: '12px', color: Colors.textSecondary }}>Seminar Room B</span>
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: Colors.textSecondary,
              backgroundColor: Colors.surfaceSubtle,
              padding: '4px 8px',
              borderRadius: Radii.sm,
            }}>
              Scheduled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
