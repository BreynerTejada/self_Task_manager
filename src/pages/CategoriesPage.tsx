import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import DonutLargeRoundedIcon from '@mui/icons-material/DonutLargeRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { useNavigate } from 'react-router-dom';
import { CategoryCard, CategoryEditor } from '@/components/categories';
import { CardSkeleton, EmptyState } from '@/components/ui';
import { useCategoriesWithStats, type CategoryStatsRow } from '@/hooks/useCategories';
import { useUIStore } from '@/stores/uiStore';
import type { Category } from '@/types/database';
import * as styles from './CategoriesPage.styles';

type SortKey = 'name' | 'tasks' | 'progress' | 'overdue';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'A → Z' },
  { key: 'tasks', label: 'Most tasks' },
  { key: 'progress', label: 'Progress' },
  { key: 'overdue', label: 'Overdue' },
];

export function CategoriesPage() {
  const navigate = useNavigate();
  const setFilters = useUIStore((s) => s.setFilters);
  const resetFilters = useUIStore((s) => s.resetFilters);
  const { data, isLoading } = useCategoriesWithStats();

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('name');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);

  const rows = useMemo(() => data ?? [], [data]);

  const totalCategories = rows.filter((r) => r.category !== null).length;
  const totalTasks = rows.reduce((acc, r) => acc + r.total, 0);
  const totalCompleted = rows.reduce((acc, r) => acc + r.completed, 0);
  const totalOverdue = rows.reduce((acc, r) => acc + r.overdue, 0);
  const overallProgress = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? rows.filter((r) => (r.category?.name ?? 'uncategorized').toLowerCase().includes(q))
      : rows;
    const sorted = [...list].sort((a, b) => {
      if (a.category === null && b.category !== null) return 1;
      if (b.category === null && a.category !== null) return -1;
      switch (sort) {
        case 'tasks':
          return b.total - a.total;
        case 'progress':
          return b.completionRate - a.completionRate;
        case 'overdue':
          return b.overdue - a.overdue;
        case 'name':
        default:
          return (a.category?.name ?? 'Uncategorized').localeCompare(
            b.category?.name ?? 'Uncategorized',
          );
      }
    });
    return sorted;
  }, [rows, search, sort]);

  const isEmpty = !isLoading && totalCategories === 0;

  const openEditor = (category: Category | null = null) => {
    setEditing(category);
    setEditorOpen(true);
  };

  const handleViewTasks = (row: CategoryStatsRow) => {
    resetFilters();
    if (row.category) {
      setFilters({ categoryIds: [row.category.id] });
    }
    navigate('/tasks');
  };

  return (
    <Stack sx={styles.root}>
      <Box sx={styles.header}>
        <Box sx={styles.titleStack}>
          <Typography sx={styles.eyebrow}>Workspace</Typography>
          <Typography sx={styles.title}>Categories</Typography>
          <Typography sx={styles.subtitle}>
            Group tasks the way your brain does — projects, areas of life, contexts. Click any
            card to filter your task list instantly.
          </Typography>
        </Box>
        <Box sx={styles.toolbar}>
          <TextField
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={styles.search}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRoundedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            onClick={() => openEditor(null)}
            variant="contained"
            startIcon={<AddRoundedIcon />}
          >
            New category
          </Button>
        </Box>
      </Box>

      <Box sx={styles.statRow}>
        <StatCard
          icon={<CategoryRoundedIcon />}
          label="Categories"
          value={isLoading ? null : totalCategories}
          accent="#6366f1"
        />
        <StatCard
          icon={<TaskAltRoundedIcon />}
          label="Tasks tracked"
          value={isLoading ? null : totalTasks}
          accent="#14b8a6"
        />
        <StatCard
          icon={<DonutLargeRoundedIcon />}
          label="Overall progress"
          value={isLoading ? null : overallProgress}
          suffix="%"
          accent="#8b5cf6"
        />
        <StatCard
          icon={<WarningAmberRoundedIcon />}
          label="Overdue"
          value={isLoading ? null : totalOverdue}
          accent="#f43f5e"
        />
      </Box>

      <Box sx={styles.sectionDivider}>
        <Typography sx={styles.sectionTitle}>
          {filtered.length} {filtered.length === 1 ? 'group' : 'groups'}
        </Typography>
        <Box sx={styles.sortGroup}>
          {SORT_OPTIONS.map((opt) => (
            <Box
              key={opt.key}
              role="button"
              tabIndex={0}
              onClick={() => setSort(opt.key)}
              sx={styles.sortChip(sort === opt.key)}
            >
              {opt.label}
            </Box>
          ))}
        </Box>
      </Box>

      {isLoading ? (
        <Box sx={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} height={240} />
          ))}
        </Box>
      ) : isEmpty ? (
        <EmptyState
          illustration="tasks"
          title="No categories yet."
          description="Categories are like rooms for your tasks — health, work, learning. Create your first one to start sorting things out."
          action={
            <Button
              onClick={() => openEditor(null)}
              variant="contained"
              startIcon={<AddRoundedIcon />}
            >
              Create your first category
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          illustration="search"
          title="No matches."
          description="Try a different search."
        />
      ) : (
        <Box sx={styles.grid}>
          {filtered.map((row) => (
            <CategoryCard
              key={row.category?.id ?? 'uncategorized'}
              row={row}
              onView={handleViewTasks}
              onEdit={(r) => r.category && openEditor(r.category)}
            />
          ))}
        </Box>
      )}

      <CategoryEditor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        category={editing}
      />
    </Stack>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  suffix?: string;
  accent: string;
}) {
  return (
    <Box sx={styles.statCard(accent)}>
      <Box sx={styles.statIcon(accent)}>{icon}</Box>
      <Typography sx={styles.statValue}>
        {value === null ? '—' : value}
        {suffix && <Box component="span" sx={{ fontSize: 16, color: 'text.secondary', ml: 0.25 }}>{suffix}</Box>}
      </Typography>
      <Typography sx={styles.statLabel}>{label}</Typography>
    </Box>
  );
}
