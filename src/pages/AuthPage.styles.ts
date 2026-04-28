import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  minHeight: '100vh',
  display: 'grid',
  placeItems: 'center',
  paddingInline: 2.5,
  paddingBlock: 6,
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: 'background.default',
};

export const aurora: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  background:
    'radial-gradient(900px 600px at 75% 5%, rgba(139,92,246,0.22), transparent 60%), ' +
    'radial-gradient(700px 500px at -5% 95%, rgba(99,102,241,0.18), transparent 60%), ' +
    'radial-gradient(500px 400px at 85% 85%, rgba(244,63,94,0.10), transparent 60%)',
};

export const gridOverlay: SxProps<Theme> = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  opacity: 0.4,
  backgroundImage: (t) => `linear-gradient(${t.palette.divider} 1px, transparent 1px),
    linear-gradient(90deg, ${t.palette.divider} 1px, transparent 1px)`,
  backgroundSize: '64px 64px',
  maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, black 30%, transparent 70%)',
};

export const card: SxProps<Theme> = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  maxWidth: 440,
  paddingInline: { xs: 3, sm: 4.5 },
  paddingBlock: { xs: 4, sm: 5 },
  borderRadius: '24px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: (t) =>
    t.palette.mode === 'dark'
      ? '0 32px 80px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02) inset'
      : '0 32px 80px -16px rgba(15,23,42,0.18), 0 0 0 1px rgba(255,255,255,0.4) inset',
};

export const logoMark: SxProps<Theme> = {
  width: 56,
  height: 56,
  borderRadius: '16px',
  background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #8b5cf6 100%)',
  display: 'grid',
  placeItems: 'center',
  color: 'white',
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: 26,
  letterSpacing: '-0.05em',
  boxShadow: '0 12px 32px -12px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.3)',
};

export const brandName: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: 26,
  letterSpacing: '-0.04em',
};

export const tagline: SxProps<Theme> = {
  fontSize: 13,
  color: 'text.secondary',
  textAlign: 'center',
  maxWidth: 320,
};

export const googleBtn: SxProps<Theme> = {
  height: 48,
  borderRadius: '12px',
  borderColor: 'divider',
  color: 'text.primary',
  fontWeight: 600,
  fontFamily: '"Plus Jakarta Sans"',
  '&:hover': { backgroundColor: 'action.hover', borderColor: 'divider' },
};

export const divider: SxProps<Theme> = {
  marginBlock: 3,
  '&::before, &::after': { borderColor: 'divider' },
};

export const submitBtn: SxProps<Theme> = {
  height: 48,
  borderRadius: '12px',
  fontSize: 15,
  fontWeight: 600,
  marginTop: 0.5,
};

export const modeSwitch: SxProps<Theme> = {
  marginTop: 3,
  textAlign: 'center',
  color: 'text.secondary',
  fontSize: 13.5,
};

export const linkBtn: SxProps<Theme> = {
  background: 'transparent',
  border: 'none',
  color: 'primary.main',
  fontWeight: 600,
  fontFamily: '"Plus Jakarta Sans"',
  cursor: 'pointer',
  fontSize: 13.5,
  '&:hover': { textDecoration: 'underline' },
};

export const footnote: SxProps<Theme> = {
  position: 'absolute',
  bottom: 24,
  fontSize: 11,
  fontFamily: '"JetBrains Mono"',
  color: 'text.disabled',
  letterSpacing: '0.06em',
  zIndex: 1,
};
