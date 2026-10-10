import React from 'react';
import { AttendanceRecord } from '@truemuster/domain-contracts';
interface Props {
    isSuccess: boolean;
    record?: AttendanceRecord;
    failureReason?: string;
    onReturnHome: () => void;
}
export declare const STU05_OutcomeTicket: React.FC<Props>;
export {};
