import { Box, Button, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import { format, addMonths, subMonths } from 'date-fns';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { SectionHeader } from '@/components/ui';
import { useTasksInRange, useUpdateTask, useCreateTask } from '@/hooks/useTasks';
import { useUIStore } from '@/stores/uiStore';
import * as styles from './CalendarPage.styles';

export function CalendarPage() {
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek'>('dayGridMonth');
  const [cursor, setCursor] = useState(new Date());
  const navigate = useNavigate();
  const update = useUpdateTask();
  const create = useCreateTask();
  const openQuickAdd = useUIStore((s) => s.openQuickAdd);

  const range = useMemo(() => {
    const start = format(subMonths(cursor, 1), 'yyyy-MM-dd');
    const end = format(addMonths(cursor, 2), 'yyyy-MM-dd');
    return { start, end };
  }, [cursor]);

  const { data: tasks = [] } = useTasksInRange(range.start, range.end);

  const events: EventInput[] = useMemo(
    () =>
      tasks
        .filter((t) => t.due_date)
        .map((t) => ({
          id: t.id,
          title: t.title,
          start: t.due_time ? `${t.due_date}T${t.due_time}` : t.due_date!,
          allDay: !t.due_time,
          backgroundColor: t.category?.color ?? '#6366f1',
          borderColor: t.category?.color ?? '#6366f1',
          extendedProps: { task: t },
          classNames: [t.status === 'completed' ? 'fc-task-completed' : ''],
        })),
    [tasks],
  );

  const handleSelect = async (arg: DateSelectArg) => {
    const title = window.prompt('New task title');
    if (!title?.trim()) return;
    await create.mutateAsync({
      title: title.trim(),
      due_date: format(arg.start, 'yyyy-MM-dd'),
      priority: 'medium',
    });
  };

  const handleEventClick = (arg: EventClickArg) => {
    navigate(`/tasks/${arg.event.id}`);
  };

  const handleEventDrop = (arg: EventDropArg) => {
    const newDate = arg.event.start;
    if (!newDate) return;
    update.mutate({
      id: arg.event.id,
      patch: {
        due_date: format(newDate, 'yyyy-MM-dd'),
        due_time: arg.event.allDay ? null : format(newDate, 'HH:mm:ss'),
      },
    });
  };

  return (
    <Stack gap={3}>
      <SectionHeader
        eyebrow="Calendar"
        title="See your week unfold."
        description="Drag tasks to reschedule, click any day to add a task on the spot."
        trailing={
          <Stack direction="row" gap={1} alignItems="center">
            <ToggleButtonGroup
              size="small"
              exclusive
              value={view}
              onChange={(_, v) => v && setView(v)}
              sx={styles.toggleGroup}
            >
              <ToggleButton value="dayGridMonth">Month</ToggleButton>
              <ToggleButton value="timeGridWeek">Week</ToggleButton>
            </ToggleButtonGroup>
            <Button onClick={openQuickAdd} variant="contained" startIcon={<AddRoundedIcon />}>
              Add task
            </Button>
          </Stack>
        }
      />

      <Box sx={styles.calendarShell}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          key={view}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
          height="auto"
          events={events}
          editable
          selectable
          selectMirror
          dayMaxEvents={3}
          datesSet={(arg) => setCursor(arg.start)}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          select={handleSelect}
          eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
          buttonText={{ today: 'Today' }}
          firstDay={1}
        />
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', color: 'text.disabled', mt: 1.5 }}>
          {tasks.length} tasks scheduled in this view
        </Typography>
      </Box>
    </Stack>
  );
}
