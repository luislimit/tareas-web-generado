import { Stack } from '@mui/material'
import type { ReactNode } from 'react'

export function FilterBar({ children }: { children: ReactNode }) {
  return <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>{children}</Stack>
}
