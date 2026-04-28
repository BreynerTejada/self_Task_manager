import {
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import { useUIStore } from '@/stores/uiStore';
import { useCategories } from '@/hooks/useCategories';
import * as styles from './TaskFilters.styles';

export function TaskFilters() {
  const filters = useUIStore((s) => s.filters);
  const setFilters = useUIStore((s) => s.setFilters);
  const reset = useUIStore((s) => s.resetFilters);
  const { data: categories = [] } = useCategories();

  const toggleCategory = (id: string) => {
    const set = new Set(filters.categoryIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    setFilters({ categoryIds: Array.from(set) });
  };

  return (
    <Box sx={styles.root}>
      <Stack gap={2.5}>
        <TextField
          placeholder="Search by title…"
          fullWidth
          size="small"
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Box>
          <Typography sx={styles.label}>Status</Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {(['all', 'pending', 'in_progress', 'completed'] as const).map((s) => (
              <Chip
                key={s}
                label={s === 'all' ? 'All' : s.replace('_', ' ')}
                onClick={() => setFilters({ status: s })}
                sx={styles.chip(filters.status === s)}
              />
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography sx={styles.label}>Priority</Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {(['all', 'low', 'medium', 'high'] as const).map((p) => (
              <Chip
                key={p}
                label={p === 'all' ? 'All' : p}
                onClick={() => setFilters({ priority: p })}
                sx={styles.chip(filters.priority === p)}
              />
            ))}
          </Stack>
        </Box>

        <Box>
          <Typography sx={styles.label}>Date range</Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {(
              [
                ['all', 'All'],
                ['today', 'Today'],
                ['week', 'This week'],
                ['month', 'This month'],
                ['overdue', 'Overdue'],
              ] as const
            ).map(([v, label]) => (
              <Chip
                key={v}
                label={label}
                onClick={() => setFilters({ dateRange: v })}
                sx={styles.chip(filters.dateRange === v)}
              />
            ))}
          </Stack>
        </Box>

        {categories.length > 0 && (
          <Box>
            <Typography sx={styles.label}>Categories</Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  label={`${c.icon} ${c.name}`}
                  onClick={() => toggleCategory(c.id)}
                  sx={{
                    ...styles.chip(filters.categoryIds.includes(c.id)),
                    borderColor: filters.categoryIds.includes(c.id) ? c.color : undefined,
                    color: filters.categoryIds.includes(c.id) ? c.color : undefined,
                    backgroundColor: filters.categoryIds.includes(c.id) ? `${c.color}1f` : undefined,
                  }}
                />
              ))}
            </Stack>
          </Box>
        )}

        <Stack direction="row" gap={1.5}>
          <FormControl fullWidth size="small">
            <InputLabel>Sort by</InputLabel>
            <Select
              label="Sort by"
              value={filters.sortBy}
              onChange={(e) => setFilters({ sortBy: e.target.value as typeof filters.sortBy })}
            >
              <MenuItem value="due">Due date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="created">Created</MenuItem>
              <MenuItem value="manual">Manual</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 110 }}>
            <InputLabel>Order</InputLabel>
            <Select
              label="Order"
              value={filters.sortDir}
              onChange={(e) => setFilters({ sortDir: e.target.value as 'asc' | 'desc' })}
            >
              <MenuItem value="asc">Asc</MenuItem>
              <MenuItem value="desc">Desc</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Button
          onClick={reset}
          variant="text"
          startIcon={<RestartAltRoundedIcon />}
          sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}
        >
          Reset filters
        </Button>
      </Stack>
    </Box>
  );
}
