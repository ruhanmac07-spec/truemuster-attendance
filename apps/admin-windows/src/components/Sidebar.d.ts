import React from 'react';
export type DesktopDestination = 'tch_dashboard' | 'tch_qr' | 'tch_register' | 'adm_overview' | 'adm_corrections' | 'adm_audit';
interface Props {
    currentRole: 'teacher' | 'admin';
    destination: DesktopDestination;
    onSelect: (dest: DesktopDestination) => void;
    onToggleRole: (role: 'teacher' | 'admin') => void;
}
export declare const Sidebar: React.FC<Props>;
export {};
