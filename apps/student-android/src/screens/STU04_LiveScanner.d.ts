import React from 'react';
import { CheckInResult } from '@truemuster/domain-contracts';
interface Props {
    onClose: () => void;
    onSuccess: (result: CheckInResult) => void;
    onFailure: (reason: string, distance?: number) => void;
}
export declare const STU04_LiveScanner: React.FC<Props>;
export {};
