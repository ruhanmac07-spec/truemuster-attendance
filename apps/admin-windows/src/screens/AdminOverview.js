import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Colors, Spacing, Radii } from '@truemuster/design-tokens';
export const AdminOverview = ({ onNavigateCorrections, onNavigateAudit }) => {
    return (_jsxs("div", { children: [_jsxs("div", { style: { marginBottom: Spacing.xl }, children: [_jsx("h1", { style: { fontSize: '24px', fontWeight: 700, color: Colors.textPrimary }, children: "Institutional Overview Dashboard (ADM-01)" }), _jsx("p", { style: { fontSize: '14px', color: Colors.textSecondary, marginTop: 4 }, children: "College-wide attendance operational metrics, active hardware geofences, and compliance queues" })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: Spacing.base, marginBottom: Spacing.xl }, children: [_jsxs("div", { style: {
                            backgroundColor: '#FFFFFF',
                            borderRadius: Radii.card,
                            padding: Spacing.base,
                            border: `1px solid ${Colors.borderDefault}`,
                        }, children: [_jsx("span", { style: { fontSize: '12px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }, children: "Total Active Students" }), _jsx("div", { style: { fontSize: '28px', fontWeight: 700, color: Colors.textPrimary, marginTop: 6 }, children: "1,480" }), _jsx("span", { style: { fontSize: '12px', color: Colors.statusSuccess, fontWeight: 600, marginTop: 4, display: 'block' }, children: "99.2% Device Binding Enrolled" })] }), _jsxs("div", { style: {
                            backgroundColor: '#FFFFFF',
                            borderRadius: Radii.card,
                            padding: Spacing.base,
                            border: `1px solid ${Colors.borderDefault}`,
                        }, children: [_jsx("span", { style: { fontSize: '12px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }, children: "Today's Attendance Rate" }), _jsx("div", { style: { fontSize: '28px', fontWeight: 700, color: Colors.brandNavy, marginTop: 6 }, children: "91.4%" }), _jsx("span", { style: { fontSize: '12px', color: Colors.textSecondary, marginTop: 4, display: 'block' }, children: "Across 42 Class Sessions" })] }), _jsxs("div", { style: {
                            backgroundColor: '#FFFFFF',
                            borderRadius: Radii.card,
                            padding: Spacing.base,
                            border: `1px solid ${Colors.borderDefault}`,
                        }, children: [_jsx("span", { style: { fontSize: '12px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }, children: "Pending Dispute Queue" }), _jsx("div", { style: { fontSize: '28px', fontWeight: 700, color: Colors.statusWarning, marginTop: 6 }, children: "3" }), _jsx("button", { onClick: onNavigateCorrections, style: {
                                    background: 'none',
                                    border: 'none',
                                    color: Colors.brandNavy,
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    marginTop: 4,
                                    padding: 0,
                                }, children: "Review Requests \u2192" })] }), _jsxs("div", { style: {
                            backgroundColor: '#FFFFFF',
                            borderRadius: Radii.card,
                            padding: Spacing.base,
                            border: `1px solid ${Colors.borderDefault}`,
                        }, children: [_jsx("span", { style: { fontSize: '12px', fontWeight: 600, color: Colors.textSecondary, textTransform: 'uppercase' }, children: "Geofence Anchors" }), _jsx("div", { style: { fontSize: '28px', fontWeight: 700, color: Colors.statusSuccess, marginTop: 6 }, children: "24 / 24" }), _jsx("span", { style: { fontSize: '12px', color: Colors.statusSuccess, fontWeight: 600, marginTop: 4, display: 'block' }, children: "All 100m Radii Verified" })] })] }), _jsxs("div", { style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: Spacing.lg }, children: [_jsxs("div", { style: {
                            backgroundColor: '#FFFFFF',
                            borderRadius: Radii.card,
                            padding: Spacing.xl,
                            border: `1px solid ${Colors.borderDefault}`,
                        }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: 700, color: Colors.textPrimary, marginBottom: Spacing.md }, children: "Active Classroom Sessions in Progress" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 12 }, children: [_jsxs("div", { style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 14px',
                                            backgroundColor: Colors.surfaceCanvas,
                                            borderRadius: Radii.control,
                                        }, children: [_jsxs("div", { children: [_jsx("span", { style: { fontSize: '12px', fontWeight: 600, color: Colors.brandNavy }, children: "CS401 \u00B7 Computing Lab 302" }), _jsx("div", { style: { fontSize: '14px', fontWeight: 600, color: Colors.textPrimary }, children: "Distributed Systems & Cloud Computing (Prof. K. Rao)" })] }), _jsx("span", { style: {
                                                    backgroundColor: Colors.statusSuccessBg,
                                                    color: Colors.statusSuccess,
                                                    padding: '4px 10px',
                                                    borderRadius: Radii.full,
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                }, children: "19 Checked In / 45" })] }), _jsxs("div", { style: {
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '12px 14px',
                                            backgroundColor: Colors.surfaceCanvas,
                                            borderRadius: Radii.control,
                                        }, children: [_jsxs("div", { children: [_jsx("span", { style: { fontSize: '12px', fontWeight: 600, color: Colors.brandNavy }, children: "EE301 \u00B7 Room 102" }), _jsx("div", { style: { fontSize: '14px', fontWeight: 600, color: Colors.textPrimary }, children: "Signals & Linear Systems (Dr. S. Mehta)" })] }), _jsx("span", { style: {
                                                    backgroundColor: Colors.statusSuccessBg,
                                                    color: Colors.statusSuccess,
                                                    padding: '4px 10px',
                                                    borderRadius: Radii.full,
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                }, children: "58 Checked In / 60" })] })] })] }), _jsxs("div", { style: {
                            backgroundColor: '#FFFFFF',
                            borderRadius: Radii.card,
                            padding: Spacing.xl,
                            border: `1px solid ${Colors.borderDefault}`,
                        }, children: [_jsx("h3", { style: { fontSize: '16px', fontWeight: 700, color: Colors.textPrimary, marginBottom: Spacing.md }, children: "System Integrity Actions" }), _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 10 }, children: [_jsx("button", { onClick: onNavigateCorrections, style: {
                                            width: '100%',
                                            padding: '12px 14px',
                                            backgroundColor: Colors.surfaceCanvas,
                                            border: `1px solid ${Colors.borderDefault}`,
                                            borderRadius: Radii.control,
                                            textAlign: 'left',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: Colors.brandNavy,
                                            cursor: 'pointer',
                                        }, children: "Open Correction Queue (ADM-10)" }), _jsx("button", { onClick: onNavigateAudit, style: {
                                            width: '100%',
                                            padding: '12px 14px',
                                            backgroundColor: Colors.surfaceCanvas,
                                            border: `1px solid ${Colors.borderDefault}`,
                                            borderRadius: Radii.control,
                                            textAlign: 'left',
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            color: Colors.brandNavy,
                                            cursor: 'pointer',
                                        }, children: "Inspect Audit Log Ledger (ADM-13)" })] })] })] })] }));
};
