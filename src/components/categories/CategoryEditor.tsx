import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from '@/hooks/useCategories';
import type { Category } from '@/types/database';
import * as styles from './CategoryEditor.styles';

const COLOR_PALETTE = [
  '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
  '#f43f5e', '#f97316', '#f59e0b', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6',
  '#06b6d4', '#0ea5e9', '#3b82f6', '#64748b',
];

const ICON_PALETTE = [
  '📁', '💼', '🎯', '🚀', '🧠', '💡', '🎨', '📚', '✍️', '🧪',
  '💻', '📱', '🏠', '🛒', '🍳', '🏋️', '🧘', '🏃', '⚽', '🎵',
  '🎮', '🎬', '✈️', '🌱', '💰', '⭐', '🔥', '❤️', '🌙', '☕',
];

export interface CategoryEditorProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryEditor({ open, onClose, category }: CategoryEditorProps) {
  const isEditing = Boolean(category);
  const create = useCreateCategory();
  const update = useUpdateCategory();
  const remove = useDeleteCategory();

  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [icon, setIcon] = useState(ICON_PALETTE[0]);

  useEffect(() => {
    if (open) {
      setName(category?.name ?? '');
      setColor(category?.color ?? COLOR_PALETTE[0]);
      setIcon(category?.icon ?? ICON_PALETTE[0]);
    }
  }, [open, category]);

  const submitting = create.isPending || update.isPending;
  const canSubmit = useMemo(() => name.trim().length > 0 && !submitting, [name, submitting]);

  const handleSubmit = async () => {
    const payload = { name: name.trim(), color, icon };
    if (isEditing && category) {
      await update.mutateAsync({ id: category.id, patch: payload });
    } else {
      await create.mutateAsync(payload);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!category) return;
    if (
      window.confirm(
        `Delete "${category.name}"? Tasks in this category will become uncategorized.`,
      )
    ) {
      await remove.mutateAsync(category.id);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: styles.dialogPaper }}
    >
      <Box sx={styles.titleRow}>
        <Stack flex={1}>
          <Typography sx={styles.headerEyebrow}>
            {isEditing ? 'Edit category' : 'New category'}
          </Typography>
          <Typography sx={styles.headerTitle}>
            {isEditing ? 'Refine the look and feel' : 'Group tasks that belong together'}
          </Typography>
        </Stack>
        <Tooltip title="Close">
          <IconButton onClick={onClose} size="small">
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={styles.previewWrap(color)}>
        <Box sx={styles.previewIcon(color)}>{icon}</Box>
        <Stack flex={1} minWidth={0}>
          <Typography sx={styles.previewName}>{name.trim() || 'Category name'}</Typography>
          <Typography sx={styles.previewHint}>
            Cards, chips and dots will use this color across the app.
          </Typography>
        </Stack>
      </Box>

      <Box sx={styles.body}>
        <Box>
          <Typography sx={styles.sectionLabel}>Name</Typography>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Health, Work, Learning…"
            autoFocus
            inputProps={{ maxLength: 40 }}
          />
        </Box>

        <Box>
          <Typography sx={styles.sectionLabel}>Color</Typography>
          <Box sx={styles.colorGrid}>
            {COLOR_PALETTE.map((c) => (
              <Box
                key={c}
                role="button"
                aria-label={`Use color ${c}`}
                onClick={() => setColor(c)}
                sx={styles.colorSwatch(c, c === color)}
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography sx={styles.sectionLabel}>Icon</Typography>
          <Box sx={styles.iconGrid}>
            {ICON_PALETTE.map((i) => (
              <Box
                key={i}
                role="button"
                aria-label={`Use icon ${i}`}
                onClick={() => setIcon(i)}
                sx={styles.iconSwatch(i === icon)}
              >
                {i}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={styles.actions}>
        <Box>
          {isEditing && (
            <Button
              variant="text"
              color="error"
              size="small"
              startIcon={<DeleteOutlineRoundedIcon />}
              onClick={handleDelete}
              disabled={remove.isPending}
            >
              Delete
            </Button>
          )}
        </Box>
        <Stack direction="row" gap={1}>
          <Button onClick={onClose} variant="text" color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!canSubmit}
          >
            {isEditing ? 'Save changes' : 'Create category'}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
}
