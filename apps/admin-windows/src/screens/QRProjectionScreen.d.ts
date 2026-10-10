import React from 'react';
import { AttendanceSession } from '@truemuster/domain-contracts';
interface Props {
    session: AttendanceSession;
    totalPresent: number;
    onBack: () => void;
    onViewRegister: () => void;
}
export declare const QRProjectionScreen: React.FC<Props>;
export {};
