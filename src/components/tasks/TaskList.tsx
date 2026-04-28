import { Stack } from '@mui/material';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import type { TaskWithRelations } from '@/types/database';

interface Props {
  tasks: TaskWithRelations[];
  hideCategory?: boolean;
  onClick?: (task: TaskWithRelations) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } },
};

export function TaskList({ tasks, hideCategory, onClick }: Props) {
  return (
    <Stack
      component={motion.div}
      variants={container}
      initial="hidden"
      animate="show"
      gap={1.25}
    >
      {tasks.map((t) => (
        <motion.div key={t.id} variants={item}>
          <TaskCard task={t} hideCategory={hideCategory} onClick={onClick} />
        </motion.div>
      ))}
    </Stack>
  );
}
