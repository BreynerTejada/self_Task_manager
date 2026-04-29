import { Avatar, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import StickyNote2RoundedIcon from '@mui/icons-material/StickyNote2Rounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useUIStore } from '@/stores/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import * as styles from './Sidebar.styles';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: HomeRoundedIcon, end: true },
  { to: '/tasks', label: 'Tasks', icon: ChecklistRoundedIcon },
  { to: '/categories', label: 'Categories', icon: CategoryRoundedIcon },
  { to: '/calendar', label: 'Calendar', icon: CalendarMonthRoundedIcon },
  { to: '/notes', label: 'Notes', icon: StickyNote2RoundedIcon },
  { to: '/insights', label: 'Insights', icon: AutoAwesomeRoundedIcon },
  { to: '/analytics', label: 'Analytics', icon: InsightsRoundedIcon },
  { to: '/settings', label: 'Settings', icon: SettingsRoundedIcon },
];

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  const setFilters = useUIStore((s) => s.setFilters);
  const resetFilters = useUIStore((s) => s.resetFilters);
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);
  const { user } = useAuth();
  const { data: categories = [] } = useCategories();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    resetFilters();
    setFilters({ categoryIds: [categoryId] });
    if (location.pathname !== '/tasks') navigate('/tasks');
  };

  const initials =
    (user?.user_metadata?.full_name as string | undefined)?.split(' ').map((s) => s[0]).slice(0, 2).join('') ||
    user?.email?.[0]?.toUpperCase() ||
    'U';

  return (
    <Box component="aside" sx={styles.root(collapsed)}>
      <Box sx={styles.brand(collapsed)}>
        <Box sx={styles.brandMark}>T</Box>
        {!collapsed && <Typography sx={styles.brandText}>Tessera</Typography>}
      </Box>

      <Tooltip title={collapsed ? 'Add task (N)' : ''} placement="right">
        <Button
          variant="contained"
          color="primary"
          sx={styles.addBtn(collapsed)}
          onClick={openQuickAdd}
        >
          <AddRoundedIcon fontSize="small" />
          {!collapsed && <span>Add task</span>}
        </Button>
      </Tooltip>

      <Box sx={styles.navList}>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => {
          const active =
            end ? location.pathname === to : location.pathname === to || location.pathname.startsWith(`${to}/`);
          return (
            <Tooltip key={to} title={collapsed ? label : ''} placement="right">
              <NavLink to={to} style={{ textDecoration: 'none' }}>
                <Box sx={styles.navItem(active, collapsed)}>
                  <Icon className="nav-icon" />
                  {!collapsed && <span>{label}</span>}
                </Box>
              </NavLink>
            </Tooltip>
          );
        })}
      </Box>

      {!collapsed && categories.length > 0 && (
        <>
          <Box sx={styles.sectionHeaderRow}>
            <Typography sx={styles.sectionLabel(collapsed)}>Categories</Typography>
            <Tooltip title="Manage categories">
              <IconButton
                size="small"
                onClick={() => navigate('/categories')}
                sx={styles.sectionAction}
              >
                <ArrowOutwardRoundedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={styles.navList}>
            {categories.slice(0, 6).map((cat) => {
              const active =
                location.pathname === '/tasks' &&
                useUIStore.getState().filters.categoryIds.includes(cat.id);
              return (
                <Box
                  key={cat.id}
                  component="button"
                  onClick={() => handleCategoryClick(cat.id)}
                  sx={{
                    ...styles.navItem(active, false),
                    cursor: 'pointer',
                    background: 'transparent',
                    border: 'none',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <Box sx={styles.categoryDot(cat.color)} />
                  <span>
                    {cat.icon} {cat.name}
                  </span>
                </Box>
              );
            })}
            {categories.length > 6 && (
              <Box
                component="button"
                onClick={() => navigate('/categories')}
                sx={{
                  ...styles.navItem(false, false),
                  cursor: 'pointer',
                  background: 'transparent',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  color: 'primary.main',
                  fontSize: 13,
                }}
              >
                <Box sx={styles.categoryDot('#6366f1')} />
                <span>See all {categories.length}…</span>
              </Box>
            )}
          </Box>
        </>
      )}

      <Box sx={{ marginTop: 'auto' }}>
        <Box sx={styles.userCard(collapsed)}>
          <Avatar
            src={user?.user_metadata?.avatar_url as string | undefined}
            sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13, fontWeight: 700 }}
          >
            {initials}
          </Avatar>
          {!collapsed && (
            <Stack sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }} noWrap>
                {(user?.user_metadata?.full_name as string | undefined) ?? user?.email?.split('@')[0] ?? 'You'}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {user?.email}
              </Typography>
            </Stack>
          )}
        </Box>
        <IconButton onClick={toggle} size="small" sx={styles.collapseToggle} aria-label="Toggle sidebar">
          {collapsed ? <ChevronRightRoundedIcon fontSize="small" /> : <ChevronLeftRoundedIcon fontSize="small" />}
        </IconButton>
      </Box>
    </Box>
  );
}
