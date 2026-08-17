import { InputAdornment, TextField } from '@mui/material'
import { UiGlyph } from '../common/UiGlyph'

interface Props {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchTextFilter({ value, onChange, placeholder = 'Buscar por textos...' }: Props) {
  return <TextField
    value={value}
    onChange={event => onChange(event.target.value)}
    size="small"
    placeholder={placeholder}
    sx={{ width: 360, minWidth: 260 }}
    InputProps={{ startAdornment: <InputAdornment position="start"><UiGlyph text="⌕" title="Buscar" /></InputAdornment> }}
  />
}
