import React from 'react';
import { AttendanceSession } from '@truemuster/domain-contracts';
interface Props {
    session: AttendanceSession;
    totalPresent: number;
    onLaunchQR: () => void;
    onViewRegister: () => void;
}
export declare const TeacherDashboard: React.FC<Props>;
export {};
