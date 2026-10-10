import React from 'react';
import { AttendanceSession, AttendanceRecord } from '@truemuster/domain-contracts';
interface Props {
    session: AttendanceSession;
    records: AttendanceRecord[];
    onBack: () => void;
    onOpenQR: () => void;
    onOpenManualDialog: () => void;
}
export declare const LiveAttendanceRegister: React.FC<Props>;
export {};
