import { Alert, Box, CircularProgress, Typography } from '@mui/material'

export function LoadingState({ label = 'Cargando datos…' }: { label?: string }) {
  return (
    <Box sx={{ minHeight: 240, display: 'grid', placeItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <CircularProgress size={22} />
        <Typography color="text.secondary">{label}</Typography>
      </Box>
    </Box>
  )
}

export function ErrorState({ message }: { message: string }) {
  return <Alert severity="error">{message}</Alert>
}

export function EmptyState({ message }: { message: string }) {
  return (
    <Box sx={{ minHeight: 220, display: 'grid', placeItems: 'center' }}>
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  )
}
