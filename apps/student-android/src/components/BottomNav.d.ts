import React from 'react';
export type StudentTab = 'home' | 'history' | 'profile';
interface Props {
    activeTab: StudentTab;
    onSelectTab: (tab: StudentTab) => void;
}
export declare const BottomNav: React.FC<Props>;
export {};
