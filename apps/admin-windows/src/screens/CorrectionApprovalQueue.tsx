import React, { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { ArrowLeft, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const CorrectionApprovalQueue: React.FC<Props> = ({ onBack }) => {
  const [requests, setRequests] = useState([
    {
      id: 'req-01',
      studentName: 'Alice Sharma',
      enrollmentId: '2023-CS-042',
      courseCode: 'CS401',
      sessionDate: '2026-10-08',
      reason: 'Infirmary Visit for acute fever (Medical slip attached)',
      status: 'pending',
    },
    {
      id: 'req-02',
      studentName: 'Ethan Hunt',
      enrollmentId: '2023-CS-051',
      courseCode: 'CS402',
      sessionDate: '2026-10-07',
      reason: 'Representing university in Inter-College Robotics Hackathon',
      status: 'pending',
    },
  ]);

  const handleAction = (id: string, newStatus: 'approved' | 'rejected') => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: Spacing.xl }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: Colors.brandNavy, fontWeight: 600 }}>
          <ArrowLeft size={18} /> Back
        </button>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: Colors.textPrimary }}>
            Correction Approval Queue (ADM-10)
          </h1>
          <span style={{ fontSize: '13px', color: Colors.textSecondary }}>
            Review post-finalization student dispute and teacher exception claims
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: Spacing.base }}>
        {requests.map((req) => (
          <div
            key={req.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: Radii.card,
              padding: Spacing.base,
              border: `1px solid ${Colors.borderDefault}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 700, fontSize: '15px', color: Colors.textPrimary }}>
                  {req.studentName} ({req.enrollmentId})
                </span>
                <span style={{
                  backgroundColor: Colors.brandBlueSoft,
                  color: Colors.brandNavy,
                  padding: '2px 8px',
                  borderRadius: Radii.sm,
                  fontSize: '11px',
                  fontWeight: 600,
                }}>
                  {req.courseCode} · {req.sessionDate}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: Colors.textSecondary, marginTop: 6 }}>
                <strong>Justification:</strong> {req.reason}
              </p>
            </div>

            <div>
              {req.status === 'pending' ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => handleAction(req.id, 'rejected')}
                    style={{
                      height: 36,
                      padding: '0 14px',
                      borderRadius: Radii.control,
                      backgroundColor: Colors.surfaceSubtle,
                      border: `1px solid ${Colors.borderDefault}`,
                      color: Colors.statusError,
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'approved')}
                    style={{
                      height: 36,
                      padding: '0 16px',
                      borderRadius: Radii.control,
                      backgroundColor: Colors.statusSuccess,
                      border: 'none',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Approve
                  </button>
                </div>
              ) : (
                <span style={{
                  padding: '4px 10px',
                  borderRadius: Radii.full,
                  fontSize: '12px',
                  fontWeight: 700,
                  backgroundColor: req.status === 'approved' ? Colors.statusSuccessBg : Colors.statusErrorBg,
                  color: req.status === 'approved' ? Colors.statusSuccess : Colors.statusError,
                }}>
                  {req.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
