import React from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { ShieldCheck, Users, BookOpen, AlertCircle, TrendingUp, CheckCircle2 } from 'lucide-react';

interface Props {
  onNavigateCorrections: () => void;
  onNavigateAudit: () => void;
}

export const AdminOverview: React.FC<Props> = ({ onNavigateCorrections, onNavigateAudit }) => {
  return (
    <div>
      <div style={{ marginBottom: Spacing.xl }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: Colors.textPrimary }}>
          Institutional Overview Dashboard (ADM-01)
        </h1>
        <p style={{ fontSize: '14px', color: Colors.textSecondary, marginTop: 4 }}>
          College-wide attendance operational metrics, active hardware geofences, and compliance queues
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: Spacing.base, marginBottom: Spacing.xl }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: Radii.card,
          padding: Spacing.base,
          border: `1px solid ${Colors.borderDefault}`,
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }}>
            Total Active Students
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: Colors.textPrimary, marginTop: 6 }}>
            1,480
          </div>
          <span style={{ fontSize: '12px', color: Colors.statusSuccess, fontWeight: 600, marginTop: 4, display: 'block' }}>
            99.2% Device Binding Enrolled
          </span>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: Radii.card,
          padding: Spacing.base,
          border: `1px solid ${Colors.borderDefault}`,
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }}>
            Today's Attendance Rate
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: Colors.brandNavy, marginTop: 6 }}>
            91.4%
          </div>
          <span style={{ fontSize: '12px', color: Colors.textSecondary, marginTop: 4, display: 'block' }}>
            Across 42 Class Sessions
          </span>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: Radii.card,
          padding: Spacing.base,
          border: `1px solid ${Colors.borderDefault}`,
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }}>
            Pending Dispute Queue
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: Colors.statusWarning, marginTop: 6 }}>
            3
          </div>
          <button
            onClick={onNavigateCorrections}
            style={{
              background: 'none',
              border: 'none',
              color: Colors.brandNavy,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: 4,
              padding: 0,
            }}
          >
            Review Requests &rarr;
          </button>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: Radii.card,
          padding: Spacing.base,
          border: `1px solid ${Colors.borderDefault}`,
        }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }}>
            Geofence Anchors
          </span>
          <div style={{ fontSize: '28px', fontWeight: 700, color: Colors.statusSuccess, marginTop: 6 }}>
            24 / 24
          </div>
          <span style={{ fontSize: '12px', color: Colors.statusSuccess, fontWeight: 600, marginTop: 4, display: 'block' }}>
            All 100m Radii Verified
          </span>
        </div>
      </div>

      {/* Operational Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: Spacing.lg }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: Radii.card,
          padding: Spacing.xl,
          border: `1px solid ${Colors.borderDefault}`,
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: Colors.textPrimary, marginBottom: Spacing.md }}>
            Active Classroom Sessions in Progress
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 14px',
              backgroundColor: Colors.surfaceCanvas,
              borderRadius: Radii.control,
            }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: Colors.brandNavy }}>CS401 · Computing Lab 302</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: Colors.textPrimary }}>
                  Distributed Systems & Cloud Computing (Prof. K. Rao)
                </div>
              </div>
              <span style={{
                backgroundColor: Colors.statusSuccessBg,
                color: Colors.statusSuccess,
                padding: '4px 10px',
                borderRadius: Radii.full,
                fontSize: '11px',
                fontWeight: 700,
              }}>
                19 Checked In / 45
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 14px',
              backgroundColor: Colors.surfaceCanvas,
              borderRadius: Radii.control,
            }}>
              <div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: Colors.brandNavy }}>EE301 · Room 102</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: Colors.textPrimary }}>
                  Signals & Linear Systems (Dr. S. Mehta)
                </div>
              </div>
              <span style={{
                backgroundColor: Colors.statusSuccessBg,
                color: Colors.statusSuccess,
                padding: '4px 10px',
                borderRadius: Radii.full,
                fontSize: '11px',
                fontWeight: 700,
              }}>
                58 Checked In / 60
              </span>
            </div>
          </div>
        </div>

        {/* Quick Audit Links */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: Radii.card,
          padding: Spacing.xl,
          border: `1px solid ${Colors.borderDefault}`,
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: Colors.textPrimary, marginBottom: Spacing.md }}>
            System Integrity Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={onNavigateCorrections}
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: Colors.surfaceCanvas,
                border: `1px solid ${Colors.borderDefault}`,
                borderRadius: Radii.control,
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: 600,
                color: Colors.brandNavy,
                cursor: 'pointer',
              }}
            >
              Open Correction Queue (ADM-10)
            </button>
            <button
              onClick={onNavigateAudit}
              style={{
                width: '100%',
                padding: '12px 14px',
                backgroundColor: Colors.surfaceCanvas,
                border: `1px solid ${Colors.borderDefault}`,
                borderRadius: Radii.control,
                textAlign: 'left',
                fontSize: '13px',
                fontWeight: 600,
                color: Colors.brandNavy,
                cursor: 'pointer',
              }}
            >
              Inspect Audit Log Ledger (ADM-13)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
