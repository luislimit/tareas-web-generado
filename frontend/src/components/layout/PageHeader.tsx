import { Box, Button, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actionLabel?: string
  actionIcon?: ReactNode
  onAction?: () => void
  children?: ReactNode
}

export function PageHeader({ title, subtitle, actionLabel, actionIcon, onAction, children }: PageHeaderProps) {
  return (
    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: .25 }}>{subtitle}</Typography>}
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        {children}
        {actionLabel && <Button variant="contained" startIcon={actionIcon} onClick={onAction}>{actionLabel}</Button>}
      </Stack>
    </Stack>
  )
}
