import React, { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { AttendanceRecord } from '@truemuster/domain-contracts';
import { CheckCircle2, Clock, AlertCircle, FileText, X, Send } from 'lucide-react';

interface Props {
  records: AttendanceRecord[];
}

export const STU06_AttendanceHistory: React.FC<Props> = ({ records }) => {
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [disputeReason, setDisputeReason] = useState('medical');
  const [disputeNote, setDisputeNote] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedMessage('Dispute request submitted to Academic Administration for review.');
    setTimeout(() => {
      setSelectedRecord(null);
      setSubmittedMessage(null);
      setDisputeNote('');
    }, 2000);
  };

  return (
    <div style={{
      padding: Spacing.md,
      paddingBottom: 90,
      backgroundColor: Colors.surfaceCanvas,
      minHeight: '100vh',
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 700, color: Colors.textPrimary, marginTop: Spacing.sm, marginBottom: 4 }}>
        Attendance Ledger
      </h2>
      <p style={{ fontSize: '13px', color: Colors.textSecondary, marginBottom: Spacing.lg }}>
        Authoritative cryptographic history for enrolled student 2023-CS-042
      </p>

      {/* Record List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.sm }}>
        {records.length === 0 ? (
          <div style={{
            padding: Spacing.xl,
            textAlign: 'center',
            backgroundColor: Colors.surfaceCard,
            borderRadius: Radii.card,
            color: Colors.textSecondary,
          }}>
            No attendance records recorded yet.
          </div>
        ) : (
          records.map((rec) => (
            <div
              key={rec.id}
              style={{
                backgroundColor: Colors.surfaceCard,
                borderRadius: Radii.card,
                padding: Spacing.base,
                border: `1px solid ${Colors.borderDefault}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: Colors.brandNavy }}>
                    {rec.courseCode} · {rec.sessionDate}
                  </span>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: Colors.textPrimary, marginTop: 2 }}>
                    {rec.courseName}
                  </h4>
                </div>
                {rec.status === 'present' ? (
                  <span style={{
                    backgroundColor: Colors.statusSuccessBg,
                    color: Colors.statusSuccess,
                    padding: '3px 8px',
                    borderRadius: Radii.full,
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <CheckCircle2 size={12} /> PRESENT
                  </span>
                ) : (
                  <span style={{
                    backgroundColor: Colors.statusErrorBg,
                    color: Colors.statusError,
                    padding: '3px 8px',
                    borderRadius: Radii.full,
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}>
                    <AlertCircle size={12} /> ABSENT
                  </span>
                )}
              </div>

              <div style={{
                marginTop: Spacing.md,
                paddingTop: Spacing.sm,
                borderTop: `1px solid ${Colors.surfaceSubtle}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: Colors.textSecondary,
              }}>
                <span>Verified: {new Date(rec.verifiedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <button
                  onClick={() => setSelectedRecord(rec)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: Colors.brandNavy,
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <FileText size={14} /> File Dispute
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dispute Modal */}
      {selectedRecord && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.md,
          zIndex: 200,
        }}>
          <div style={{
            backgroundColor: Colors.surfaceCard,
            borderRadius: Radii.sheet,
            padding: Spacing.lg,
            width: '100%',
            maxWidth: 400,
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: Colors.textPrimary }}>
                File Attendance Dispute
              </h3>
              <button onClick={() => setSelectedRecord(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color={Colors.textSecondary} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: Colors.textSecondary, marginBottom: Spacing.md, lineHeight: 1.4 }}>
              Dispute for <strong>{selectedRecord.courseCode}</strong> ({selectedRecord.sessionDate}). This request requires approval from Academic Administration.
            </p>

            {submittedMessage ? (
              <div style={{
                padding: Spacing.md,
                backgroundColor: Colors.statusSuccessBg,
                color: Colors.statusSuccess,
                borderRadius: Radii.control,
                fontSize: '13px',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                {submittedMessage}
              </div>
            ) : (
              <form onSubmit={handleDisputeSubmit}>
                <div style={{ marginBottom: Spacing.md }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 4 }}>
                    Reason Category
                  </label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    style={{
                      width: '100%',
                      height: 42,
                      borderRadius: Radii.control,
                      border: `1px solid ${Colors.borderDefault}`,
                      padding: '0 10px',
                      fontSize: '14px',
                      backgroundColor: Colors.surfaceCard,
                      outline: 'none',
                    }}
                  >
                    <option value="medical">Medical / Health Leave</option>
                    <option value="institutional_duty">Approved Institutional Duty</option>
                    <option value="device_issue">Hardware GPS / Scanner Malfunction</option>
                    <option value="other">Other Official Reason</option>
                  </select>
                </div>

                <div style={{ marginBottom: Spacing.lg }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: Colors.textPrimary, marginBottom: 4 }}>
                    Supporting Explanation
                  </label>
                  <textarea
                    rows={3}
                    value={disputeNote}
                    onChange={(e) => setDisputeNote(e.target.value)}
                    required
                    placeholder="Provide details for administrative review..."
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

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(null)}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: Radii.button,
                      border: `1px solid ${Colors.borderDefault}`,
                      backgroundColor: Colors.surfaceCard,
                      color: Colors.textPrimary,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: Radii.button,
                      border: 'none',
                      backgroundColor: Colors.brandNavy,
                      color: Colors.textInverse,
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Send size={16} /> Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
