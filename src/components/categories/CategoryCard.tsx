import { Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import type { MouseEvent } from 'react';
import type { CategoryStatsRow } from '@/hooks/useCategories';
import * as styles from './CategoryCard.styles';

const FALLBACK_COLOR = '#94a3b8';

interface Props {
  row: CategoryStatsRow;
  onView: (row: CategoryStatsRow) => void;
  onEdit?: (row: CategoryStatsRow) => void;
}

export function CategoryCard({ row, onView, onEdit }: Props) {
  const color = row.category?.color ?? FALLBACK_COLOR;
  const icon = row.category?.icon ?? '🗂️';
  const name = row.category?.name ?? 'Uncategorized';
  const isUncategorized = row.category === null;

  const handleClick = () => onView(row);

  const handleEdit = (e: MouseEvent) => {
    e.stopPropagation();
    if (onEdit) onEdit(row);
  };

  return (
    <Box sx={styles.card(color)} onClick={handleClick} role="button" tabIndex={0}>
      <Box sx={styles.header}>
        <Box sx={styles.iconBox(color)}>{icon}</Box>
        <Box sx={styles.titleStack}>
          <Typography sx={styles.name}>{name}</Typography>
          <Typography sx={styles.subtitle}>
            {row.total === 0 ? 'no tasks yet' : `${row.total} task${row.total === 1 ? '' : 's'}`}
          </Typography>
        </Box>
        {!isUncategorized && onEdit && (
          <Box className="category-actions" sx={styles.actions}>
            <Tooltip title="Edit category">
              <IconButton size="small" onClick={handleEdit}>
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <Stack gap={0.75}>
        <Box sx={styles.progressMeta}>
          <Box>
            <Typography component="span" sx={styles.progressValue}>
              {row.completionRate}
            </Typography>
            <Typography component="span" sx={styles.progressUnit}>
              %
            </Typography>
          </Box>
          <Typography sx={styles.progressLabel}>
            {row.completed} of {row.total} done
          </Typography>
        </Box>
        <Box sx={styles.progressTrack(color)}>
          <Box sx={styles.progressFill(color, row.completionRate)} />
        </Box>
      </Stack>

      <Box sx={styles.statRow}>
        <Box sx={styles.statCell}>
          <Typography sx={styles.statValue}>{row.pending + row.inProgress}</Typography>
          <Typography sx={styles.statLabel}>open</Typography>
        </Box>
        <Box sx={styles.statCell}>
          <Typography sx={{ ...styles.statValue, color: row.overdue ? 'error.main' : undefined }}>
            {row.overdue}
          </Typography>
          <Typography sx={styles.statLabel}>overdue</Typography>
        </Box>
        <Box sx={styles.statCell}>
          <Typography sx={{ ...styles.statValue, color: row.highPriority ? 'warning.main' : undefined }}>
            {row.highPriority}
          </Typography>
          <Typography sx={styles.statLabel}>high</Typography>
        </Box>
      </Box>

      <Box sx={styles.cardFooter}>
        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
          {row.completed} completed
        </Typography>
        <Button
          size="small"
          endIcon={<ArrowForwardRoundedIcon fontSize="small" />}
          sx={styles.viewBtn(color)}
          onClick={(e) => {
            e.stopPropagation();
            onView(row);
          }}
        >
          View tasks
        </Button>
      </Box>
    </Box>
  );
}
