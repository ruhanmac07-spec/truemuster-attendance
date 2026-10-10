import React, { useState } from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { AttendanceSession, AttendanceRecord } from '@truemuster/domain-contracts';
import { ArrowLeft, Search, Filter, CheckCircle2, AlertCircle, Plus, FileSpreadsheet, QrCode } from 'lucide-react';

interface Props {
  session: AttendanceSession;
  records: AttendanceRecord[];
  onBack: () => void;
  onOpenQR: () => void;
  onOpenManualDialog: () => void;
}

export const LiveAttendanceRegister: React.FC<Props> = ({
  session,
  records,
  onBack,
  onOpenQR,
  onOpenManualDialog,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');

  // Complete student roster including present and absent
  const fullRoster = [
    { id: 'stu-9901-alice', name: 'Alice Sharma', enrollmentId: '2023-CS-042' },
    { id: 'stu-9902-bob', name: 'Bob Jenkins', enrollmentId: '2023-CS-015' },
    { id: 'stu-9903-charlie', name: 'Charlie Dave', enrollmentId: '2023-CS-022' },
    { id: 'stu-9904-divya', name: 'Divya Patel', enrollmentId: '2023-CS-088' },
    { id: 'stu-9905-ethan', name: 'Ethan Hunt', enrollmentId: '2023-CS-051' },
    { id: 'stu-9906-fiona', name: 'Fiona Gallagher', enrollmentId: '2023-CS-067' },
    { id: 'stu-9907-george', name: 'George Clark', enrollmentId: '2023-CS-019' },
  ];

  const mergedRoster = fullRoster.map((stu) => {
    const rec = records.find(r => r.studentId === stu.id);
    return {
      ...stu,
      isMarked: !!rec,
      status: rec ? rec.status : ('absent' as const),
      verifiedAt: rec ? rec.verifiedAt : null,
      method: rec ? rec.verificationMethod : null,
    };
  });

  const filtered = mergedRoster.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && item.status === statusFilter;
  });

  const presentCount = mergedRoster.filter(r => r.status === 'present').length;

  return (
    <div>
      {/* Top Navigation & Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={onBack}
            style={{
              background: 'none',
              border: 'none',
              color: Colors.brandNavy,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: Colors.textPrimary }}>
              Live Attendance Register (TCH-05)
            </h1>
            <span style={{ fontSize: '13px', color: Colors.textSecondary }}>
              {session.courseCode} · {session.courseName} · {session.section}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onOpenQR}
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
            <QrCode size={16} /> QR Projection
          </button>

          <button
            onClick={onOpenManualDialog}
            style={{
              height: 38,
              padding: '0 16px',
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
            }}
          >
            <Plus size={16} /> Record Exception (TCH-07)
          </button>
        </div>
      </div>

      {/* Roster Controls & Search Filter */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: Radii.card,
        border: `1px solid ${Colors.borderDefault}`,
        padding: Spacing.base,
        marginBottom: Spacing.base,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: 340 }}>
          <Search size={18} color={Colors.textSecondary} />
          <input
            type="text"
            placeholder="Search student by name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              height: 36,
              border: 'none',
              fontSize: '13px',
              outline: 'none',
              backgroundColor: 'transparent',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                padding: '6px 12px',
                borderRadius: Radii.control,
                border: 'none',
                backgroundColor: statusFilter === 'all' ? Colors.brandNavy : Colors.surfaceSubtle,
                color: statusFilter === 'all' ? '#FFFFFF' : Colors.textPrimary,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              All ({mergedRoster.length})
            </button>
            <button
              onClick={() => setStatusFilter('present')}
              style={{
                padding: '6px 12px',
                borderRadius: Radii.control,
                border: 'none',
                backgroundColor: statusFilter === 'present' ? Colors.statusSuccess : Colors.surfaceSubtle,
                color: statusFilter === 'present' ? '#FFFFFF' : Colors.textPrimary,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Present ({presentCount})
            </button>
            <button
              onClick={() => setStatusFilter('absent')}
              style={{
                padding: '6px 12px',
                borderRadius: Radii.control,
                border: 'none',
                backgroundColor: statusFilter === 'absent' ? Colors.statusError : Colors.surfaceSubtle,
                color: statusFilter === 'absent' ? '#FFFFFF' : Colors.textPrimary,
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Absent ({mergedRoster.length - presentCount})
            </button>
          </div>
        </div>
      </div>

      {/* Roster Table */}
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
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>STUDENT NAME</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>ENROLLMENT ID</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>STATUS</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>VERIFIED TIMESTAMP</th>
              <th style={{ padding: '12px 18px', fontWeight: 600, color: Colors.textSecondary }}>VERIFICATION METHOD</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: `1px solid ${Colors.surfaceSubtle}`,
                  backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFCFE',
                }}
              >
                <td style={{ padding: '14px 18px', fontWeight: 600, color: Colors.textPrimary }}>
                  {item.name}
                </td>
                <td style={{ padding: '14px 18px', color: Colors.textSecondary, fontFamily: 'monospace' }}>
                  {item.enrollmentId}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  {item.status === 'present' ? (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: Colors.statusSuccessBg,
                      color: Colors.statusSuccess,
                      padding: '4px 10px',
                      borderRadius: Radii.full,
                      fontWeight: 700,
                      fontSize: '11px',
                    }}>
                      <CheckCircle2 size={13} /> PRESENT
                    </span>
                  ) : (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: Colors.statusErrorBg,
                      color: Colors.statusError,
                      padding: '4px 10px',
                      borderRadius: Radii.full,
                      fontWeight: 700,
                      fontSize: '11px',
                    }}>
                      <AlertCircle size={13} /> ABSENT
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 18px', color: Colors.textSecondary }}>
                  {item.verifiedAt ? new Date(item.verifiedAt).toLocaleTimeString() : '—'}
                </td>
                <td style={{ padding: '14px 18px', color: Colors.textSecondary }}>
                  {item.method ? (
                    item.method === 'qr_biometric_geofence' ? 'QR + Biometric + Geofence' : 'Teacher Manual Override'
                  ) : 'Not Checked In'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
