/**
 * TRUEMUSTER — Design System Tokens
 * Canonical tokens matching TRUEMUSTER_Android_DESIGN_SYSTEM.md and TRUEMUSTER_Windows_DESIGN_SYSTEM.md.
 */

export const Colors = {
  // Brand Anchors
  brandNavy: '#001C5A',
  brandNavyStrong: '#07162F',
  brandBlueSoft: '#EAF0FB',
  brandRed: '#E21E2B',

  // Surfaces & Backgrounds
  surfaceCanvas: '#F5F7FA',
  surfaceCard: '#FFFFFF',
  surfaceSubtle: '#EEF2F7',

  // Text Hierarchy
  textPrimary: '#172033',
  textSecondary: '#526078',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  borderDefault: '#DCE3ED',
  borderStrong: '#CBD5E1',
  focusRing: '#2563EB',

  // Semantic Status Tokens
  statusSuccess: '#167647',
  statusSuccessBg: '#EAF0FB',
  statusWarning: '#9A5800',
  statusWarningBg: '#FEF3C7',
  statusError: '#B4232C',
  statusErrorBg: '#FEE2E2',
  statusInfo: '#1D4ED8',
  statusInfoBg: '#EFF6FF',
  statusNeutral: '#526078',
  statusNeutralBg: '#F1F5F9',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  hero: 40,
  minTouchTarget: 48, // Accessibility hard floor for mobile touchpoints
} as const;

export const Radii = {
  sm: 4,
  control: 8,  // Windows controls & standard chips
  button: 12,  // Android mobile action buttons
  card: 16,    // Content panels, session cards, camera viewports
  sheet: 20,   // Bottom sheets & modal confirmations
  full: 9999,  // Badges & pills
} as const;

export const Typography = {
  fontFamilySans: 'Inter, Roboto, system-ui, -apple-system, sans-serif',
  fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',

  display: {
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '600',
  },
  body: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '400',
  },
  bodyStrong: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600',
  },
  label: {
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '500',
  },
  meta: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: '500',
  },
  timer: {
    fontSize: '36px',
    lineHeight: '44px',
    fontWeight: '700',
    fontVariantNumeric: 'tabular-nums',
  },
} as const;

export const Motion = {
  micro: 120,    // Press feedback, icon shifts
  quick: 180,    // Buttons, simple state toggle
  standard: 240, // Sheet entrance, screen fade
  emphasis: 320, // Major stage change
} as const;
