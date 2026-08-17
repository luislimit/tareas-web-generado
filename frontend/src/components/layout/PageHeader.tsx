import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { AppIcon } from '../common/AppIcon'

interface PageHeaderProps {
  title: string
  subtitle?: string
  createLabel?: string
  onCreate?: () => void
  exportLabel?: string
  onExport?: () => void
  clearFiltersLabel?: string
  onClearFilters?: () => void
  children?: ReactNode
}

const actionButtonSx = {
  width: 42,
  height: 42,
  '& svg': { fontSize: 30 },
}

export function PageHeader({
  title,
  subtitle,
  createLabel,
  onCreate,
  exportLabel = 'Exportar a Excel',
  onExport,
  clearFiltersLabel = 'Limpiar filtros',
  onClearFilters,
  children,
}: PageHeaderProps) {
  return (
    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: .25 }}>{subtitle}</Typography>}
      </Box>
      <Stack direction="row" spacing={.75} alignItems="center">
        {children}
        {onClearFilters && (
          <Tooltip title={clearFiltersLabel}>
            <IconButton aria-label={clearFiltersLabel} onClick={onClearFilters} sx={{ ...actionButtonSx, color: 'text.secondary' }}>
              <AppIcon name="clearFilters" />
            </IconButton>
          </Tooltip>
        )}
        {onExport && (
          <Tooltip title={exportLabel}>
            <IconButton aria-label={exportLabel} onClick={onExport} sx={{ ...actionButtonSx, color: '#217346' }}>
              <AppIcon name="excel" />
            </IconButton>
          </Tooltip>
        )}
        {onCreate && createLabel && (
          <Tooltip title={createLabel}>
            <IconButton color="primary" onClick={onCreate} aria-label={createLabel} sx={actionButtonSx}>
              <AppIcon name="newDocument" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  )
}
