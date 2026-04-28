import type { SxProps, Theme } from '@mui/material';

export const toggleGroup: SxProps<Theme> = {
  '& .MuiToggleButton-root': {
    fontFamily: '"Plus Jakarta Sans"',
    fontWeight: 600,
    border: '1px solid',
    borderColor: 'divider',
    paddingInline: 2,
    textTransform: 'none',
    '&.Mui-selected': {
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      borderColor: 'primary.main',
      '&:hover': { backgroundColor: 'primary.dark' },
    },
  },
};

export const calendarShell: SxProps<Theme> = (t) => ({
  paddingInline: { xs: 1.5, md: 2.5 },
  paddingBlock: { xs: 2, md: 2.5 },
  borderRadius: '20px',
  backgroundColor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  '& .fc': {
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    fontSize: 13,
    color: t.palette.text.primary,
  },
  '& .fc .fc-toolbar-title': {
    fontFamily: '"Plus Jakarta Sans"',
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: '-0.02em',
  },
  '& .fc .fc-button': {
    backgroundColor: 'transparent',
    color: t.palette.text.primary,
    borderColor: t.palette.divider,
    boxShadow: 'none',
    fontFamily: '"Plus Jakarta Sans"',
    fontWeight: 600,
    textTransform: 'none',
    paddingInline: '12px',
    borderRadius: '10px',
  },
  '& .fc .fc-button:hover': {
    backgroundColor: t.palette.action.hover,
    color: t.palette.text.primary,
  },
  '& .fc .fc-button-primary:not(:disabled).fc-button-active': {
    backgroundColor: t.palette.primary.main,
    color: t.palette.primary.contrastText,
    borderColor: t.palette.primary.main,
  },
  '& .fc-theme-standard td, & .fc-theme-standard th, & .fc-theme-standard .fc-scrollgrid': {
    borderColor: t.palette.divider,
  },
  '& .fc-col-header-cell': {
    backgroundColor: t.palette.surface.soft,
    paddingBlock: '6px',
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: t.palette.text.secondary,
  },
  '& .fc-day-today': {
    backgroundColor: `${t.palette.primary.main}0f !important`,
  },
  '& .fc-daygrid-day-number, & .fc-col-header-cell-cushion': {
    color: t.palette.text.primary,
    textDecoration: 'none',
  },
  '& .fc-event': {
    borderRadius: 8,
    paddingInline: '6px',
    paddingBlock: '2px',
    fontWeight: 600,
    fontSize: 12,
    border: 'none',
    overflow: 'hidden',
  },
  '& .fc-task-completed': { opacity: 0.5, textDecoration: 'line-through' },
});
