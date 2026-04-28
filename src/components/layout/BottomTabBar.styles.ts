import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  display: { xs: 'flex', md: 'none' },
  position: 'fixed',
  insetInline: 0,
  bottom: 0,
  height: 68,
  paddingBottom: 'env(safe-area-inset-bottom)',
  backgroundColor: 'background.paper',
  borderTop: '1px solid',
  borderColor: 'divider',
  zIndex: 8,
  alignItems: 'center',
  justifyContent: 'space-around',
  paddingInline: 1,
};

export const tab = (active: boolean): SxProps<Theme> => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 0.25,
  textDecoration: 'none',
  color: active ? 'primary.main' : 'text.secondary',
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: active ? 600 : 500,
  fontSize: 10.5,
  paddingTop: 1,
  paddingBottom: 0.5,
  position: 'relative',
  '&::after': active
    ? {
        content: '""',
        position: 'absolute',
        top: 4,
        width: 28,
        height: 3,
        borderRadius: 2,
        background: 'linear-gradient(90deg, #818cf8, #8b5cf6)',
      }
    : undefined,
});

export const fab: SxProps<Theme> = {
  width: 52,
  height: 52,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #8b5cf6 100%)',
  color: 'white',
  display: 'grid',
  placeItems: 'center',
  marginTop: -3,
  border: '4px solid',
  borderColor: 'background.default',
  boxShadow: '0 12px 24px -8px rgba(99,102,241,0.55)',
  cursor: 'pointer',
  transition: 'transform 160ms ease',
  '&:hover': { transform: 'scale(1.05)' },
  '&:active': { transform: 'scale(0.96)' },
};
