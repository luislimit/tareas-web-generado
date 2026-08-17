import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { AppIcon } from '../common/AppIcon'

interface PageHeaderProps {
  title: string
  subtitle?: string
  createLabel?: string
  onCreate?: () => void
  duplicateLabel?: string
  onDuplicate?: () => void
  duplicateDisabled?: boolean
  exportLabel?: string
  onExport?: () => void
  clearFiltersLabel?: string
  onClearFilters?: () => void
  editLabel?: string
  onEdit?: () => void
  editDisabled?: boolean
  deleteLabel?: string
  onDelete?: () => void
  deleteDisabled?: boolean
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
  duplicateLabel = 'Duplicar',
  onDuplicate,
  duplicateDisabled = false,
  exportLabel = 'Exportar a Excel',
  onExport,
  clearFiltersLabel = 'Limpiar filtros',
  onClearFilters,
  editLabel = 'Editar',
  onEdit,
  editDisabled = false,
  deleteLabel = 'Eliminar',
  onDelete,
  deleteDisabled = false,
  children,
}: PageHeaderProps) {
  return (
    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{title}</Typography>
        {subtitle && <Typography variant="body2" color="text.secondary" sx={{ mt: .25 }}>{subtitle}</Typography>}
      </Box>
      <Stack direction="row" spacing={.75} alignItems="center">
        {onCreate && createLabel && (
          <Tooltip title={createLabel}>
            <IconButton color="primary" onClick={onCreate} aria-label={createLabel} sx={actionButtonSx}>
              <AppIcon name="newDocument" />
            </IconButton>
          </Tooltip>
        )}
        {onDuplicate && (
          <Tooltip title={duplicateDisabled ? `${duplicateLabel} (seleccione una fila)` : duplicateLabel}>
            <span>
              <IconButton color="primary" aria-label={duplicateLabel} onClick={onDuplicate} disabled={duplicateDisabled} sx={actionButtonSx}>
                <AppIcon name="duplicate" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {onEdit && (
          <Tooltip title={editDisabled ? `${editLabel} (seleccione una fila)` : editLabel}>
            <span>
              <IconButton color="primary" aria-label={editLabel} onClick={onEdit} disabled={editDisabled} sx={actionButtonSx}>
                <AppIcon name="edit" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {onDelete && (
          <Tooltip title={deleteDisabled ? `${deleteLabel} (seleccione una fila)` : deleteLabel}>
            <span>
              <IconButton color="error" aria-label={deleteLabel} onClick={onDelete} disabled={deleteDisabled} sx={actionButtonSx}>
                <AppIcon name="delete" />
              </IconButton>
            </span>
          </Tooltip>
        )}
        {onExport && (
          <Tooltip title={exportLabel}>
            <IconButton aria-label={exportLabel} onClick={onExport} sx={{ ...actionButtonSx, color: '#217346' }}>
              <AppIcon name="excel" />
            </IconButton>
          </Tooltip>
        )}
        {onClearFilters && (
          <Tooltip title={clearFiltersLabel}>
            <IconButton aria-label={clearFiltersLabel} onClick={onClearFilters} sx={{ ...actionButtonSx, color: 'text.secondary' }}>
              <AppIcon name="clearFilters" />
            </IconButton>
          </Tooltip>
        )}
        {children}
      </Stack>
    </Stack>
  )
}
