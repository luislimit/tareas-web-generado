import { Button, InputAdornment, TextField } from '@mui/material'
import { useRef } from 'react'
import { AppIcon } from '../common/AppIcon'

interface Props {
  label: string
  value: string
  disabled?: boolean
  required?: boolean
  defaultDirectory?: string
  onChange: (value: string) => void
}

function joinPath(directory: string, fileName: string) {
  if (!directory) return fileName
  const separator = directory.includes('\\') ? '\\' : '/'
  return `${directory.replace(/[\\/]$/, '')}${separator}${fileName}`
}

export function FilePathField({ label, value, disabled, required, defaultDirectory = '', onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return <>
    <input
      ref={inputRef}
      type="file"
      hidden
      disabled={disabled}
      onChange={event => {
        const file = event.target.files?.[0]
        if (file) onChange(joinPath(defaultDirectory, file.name))
        event.target.value = ''
      }}
    />
    <TextField
      fullWidth
      size="small"
      required={required}
      disabled={disabled}
      label={label}
      value={value}
      onChange={event => onChange(event.target.value)}
      helperText={defaultDirectory ? `Ruta por defecto de la petición: ${defaultDirectory}` : undefined}
      InputProps={{
        endAdornment: <InputAdornment position="end">
          <Button size="small" disabled={disabled} startIcon={<AppIcon name="folder" fontSize="small" />} onClick={() => inputRef.current?.click()}>
            Buscar
          </Button>
        </InputAdornment>,
      }}
    />
  </>
}
