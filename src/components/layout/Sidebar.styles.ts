import type { SxProps, Theme } from '@mui/material';

export const root = (collapsed: boolean): SxProps<Theme> => ({
  display: { xs: 'none', md: 'flex' },
  flexDirection: 'column',
  width: collapsed ? 76 : 264,
  position: 'fixed',
  inset: '0 auto 0 0',
  height: '100vh',
  borderRight: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
  paddingBlock: 2,
  paddingInline: collapsed ? 1 : 1.75,
  zIndex: 5,
  transition: 'width 280ms cubic-bezier(0.32, 0.72, 0, 1), padding 280ms cubic-bezier(0.32, 0.72, 0, 1)',
});

export const brand = (collapsed: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  paddingInline: collapsed ? 0 : 1,
  paddingBlock: 1.25,
  justifyContent: collapsed ? 'center' : 'flex-start',
});

export const brandMark: SxProps<Theme> = {
  width: 36,
  height: 36,
  borderRadius: '11px',
  background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 50%, #8b5cf6 100%)',
  display: 'grid',
  placeItems: 'center',
  color: 'white',
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: 17,
  letterSpacing: '-0.04em',
  boxShadow: '0 6px 16px -8px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.25)',
};

export const brandText: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: 800,
  fontSize: 19,
  letterSpacing: '-0.03em',
};

export const addBtn = (collapsed: boolean): SxProps<Theme> => ({
  marginBlock: 2,
  height: 44,
  borderRadius: '12px',
  width: '100%',
  justifyContent: collapsed ? 'center' : 'flex-start',
  paddingInline: collapsed ? 0 : 2,
  gap: 1,
  fontWeight: 600,
});

export const sectionLabel = (collapsed: boolean): SxProps<Theme> => ({
  display: collapsed ? 'none' : 'block',
  fontFamily: '"Plus Jakarta Sans"',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'text.disabled',
  paddingInline: 1,
  marginTop: 2,
  marginBottom: 0.5,
});

export const navList: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.25,
};

export const navItem = (active: boolean, collapsed: boolean): SxProps<Theme> => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  height: 42,
  paddingInline: collapsed ? 0 : 1.5,
  borderRadius: '11px',
  textDecoration: 'none',
  color: active ? 'primary.main' : 'text.secondary',
  backgroundColor: active ? 'action.selected' : 'transparent',
  fontFamily: '"Plus Jakarta Sans"',
  fontWeight: active ? 600 : 500,
  fontSize: 14.5,
  position: 'relative',
  justifyContent: collapsed ? 'center' : 'flex-start',
  transition: 'background-color 160ms ease, color 160ms ease',
  '&:hover': { backgroundColor: 'action.hover', color: 'text.primary' },
  '& .nav-icon': { fontSize: 20 },
  '&::before': active && !collapsed
    ? {
        content: '""',
        position: 'absolute',
        left: -7,
        top: 9,
        bottom: 9,
        width: 3,
        borderRadius: 2,
        background: 'linear-gradient(180deg, #818cf8, #8b5cf6)',
      }
    : undefined,
});

export const categoryDot = (color: string): SxProps<Theme> => ({
  width: 10,
  height: 10,
  borderRadius: '50%',
  backgroundColor: color,
  flexShrink: 0,
  boxShadow: `0 0 0 3px ${color}22`,
});

export const collapseToggle: SxProps<Theme> = {
  marginTop: 'auto',
  alignSelf: 'flex-end',
  width: 32,
  height: 32,
};

export const userCard = (collapsed: boolean): SxProps<Theme> => ({
  marginTop: 2,
  display: 'flex',
  alignItems: 'center',
  gap: 1.25,
  padding: collapsed ? 0.5 : 1.25,
  borderRadius: '14px',
  backgroundColor: 'surface.soft',
  border: '1px solid',
  borderColor: 'divider',
  justifyContent: collapsed ? 'center' : 'flex-start',
});
