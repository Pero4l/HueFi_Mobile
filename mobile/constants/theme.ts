import { Platform } from 'react-native';

const tintColorLight = '#10B981'; // Emerald
const tintColorDark = '#34D399'; // Lighter Emerald for Dark Mode

export const Colors = {
  light: {
    text: '#1E293B',
    background: '#F8FAFC',
    tint: tintColorLight,
    icon: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    surface: '#FFFFFF',
    border: '#E2E8F0',
    primary: '#10B981', // Emerald
    secondary: '#F59E0B', // Amber/Gold
    accent: '#8B5CF6', // Violet
    muted: '#64748B',
    error: '#EF4444',
    success: '#10B981',
    card: '#FFFFFF',
  },
  dark: {
    text: '#F1F5F9',
    background: '#050505',
    tint: tintColorDark,
    icon: '#94A3B8',
    tabIconDefault: '#475569',
    tabIconSelected: tintColorDark,
    surface: '#0A0A0A',
    border: '#1A1A1A',
    primary: '#10B981',
    secondary: '#FBBF24', // Lighter Amber
    accent: '#A78BFA', // Lighter Violet
    muted: '#94A3B8',
    error: '#F87171',
    success: '#34D399',
    card: '#0F172A',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
