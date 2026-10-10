import React from 'react';
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
import { LayoutDashboard, QrCode, Users, FileCheck2, ShieldAlert, BookOpen, Settings, LogOut, GraduationCap } from 'lucide-react';

export type DesktopDestination = 
  | 'tch_dashboard' 
  | 'tch_qr' 
  | 'tch_register' 
  | 'adm_overview' 
  | 'adm_corrections' 
  | 'adm_audit';

interface Props {
  currentRole: 'teacher' | 'admin';
  destination: DesktopDestination;
  onSelect: (dest: DesktopDestination) => void;
  onToggleRole: (role: 'teacher' | 'admin') => void;
}

export const Sidebar: React.FC<Props> = ({ currentRole, destination, onSelect, onToggleRole }) => {
  return (
    <aside style={{
      width: 250,
      backgroundColor: '#FFFFFF',
      borderRight: `1px solid ${Colors.borderDefault}`,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 40,
    }}>
      {/* Top Header & Role Switcher */}
      <div>
        <div style={{
          padding: '20px 18px',
          borderBottom: `1px solid ${Colors.borderDefault}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: Radii.control,
            backgroundColor: Colors.brandNavy,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <GraduationCap size={20} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: Colors.brandNavy, letterSpacing: '0.02em' }}>
              TRUEMUSTER
            </div>
            <div style={{ fontSize: '11px', color: Colors.textSecondary, fontWeight: 500 }}>
              Windows Management Suite
            </div>
          </div>
        </div>

        {/* Role Toggle Tabs */}
        <div style={{ padding: '12px 16px' }}>
          <div style={{
            display: 'flex',
            backgroundColor: Colors.surfaceCanvas,
            borderRadius: Radii.control,
            padding: 3,
            border: `1px solid ${Colors.borderDefault}`,
          }}>
            <button
              onClick={() => {
                onToggleRole('teacher');
                onSelect('tch_dashboard');
              }}
              style={{
                flex: 1,
                padding: '6px 0',
                border: 'none',
                borderRadius: 6,
                fontSize: '12px',
                fontWeight: currentRole === 'teacher' ? 700 : 500,
                backgroundColor: currentRole === 'teacher' ? '#FFFFFF' : 'transparent',
                color: currentRole === 'teacher' ? Colors.brandNavy : Colors.textSecondary,
                cursor: 'pointer',
                boxShadow: currentRole === 'teacher' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Teacher
            </button>
            <button
              onClick={() => {
                onToggleRole('admin');
                onSelect('adm_overview');
              }}
              style={{
                flex: 1,
                padding: '6px 0',
                border: 'none',
                borderRadius: 6,
                fontSize: '12px',
                fontWeight: currentRole === 'admin' ? 700 : 500,
                backgroundColor: currentRole === 'admin' ? '#FFFFFF' : 'transparent',
                color: currentRole === 'admin' ? Colors.brandNavy : Colors.textSecondary,
                cursor: 'pointer',
                boxShadow: currentRole === 'admin' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {currentRole === 'teacher' ? (
            <>
              <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }}>
                Class Operations
              </div>
              <button
                onClick={() => onSelect('tch_dashboard')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: Radii.control,
                  border: 'none',
                  backgroundColor: destination === 'tch_dashboard' ? Colors.brandBlueSoft : 'transparent',
                  color: destination === 'tch_dashboard' ? Colors.brandNavy : Colors.textPrimary,
                  fontWeight: destination === 'tch_dashboard' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LayoutDashboard size={18} /> Teacher Dashboard
              </button>

              <button
                onClick={() => onSelect('tch_qr')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: Radii.control,
                  border: 'none',
                  backgroundColor: destination === 'tch_qr' ? Colors.brandBlueSoft : 'transparent',
                  color: destination === 'tch_qr' ? Colors.brandNavy : Colors.textPrimary,
                  fontWeight: destination === 'tch_qr' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <QrCode size={18} /> Project Live Session QR
              </button>

              <button
                onClick={() => onSelect('tch_register')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: Radii.control,
                  border: 'none',
                  backgroundColor: destination === 'tch_register' ? Colors.brandBlueSoft : 'transparent',
                  color: destination === 'tch_register' ? Colors.brandNavy : Colors.textPrimary,
                  fontWeight: destination === 'tch_register' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Users size={18} /> Live Register (TCH-05)
              </button>
            </>
          ) : (
            <>
              <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }}>
                Governance & Audits
              </div>
              <button
                onClick={() => onSelect('adm_overview')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: Radii.control,
                  border: 'none',
                  backgroundColor: destination === 'adm_overview' ? Colors.brandBlueSoft : 'transparent',
                  color: destination === 'adm_overview' ? Colors.brandNavy : Colors.textPrimary,
                  fontWeight: destination === 'adm_overview' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LayoutDashboard size={18} /> Admin Overview
              </button>

              <button
                onClick={() => onSelect('adm_corrections')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: Radii.control,
                  border: 'none',
                  backgroundColor: destination === 'adm_corrections' ? Colors.brandBlueSoft : 'transparent',
                  color: destination === 'adm_corrections' ? Colors.brandNavy : Colors.textPrimary,
                  fontWeight: destination === 'adm_corrections' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <FileCheck2 size={18} /> Correction Queue (ADM-10)
              </button>

              <button
                onClick={() => onSelect('adm_audit')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: Radii.control,
                  border: 'none',
                  backgroundColor: destination === 'adm_audit' ? Colors.brandBlueSoft : 'transparent',
                  color: destination === 'adm_audit' ? Colors.brandNavy : Colors.textPrimary,
                  fontWeight: destination === 'adm_audit' ? 700 : 500,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <ShieldAlert size={18} /> Audit Ledger (ADM-13)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div style={{
        padding: '16px',
        borderTop: `1px solid ${Colors.borderDefault}`,
        backgroundColor: Colors.surfaceCanvas,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: Colors.brandNavy,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '13px',
          }}>
            {currentRole === 'teacher' ? 'PR' : 'AD'}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: Colors.textPrimary }}>
              {currentRole === 'teacher' ? 'Prof. K. Rao' : 'Dean Academic Affairs'}
            </div>
            <div style={{ fontSize: '11px', color: Colors.textSecondary }}>
              {currentRole === 'teacher' ? 'Computer Science Dept' : 'Institutional Admin'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
