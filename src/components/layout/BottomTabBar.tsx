import { Box, IconButton } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useUIStore } from '@/stores/uiStore';
import * as styles from './BottomTabBar.styles';

const TABS = [
  { to: '/', label: 'Home', icon: HomeRoundedIcon, end: true },
  { to: '/tasks', label: 'Tasks', icon: ChecklistRoundedIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarMonthRoundedIcon },
  { to: '/notes', label: 'Notes', icon: StickyNote2RoundedIcon },
];

export function BottomTabBar() {
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);
  const location = useLocation();

  return (
    <Box component="nav" sx={styles.root}>
      {TABS.slice(0, 2).map(({ to, label, icon: Icon, end }) => {
        const active = end ? location.pathname === to : location.pathname.startsWith(to);
        return (
          <NavLink key={to} to={to} style={{ textDecoration: 'none', flex: 1 }}>
            <Box sx={styles.tab(active)}>
              <Icon fontSize="small" />
              <span>{label}</span>
            </Box>
          </NavLink>
        );
      })}
      <IconButton onClick={openQuickAdd} sx={styles.fab} aria-label="Add task">
        <AddRoundedIcon />
      </IconButton>
      {TABS.slice(2).map(({ to, label, icon: Icon }) => {
        const active = location.pathname.startsWith(to);
        return (
          <NavLink key={to} to={to} style={{ textDecoration: 'none', flex: 1 }}>
            <Box sx={styles.tab(active)}>
              <Icon fontSize="small" />
              <span>{label}</span>
            </Box>
          </NavLink>
        );
      })}
    </Box>
  );
}
