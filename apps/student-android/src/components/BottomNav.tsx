import React from 'react';
import { Colors, Spacing } from '@truemuster/design-tokens';
import { Home, Calendar, ShieldCheck } from 'lucide-react';

export type StudentTab = 'home' | 'history' | 'profile';

interface Props {
  activeTab: StudentTab;
  onSelectTab: (tab: StudentTab) => void;
}

export const BottomNav: React.FC<Props> = ({ activeTab, onSelectTab }) => {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: 64,
      backgroundColor: '#FFFFFF',
      borderTop: `1px solid ${Colors.borderDefault}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 50,
      boxShadow: '0 -4px 16px rgba(0, 28, 90, 0.04)',
    }}>
      <button
        onClick={() => onSelectTab('home')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          color: activeTab === 'home' ? Colors.brandNavy : Colors.textSecondary,
          cursor: 'pointer',
          padding: '6px 16px',
        }}
      >
        <Home size={22} color={activeTab === 'home' ? Colors.brandNavy : Colors.textSecondary} />
        <span style={{ fontSize: '11px', fontWeight: activeTab === 'home' ? 700 : 500 }}>
          Home
        </span>
      </button>

      <button
        onClick={() => onSelectTab('history')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          color: activeTab === 'history' ? Colors.brandNavy : Colors.textSecondary,
          cursor: 'pointer',
          padding: '6px 16px',
        }}
      >
        <Calendar size={22} color={activeTab === 'history' ? Colors.brandNavy : Colors.textSecondary} />
        <span style={{ fontSize: '11px', fontWeight: activeTab === 'history' ? 700 : 500 }}>
          History
        </span>
      </button>

      <button
        onClick={() => onSelectTab('profile')}
        style={{
          background: 'none',
          border: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          color: activeTab === 'profile' ? Colors.brandNavy : Colors.textSecondary,
          cursor: 'pointer',
          padding: '6px 16px',
        }}
      >
        <ShieldCheck size={22} color={activeTab === 'profile' ? Colors.brandNavy : Colors.textSecondary} />
        <span style={{ fontSize: '11px', fontWeight: activeTab === 'profile' ? 700 : 500 }}>
          Security
        </span>
      </button>
    </nav>
  );
};
