import { TextField, type TextFieldProps } from '@mui/material'
import { useState } from 'react'

/**
 * Obtiene el valor más completo posible de un fichero arrastrado.
 *
 * Los navegadores web convencionales ocultan deliberadamente la ruta absoluta
 * de un fichero local por seguridad. Algunos contenedores de escritorio
 * (Electron, WebView, etc.) sí exponen `file.path`; y algunos orígenes de drag
 * proporcionan una URI file:// mediante dataTransfer.
 */
function droppedFileValue(file: File | undefined, dataTransfer: DataTransfer): string {
  if (file) {
    const extendedFile = file as File & { path?: string; webkitRelativePath?: string }
    if (extendedFile.path?.trim()) return extendedFile.path.trim()
    if (extendedFile.webkitRelativePath?.trim()) return extendedFile.webkitRelativePath.trim()
  }

  const uriList = dataTransfer.getData('text/uri-list')
    .split(/\r?\n/)
    .map(value => value.trim())
    .find(value => value && !value.startsWith('#'))

  const raw = uriList || dataTransfer.getData('text/plain').trim()
  if (raw) {
    // Si viene de un arrastre de fichero y el navegador expone file://,
    // conservamos la ruta completa en un formato entendible por Windows.
    if (/^file:\/\//i.test(raw)) {
      try {
        const url = new URL(raw)
        let path = decodeURIComponent(url.pathname)
        if (/^\/[A-Za-z]:\//.test(path)) path = path.slice(1)
        return path.replace(/\//g, '\\')
      } catch {
        return decodeURIComponent(raw.replace(/^file:\/\/+?/i, '')).replace(/\//g, '\\')
      }
    }

    // Para un recurso arrastrado directamente desde una página web conservamos
    // la URL completa, no solo el último segmento.
    if (/^https?:\/\//i.test(raw)) return raw
  }

  // En Chrome/Edge/Firefox al arrastrar desde el Explorador de Windows lo
  // normal es que solo esté disponible File.name. No existe una API web
  // estándar que permita recuperar la ruta absoluta en ese caso.
  return file?.name ?? raw ?? ''
}

export interface FileDropTextFieldProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string
  onValueChange: (value: string) => void
}

export function FileDropTextField({
  value,
  onValueChange,
  helperText = 'Para indicar la ruta completa: en el Explorador de Windows use Shift + clic derecho → Copiar como ruta y después Ctrl+V en este campo.',
  ...props
}: FileDropTextFieldProps) {
  const [dragging, setDragging] = useState(false)

  return <TextField
    {...props}
    value={value}
    onChange={e => onValueChange(e.target.value)}
    helperText={helperText}
    onDragEnter={e => {
      e.preventDefault()
      setDragging(true)
    }}
    onDragOver={e => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
      setDragging(true)
    }}
    onDragLeave={e => {
      // Evita apagar el resaltado al pasar sobre elementos internos del TextField.
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
    }}
    onDrop={e => {
      e.preventDefault()
      e.stopPropagation()
      setDragging(false)

      const valueFromDrop = droppedFileValue(e.dataTransfer.files?.[0], e.dataTransfer)
      if (valueFromDrop) onValueChange(valueFromDrop)
    }}
    sx={{
      ...props.sx,
      '& .MuiOutlinedInput-root': dragging
        ? { backgroundColor: 'action.hover', outline: '2px dashed', outlineColor: 'primary.main' }
        : undefined,
    }}
  />
}
