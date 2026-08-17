import { IconButton, Tooltip } from '@mui/material'
import { AppIcon } from './AppIcon'

interface Props {
  onClick: () => void
}

export function ClearFiltersButton({ onClick }: Props) {
  return (
    <Tooltip title="Limpiar filtros">
      <IconButton aria-label="Limpiar filtros" size="small" onClick={onClick}>
        <AppIcon name="clearFilters" fontSize="small" />
      </IconButton>
    </Tooltip>
  )
}
