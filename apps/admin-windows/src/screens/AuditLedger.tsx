import React from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { ArrowLeft, ShieldCheck, Lock, Download, FileSpreadsheet } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const AuditLedger: React.FC<Props> = ({ onBack }) => {
  const auditEntries = [
    {
      id: 'aud-0091',
      actor: 'Prof. K. Rao (Teacher)',
      action: 'TEACHER_MANUAL_OVERRIDE',
      target: 'attendance_records/rec-manual-01',
      details: 'Marked Divya Patel (2023-CS-088) as Present with reason [MEDICAL]',
      timestamp: '2026-10-10 10:48:22 UTC',
    },
    {
      id: 'aud-0090',
      actor: 'Alice Sharma (Student)',
      action: 'CHECKIN_COMMITTED',
      target: 'attendance_records/rec-alice-cs401',
      details: 'Verified via QR Challenge + BiometricPrompt + Geofence (Distance: 24.5m)',
      timestamp: '2026-10-10 10:44:10 UTC',
    },
    {
      id: 'aud-0089',
      actor: 'System / Teacher Client',
      action: 'QR_CHALLENGE_ROTATED',
      target: 'qr_challenges/chl-cs401-rot-03',
      details: 'Generated 90-second opaque dynamic challenge TM-W81X-9012',
      timestamp: '2026-10-10 10:43:00 UTC',
    },
    {
      id: 'aud-0088',
      actor: 'Prof. K. Rao (Teacher)',
      action: 'SESSION_OPENED',
      target: 'attendance_sessions/ses-cs401-001',
      details: 'Activated session CS401 at Computing Lab 302 anchor (Lat: 19.0760, Lng: 72.8777)',
      timestamp: '2026-10-10 10:30:00 UTC',
    },
  ];

  const handleExportAuditCSV = () => {
    const headers = ['Event ID', 'Timestamp (UTC)', 'Actor', 'Action Type', 'Details'];
    const rows = auditEntries.map(e => [
      e.id,
      e.timestamp,
      `"${e.actor}"`,
      e.action,
      `"${e.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `TrueMuster_Audit_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xl }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: Colors.brandNavy, fontWeight: 600 }}>
            <ArrowLeft size={18} /> Back
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: Colors.textPrimary }}>
              System Audit Ledger (ADM-13)
            </h1>
            <span style={{ fontSize: '13px', color: Colors.textSecondary }}>
              Append-only tamper-evident institutional transaction ledger
            </span>
          </div>
        </div>

        <button
          onClick={handleExportAuditCSV}
          style={{
            height: 38,
            padding: '0 16px',
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
          <FileSpreadsheet size={16} /> Export Audit Log
        </button>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: Radii.card,
        border: `1px solid ${Colors.borderDefault}`,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: Colors.surfaceCanvas, borderBottom: `1px solid ${Colors.borderDefault}` }}>
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>EVENT ID</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>TIMESTAMP (UTC)</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>ACTOR</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>ACTION TYPE</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>VERIFICATION DETAILS</th>
            </tr>
          </thead>
          <tbody>
            {auditEntries.map((entry, idx) => (
              <tr
                key={entry.id}
                style={{
                  borderBottom: `1px solid ${Colors.surfaceSubtle}`,
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFE',
                }}
              >
                <td style={{ padding: '14px 18px', fontFamily: 'monospace', fontWeight: 600, color: Colors.brandNavy }}>
                  {entry.id}
                </td>
                <td style={{ padding: '14px 18px', color: Colors.textSecondary, whiteSpace: 'nowrap' }}>
                  {entry.timestamp}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: 600, color: Colors.textPrimary }}>
                  {entry.actor}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{
                    backgroundColor: Colors.brandBlueSoft,
                    color: Colors.brandNavy,
                    padding: '3px 8px',
                    borderRadius: Radii.sm,
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: 'monospace',
                  }}>
                    {entry.action}
                  </span>
                </td>
                <td style={{ padding: '14px 18px', color: Colors.textSecondary }}>
                  {entry.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
