import { Box, TextField } from '@mui/material'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  minHeight?: number
}

/**
 * Campo común para textos largos de negocio (peticiones, imputaciones y documentos).
 * Ocupa todo el espacio vertical libre del formulario y mantiene scroll interno
 * cuando el contenido supera el área disponible.
 */
export function ExpandingTextField({
  label,
  value,
  onChange,
  required = false,
  disabled = false,
  minHeight = 180,
}: Props) {
  return <Box sx={{ flex: '1 1 auto', minHeight, display: 'flex' }}>
    <TextField
      fullWidth
      multiline
      size="small"
      required={required}
      disabled={disabled}
      label={label}
      value={value}
      onChange={e => onChange(e.target.value)}
      sx={{
        flex: 1,
        display: 'flex',
        '& .MuiInputBase-root': {
          flex: 1,
          height: '100%',
          alignItems: 'flex-start',
        },
        '& textarea': {
          height: '100% !important',
          overflow: 'auto !important',
          boxSizing: 'border-box',
        },
      }}
    />
  </Box>
}
