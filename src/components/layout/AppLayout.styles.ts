import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: 'background.default',
  color: 'text.primary',
  position: 'relative',
};

export const main = (sidebarCollapsed: boolean): SxProps<Theme> => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  marginLeft: { xs: 0, md: sidebarCollapsed ? '76px' : '264px' },
  paddingBottom: { xs: '76px', md: 0 },
  transition: 'margin-left 280ms cubic-bezier(0.32, 0.72, 0, 1)',
});

export const content: SxProps<Theme> = {
  flex: 1,
  width: '100%',
  maxWidth: 1280,
  marginInline: 'auto',
  paddingInline: { xs: 2, sm: 3, md: 5 },
  paddingBlock: { xs: 2.5, md: 4 },
};

export const ambientGlow: SxProps<Theme> = {
  position: 'fixed',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 0,
  background:
    'radial-gradient(800px 500px at 80% -10%, rgba(99,102,241,0.10), transparent 60%), ' +
    'radial-gradient(600px 400px at -10% 110%, rgba(139,92,246,0.08), transparent 60%)',
};
