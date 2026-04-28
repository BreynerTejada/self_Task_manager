import type { SxProps, Theme } from '@mui/material';

export const root: SxProps<Theme> = {
  position: { md: 'sticky' },
  top: { md: 88 },
  alignSelf: 'flex-start',
  width: { xs: '100%', md: 280 },
  flexShrink: 0,
  paddingInline: 2.5,
  paddingBlock: 2.5,
  borderRadius: '18px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
};

export const label: SxProps<Theme> = {
  fontFamily: '"Plus Jakarta Sans"',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'text.disabled',
  mb: 1,
};

export const chip = (active: boolean): SxProps<Theme> => ({
  borderRadius: '999px',
  border: '1px solid',
  borderColor: active ? 'primary.main' : 'divider',
  backgroundColor: active ? (t) => `${t.palette.primary.main}1f` : 'transparent',
  color: active ? 'primary.main' : 'text.primary',
  fontWeight: 600,
  fontFamily: '"Plus Jakarta Sans"',
  textTransform: 'capitalize',
  cursor: 'pointer',
  '&:hover': { backgroundColor: (t) => `${t.palette.primary.main}14` },
});
