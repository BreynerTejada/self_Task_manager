import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputBase,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';
import { EmptyState, CardSkeleton } from '@/components/ui';
import { useCreateNote, useDeleteNote, useNotes, useUpdateNote } from '@/hooks/useNotes';
import type { Note } from '@/types/database';
import * as styles from './NotesPage.styles';

const NOTE_COLORS = [
  '#fef3c7',
  '#fde68a',
  '#fbcfe8',
  '#ddd6fe',
  '#bfdbfe',
  '#bbf7d0',
  '#fed7aa',
  '#e0e7ff',
];

export function NotesPage() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 200);
  const notes = useNotes(debouncedSearch);
  const createNote = useCreateNote();

  const sortedNotes = useMemo(() => notes.data ?? [], [notes.data]);
  const isEmpty = !notes.isLoading && sortedNotes.length === 0;

  const handleCreate = () => {
    createNote.mutate({});
  };

  return (
    <Stack sx={styles.root}>
      <Box sx={styles.header}>
        <Stack flex={1} minWidth={240} gap={0.5}>
          <Typography sx={styles.title}>Notes</Typography>
          <Typography sx={styles.subtitle}>
            Quick thoughts, journals, references — searchable and synced.
          </Typography>
        </Stack>
        <Box sx={styles.toolbar}>
          <TextField
            placeholder="Search notes…"
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
            onClick={handleCreate}
            variant="contained"
            startIcon={<AddRoundedIcon />}
            disabled={createNote.isPending}
          >
            New note
          </Button>
        </Box>
      </Box>

      {notes.isLoading ? (
        <Box sx={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} height={180} />
          ))}
        </Box>
      ) : isEmpty ? (
        <EmptyState
          illustration={search ? 'search' : 'tasks'}
          title={search ? 'No matches.' : 'No notes yet.'}
          description={
            search
              ? 'Try a different search, or clear it to see everything.'
              : 'Capture an idea — they pin, search, and sync across devices.'
          }
          action={
            !search && (
              <Button onClick={handleCreate} variant="contained" startIcon={<AddRoundedIcon />}>
                Create your first note
              </Button>
            )
          }
        />
      ) : (
        <Box sx={styles.grid}>
          {sortedNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </Box>
      )}
    </Stack>
  );
}

function NoteCard({ note }: { note: Note }) {
  const update = useUpdateNote();
  const remove = useDeleteNote();

  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const dirtyRef = useRef(false);

  useEffect(() => {
    if (!dirtyRef.current) {
      setTitle(note.title);
      setBody(note.body);
    }
  }, [note.title, note.body]);

  useEffect(() => {
    if (!dirtyRef.current) return;
    const handle = window.setTimeout(() => {
      if (title !== note.title || body !== note.body) {
        update.mutate({ id: note.id, patch: { title, body } });
      }
      dirtyRef.current = false;
    }, 600);
    return () => window.clearTimeout(handle);
  }, [title, body, note.id, note.title, note.body, update]);

  const handleTogglePin = () => {
    update.mutate({ id: note.id, patch: { pinned: !note.pinned } });
  };

  const handleColor = (color: string) => {
    update.mutate({ id: note.id, patch: { color } });
  };

  const handleDelete = () => {
    if (window.confirm('Delete this note?')) remove.mutate(note.id);
  };

  return (
    <Box sx={styles.card(note.color, note.pinned)}>
      <InputBase
        value={title}
        onChange={(e) => {
          dirtyRef.current = true;
          setTitle(e.target.value);
        }}
        placeholder="Title"
        sx={styles.titleInput}
      />
      <InputBase
        value={body}
        onChange={(e) => {
          dirtyRef.current = true;
          setBody(e.target.value);
        }}
        placeholder="Write something…"
        multiline
        minRows={4}
        sx={styles.bodyInput}
      />
      <Box sx={styles.cardFooter}>
        <Box sx={styles.colorRow}>
          {NOTE_COLORS.map((c) => (
            <Box
              key={c}
              role="button"
              aria-label={`Use color ${c}`}
              onClick={() => handleColor(c)}
              sx={styles.colorSwatch(c, c === note.color)}
            />
          ))}
        </Box>
        <Stack direction="row" alignItems="center" gap={1}>
          {note.pinned && (
            <Box sx={styles.pinnedBadge}>
              <PushPinRoundedIcon sx={{ fontSize: 12 }} /> pinned
            </Box>
          )}
          <Box>{formatDistanceToNowStrict(parseISO(note.updated_at), { addSuffix: true })}</Box>
          <Box className="note-actions" sx={styles.cardActions}>
            <Tooltip title={note.pinned ? 'Unpin' : 'Pin'}>
              <IconButton size="small" onClick={handleTogglePin}>
                {note.pinned ? (
                  <PushPinRoundedIcon fontSize="small" />
                ) : (
                  <PushPinOutlinedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete}>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
