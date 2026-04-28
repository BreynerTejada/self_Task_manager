import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  trailing?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, trailing }: SectionHeaderProps) {
  return (
    <Stack direction="row" alignItems="flex-end" gap={2} sx={{ mb: 2.5 }}>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {eyebrow && (
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans"',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'primary.main',
              mb: 0.75,
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h3">{title}</Typography>
        {description && (
          <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>{description}</Typography>
        )}
      </Box>
      {trailing}
    </Stack>
  );
}
