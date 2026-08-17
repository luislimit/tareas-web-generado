import { Chip } from '@mui/material'

type Props = {
  active?: boolean | null
  activeLabel?: string
  inactiveLabel?: string
}

export function ActiveStatusChip({ active, activeLabel = 'Activo', inactiveLabel = 'Inactivo' }: Props) {
  const isActive = Boolean(active)
  return (
    <Chip
      size="small"
      label={isActive ? activeLabel : inactiveLabel}
      sx={{
        minWidth: 76,
        fontWeight: 700,
        color: '#fff',
        bgcolor: isActive ? '#2e7d32' : '#c62828',
        '& .MuiChip-label': { px: 1.1 },
      }}
    />
  )
}
