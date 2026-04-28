import { createTheme, type Theme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    surface: { soft: string; sunken: string; raised: string };
    accent: { violet: string; rose: string; teal: string; amber: string };
  }
  interface PaletteOptions {
    surface?: { soft: string; sunken: string; raised: string };
    accent?: { violet: string; rose: string; teal: string; amber: string };
  }
}

const display = '"Plus Jakarta Sans", system-ui, sans-serif';
const body = '"Inter", system-ui, sans-serif';
const mono = '"JetBrains Mono", ui-monospace, monospace';

const baseTypography = {
  fontFamily: body,
  h1: { fontFamily: display, fontWeight: 700, fontSize: '2.5rem', letterSpacing: '-0.03em', lineHeight: 1.1 },
  h2: { fontFamily: display, fontWeight: 700, fontSize: '2rem', letterSpacing: '-0.025em', lineHeight: 1.15 },
  h3: { fontFamily: display, fontWeight: 700, fontSize: '1.5rem', letterSpacing: '-0.02em', lineHeight: 1.2 },
  h4: { fontFamily: display, fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.015em', lineHeight: 1.25 },
  h5: { fontFamily: display, fontWeight: 600, fontSize: '1.125rem', letterSpacing: '-0.01em' },
  h6: { fontFamily: display, fontWeight: 600, fontSize: '1rem', letterSpacing: '-0.005em' },
  subtitle1: { fontFamily: display, fontWeight: 600, fontSize: '0.95rem' },
  subtitle2: { fontFamily: display, fontWeight: 600, fontSize: '0.825rem', letterSpacing: '0.02em', textTransform: 'uppercase' as const },
  body1: { fontSize: '0.95rem', lineHeight: 1.55 },
  body2: { fontSize: '0.875rem', lineHeight: 1.5 },
  button: { fontFamily: display, fontWeight: 600, textTransform: 'none' as const, letterSpacing: 0 },
  caption: { fontFamily: mono, fontSize: '0.75rem', letterSpacing: '0.01em' },
  overline: { fontFamily: display, fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase' as const },
};

const sharedShape = { borderRadius: 14 };

const lightPalette = {
  mode: 'light' as const,
  primary: { main: '#6366f1', light: '#818cf8', dark: '#4f46e5', contrastText: '#ffffff' },
  secondary: { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed', contrastText: '#ffffff' },
  success: { main: '#10b981', light: '#34d399', dark: '#059669' },
  warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
  error: { main: '#f43f5e', light: '#fb7185', dark: '#e11d48' },
  info: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
  background: { default: '#fafafb', paper: '#ffffff' },
  text: { primary: '#0f172a', secondary: '#475569', disabled: '#94a3b8' },
  divider: 'rgba(15, 23, 42, 0.08)',
  surface: { soft: '#f5f5f8', sunken: '#eef0f4', raised: '#ffffff' },
  accent: { violet: '#8b5cf6', rose: '#f43f5e', teal: '#14b8a6', amber: '#f59e0b' },
};

const darkPalette = {
  mode: 'dark' as const,
  primary: { main: '#818cf8', light: '#a5b4fc', dark: '#6366f1', contrastText: '#0a0a14' },
  secondary: { main: '#a78bfa', light: '#c4b5fd', dark: '#8b5cf6', contrastText: '#0a0a14' },
  success: { main: '#34d399', light: '#6ee7b7', dark: '#10b981' },
  warning: { main: '#fbbf24', light: '#fcd34d', dark: '#f59e0b' },
  error: { main: '#fb7185', light: '#fda4af', dark: '#f43f5e' },
  info: { main: '#22d3ee', light: '#67e8f9', dark: '#06b6d4' },
  background: { default: '#0b0b14', paper: '#13131f' },
  text: { primary: '#f1f5f9', secondary: '#94a3b8', disabled: '#64748b' },
  divider: 'rgba(148, 163, 184, 0.14)',
  surface: { soft: '#161624', sunken: '#0f0f1a', raised: '#1c1c2c' },
  accent: { violet: '#a78bfa', rose: '#fb7185', teal: '#5eead4', amber: '#fcd34d' },
};

const componentOverrides = {
  MuiCssBaseline: {
    styleOverrides: {
      ':root': {
        colorScheme: 'light dark',
      },
      'body': {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '*::-webkit-scrollbar': { width: 10, height: 10 },
      '*::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderRadius: 999,
        border: '2px solid transparent',
        backgroundClip: 'padding-box',
      },
      '*::-webkit-scrollbar-thumb:hover': { backgroundColor: 'rgba(99, 102, 241, 0.4)' },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: { borderRadius: 12, paddingInline: 18, paddingBlock: 9, boxShadow: 'none' },
      contained: {
        boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 6px 16px -8px rgba(99, 102, 241, 0.7)',
        '&:hover': { boxShadow: '0 1px 0 rgba(255,255,255,0.2) inset, 0 10px 24px -10px rgba(99, 102, 241, 0.85)' },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: { borderRadius: 16 },
      elevation1: { boxShadow: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.08)' },
    },
  },
  MuiCard: { styleOverrides: { root: { borderRadius: 18 } } },
  MuiChip: { styleOverrides: { root: { fontFamily: display, fontWeight: 600 } } },
  MuiTextField: { defaultProps: { variant: 'outlined' as const } },
  MuiOutlinedInput: {
    styleOverrides: {
      root: { borderRadius: 12 },
      notchedOutline: { borderColor: 'rgba(15,23,42,0.12)' },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: { fontFamily: display, fontWeight: 500, fontSize: '0.75rem', borderRadius: 8, paddingInline: 10, paddingBlock: 6 },
    },
  },
};

export const lightTheme: Theme = createTheme({
  palette: lightPalette,
  shape: sharedShape,
  typography: baseTypography,
  components: componentOverrides,
});

export const darkTheme: Theme = createTheme({
  palette: darkPalette,
  shape: sharedShape,
  typography: baseTypography,
  components: {
    ...componentOverrides,
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12 },
        notchedOutline: { borderColor: 'rgba(148, 163, 184, 0.2)' },
      },
    },
  },
});

export type AppTheme = typeof lightTheme;
