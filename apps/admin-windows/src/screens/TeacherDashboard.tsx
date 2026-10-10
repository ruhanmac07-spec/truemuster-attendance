import React from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { AttendanceSession } from '@truemuster/domain-contracts';
import { Play, QrCode, Users, Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface Props {
  session: AttendanceSession;
  totalPresent: number;
  onLaunchQR: () => void;
  onViewRegister: () => void;
}

export const TeacherDashboard: React.FC<Props> = ({
  session,
  totalPresent,
  onLaunchQR,
  onViewRegister,
}) => {
  return (
    <div>
      {/* Page Title */}
      <div style={{ marginBottom: Spacing.xl }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: Colors.textPrimary }}>
          Teacher Dashboard
        </h1>
        <p style={{ fontSize: '14px', color: Colors.textSecondary, marginTop: 4 }}>
          Assigned classes and active attendance sessions for today
        </p>
      </div>

      {/* Active Session Hero Card */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: Radii.card,
        border: `1px solid ${Colors.brandNavy}`,
        boxShadow: '0 4px 16px rgba(0, 28, 90, 0.06)',
        padding: Spacing.xl,
        marginBottom: Spacing.xl,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              backgroundColor: Colors.statusSuccessBg,
              color: Colors.statusSuccess,
              padding: '4px 12px',
              borderRadius: Radii.full,
              fontSize: '12px',
              fontWeight: 700,
              marginBottom: 10,
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: Colors.statusSuccess }} />
              ACTIVE CLASSROOM SESSION
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: Colors.textPrimary }}>
              {session.courseCode} — {session.courseName}
            </h2>
            <div style={{ fontSize: '14px', color: Colors.textSecondary, marginTop: 4 }}>
              {session.section} · Semester 5 (Autumn 2026)
            </div>
          </div>

          {/* Quick Metrics */}
          <div style={{
            display: 'flex',
            gap: 24,
            backgroundColor: Colors.surfaceCanvas,
            padding: '12px 20px',
            borderRadius: Radii.control,
            border: `1px solid ${Colors.borderDefault}`,
          }}>
            <div>
              <div style={{ fontSize: '11px', color: Colors.textSecondary, fontWeight: 600, textTransform: 'uppercase' }}>
                Enrolled
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: Colors.textPrimary, marginTop: 2 }}>
                {session.totalEnrolled}
              </div>
            </div>
            <div style={{ width: 1, backgroundColor: Colors.borderDefault }} />
            <div>
              <div style={{ fontSize: '11px', color: Colors.textSecondary, fontWeight: 600, textTransform: 'uppercase' }}>
                Confirmed Present
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: Colors.statusSuccess, marginTop: 2 }}>
                {totalPresent}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: Spacing.lg,
          paddingTop: Spacing.base,
          borderTop: `1px solid ${Colors.borderDefault}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', gap: 24, fontSize: '13px', color: Colors.textSecondary }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={16} /> 10:30 AM – 11:30 AM
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} /> {session.roomNumber} (100m Anchor)
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={onViewRegister}
              style={{
                height: 40,
                padding: '0 18px',
                borderRadius: Radii.control,
                backgroundColor: '#FFFFFF',
                color: Colors.brandNavy,
                border: `1px solid ${Colors.borderDefault}`,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Users size={16} /> View Register ({totalPresent})
            </button>

            <button
              onClick={onLaunchQR}
              style={{
                height: 40,
                padding: '0 22px',
                borderRadius: Radii.control,
                backgroundColor: Colors.brandNavy,
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: '0 2px 6px rgba(0, 28, 90, 0.2)',
              }}
            >
              <QrCode size={16} /> Project Classroom QR
            </button>
          </div>
        </div>
      </div>

      {/* Assigned Classes List */}
      <h3 style={{ fontSize: '17px', fontWeight: 700, color: Colors.textPrimary, marginBottom: Spacing.md }}>
        Assigned Classes This Week
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: Spacing.base }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: Radii.card,
          padding: Spacing.base,
          border: `1px solid ${Colors.borderDefault}`,
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: Colors.brandNavy }}>CS402 · Section B</span>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: Colors.textPrimary, marginTop: 4 }}>
            High Performance Database Systems
          </h4>
          <div style={{ fontSize: '13px', color: Colors.textSecondary, marginTop: 4 }}>
            Lecture Hall 104 · 01:30 PM – 02:30 PM
          </div>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: Radii.card,
          padding: Spacing.base,
          border: `1px solid ${Colors.borderDefault}`,
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: Colors.brandNavy }}>CS501 · Section A</span>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: Colors.textPrimary, marginTop: 4 }}>
            Advanced Machine Learning Seminar
          </h4>
          <div style={{ fontSize: '13px', color: Colors.textSecondary, marginTop: 4 }}>
            Lab 201 · Tomorrow, 09:30 AM
          </div>
        </div>
      </div>
    </div>
  );
};
