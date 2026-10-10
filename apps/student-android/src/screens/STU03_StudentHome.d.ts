import React from 'react';
import { AttendanceSession, StudentProfile } from '@truemuster/domain-contracts';
interface Props {
    student: StudentProfile;
    session: AttendanceSession;
    isMarkedPresent: boolean;
    onOpenScanner: () => void;
    onOpenHistory: () => void;
}
export declare const STU03_StudentHome: React.FC<Props>;
export {};
