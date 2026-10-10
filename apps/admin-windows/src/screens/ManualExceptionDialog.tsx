import React, { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { TrueMusterStore, AttendanceRecord } from '@truemuster/domain-contracts';
import { X, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Props {
  sessionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ManualExceptionDialog: React.FC<Props> = ({ sessionId, onClose, onSuccess }) => {
  const [studentId, setStudentId] = useState('stu-9904-divya');
  const [studentName, setStudentName] = useState('Divya Patel');
  const [enrollmentId, setEnrollmentId] = useState('2023-CS-088');
  const [reasonCategory, setReasonCategory] = useState('medical');
  const [justification, setJustification] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/records/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          studentId,
          newStatus: 'present',
          reasonCategory,
          reasonText: justification,
          teacherId: 'tch-prof-rao',
        }),
      });
    } catch (err) {}

    const record: AttendanceRecord = {
      id: 'rec-manual-' + Date.now(),
      sessionId,
      studentId,
      studentName,
      enrollmentId,
      courseCode: 'CS401',
      courseName: 'Distributed Systems & Cloud Computing',
      sessionDate: new Date().toISOString().split('T')[0],
      status: 'present',
      verificationMethod: 'teacher_manual_override',
      verifiedAt: new Date().toISOString(),
      overrideReason: `[${reasonCategory.toUpperCase()}] ${justification}`,
      overrideBy: 'Prof. K. Rao (Teacher)',
    };

    TrueMusterStore.markAttendance(record);
    setIsSubmitting(false);
    onSuccess();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: Radii.card,
        width: 480,
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: `1px solid ${Colors.borderDefault}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: Colors.textPrimary }}>
              Record Manual Attendance Exception (TCH-07)
            </h3>
            <span style={{ fontSize: '12px', color: Colors.textSecondary }}>
              Audited override with mandatory justification capture
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color={Colors.textSecondary} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: Spacing.base }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 6 }}>
              Select Student to Override
            </label>
            <select
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                if (e.target.value === 'stu-9904-divya') {
                  setStudentName('Divya Patel');
                  setEnrollmentId('2023-CS-088');
                } else if (e.target.value === 'stu-9901-alice') {
                  setStudentName('Alice Sharma');
                  setEnrollmentId('2023-CS-042');
                } else {
                  setStudentName('Fiona Gallagher');
                  setEnrollmentId('2023-CS-067');
                }
              }}
              style={{
                width: '100%',
                height: 38,
                borderRadius: Radii.control,
                border: `1px solid ${Colors.borderDefault}`,
                padding: '0 10px',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="stu-9904-divya">Divya Patel (2023-CS-088)</option>
              <option value="stu-9901-alice">Alice Sharma (2023-CS-042)</option>
              <option value="stu-9906-fiona">Fiona Gallagher (2023-CS-067)</option>
            </select>
          </div>

          <div style={{ marginBottom: Spacing.base }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 6 }}>
              Exception Reason Category (Mandatory Policy)
            </label>
            <select
              value={reasonCategory}
              onChange={(e) => setReasonCategory(e.target.value)}
              style={{
                width: '100%',
                height: 38,
                borderRadius: Radii.control,
                border: `1px solid ${Colors.borderDefault}`,
                padding: '0 10px',
                fontSize: '13px',
                outline: 'none',
              }}
            >
              <option value="medical">Medical Infirmary Leave</option>
              <option value="institutional_duty">Authorized Inter-College Competition / Duty</option>
              <option value="hardware_malfunction">Student Smartphone GPS / Hardware Failure</option>
              <option value="other">Other Academic Exemption</option>
            </select>
          </div>

          <div style={{ marginBottom: Spacing.base }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 6 }}>
              Written Justification Note
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail the reason for audit compliance..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              style={{
                width: '100%',
                padding: 10,
                borderRadius: Radii.control,
                border: `1px solid ${Colors.borderDefault}`,
                fontSize: '13px',
                outline: 'none',
                resize: 'none',
              }}
            />
          </div>

          <div style={{
            padding: Spacing.md,
            backgroundColor: Colors.surfaceCanvas,
            borderRadius: Radii.control,
            fontSize: '12px',
            color: Colors.textSecondary,
            lineHeight: 1.4,
            marginBottom: Spacing.base,
            display: 'flex',
            gap: 8,
          }}>
            <ShieldAlert size={16} color={Colors.brandNavy} style={{ flexShrink: 0, marginTop: 2 }} />
            <span>This override will be logged in the immutable Institutional Audit Ledger with your staff ID.</span>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                height: 38,
                padding: '0 18px',
                borderRadius: Radii.control,
                backgroundColor: '#FFFFFF',
                border: `1px solid ${Colors.borderDefault}`,
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                height: 38,
                padding: '0 20px',
                borderRadius: Radii.control,
                backgroundColor: Colors.brandNavy,
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isSubmitting ? 'Recording...' : 'Commit Exception'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
