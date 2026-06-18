/**
 * Uygulamanın hafif tasarım sistemi: renkler (açık/koyu), tipografi, spacing, radius.
 * Tek vurgu rengi + nötrler. Minimal ama tutarlı.
 */

import '@/global.css';

import { Platform } from 'react-native';

const accent = '#F4511E'; // enerjik turuncu — tek vurgu rengi
const accentDark = '#FF6B3D';

export const Colors = {
  light: {
    text: '#16181C',
    textSecondary: '#60646C',
    textMuted: '#8B8F98',
    background: '#FBFBFC',
    card: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E7E8EC',
    border: '#E4E5E9',
    accent,
    accentSoft: '#FCE6DD',
    onAccent: '#FFFFFF',
    success: '#1F9D55',
    danger: '#E5484D',
  },
  dark: {
    text: '#ECEDEE',
    textSecondary: '#B0B4BA',
    textMuted: '#7C8088',
    background: '#0B0C0E',
    card: '#16181C',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    border: '#2A2C30',
    accent: accentDark,
    accentSoft: '#3A241B',
    onAccent: '#10120F',
    success: '#30A46C',
    danger: '#FF6369',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;
export type Theme = { [K in keyof typeof Colors.light]: string };

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
})!;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 34,
} as const;

export const MaxContentWidth = 560;
