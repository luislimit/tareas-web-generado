import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { Box, IconButton, TextField, Tooltip } from '@mui/material';
import { ChangeEvent, useRef } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  defaultDirectory?: string | null;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
}

function joinPath(directory: string, fileName: string): string {
  if (!directory) return fileName;
  const separator = directory.includes('\\') ? '\\' : '/';
  return `${directory.replace(/[\\/]$/, '')}${separator}${fileName}`;
}

/**
 * Campo único "ruta + nombre de fichero" con botón Buscar.
 *
 * Importante: por seguridad, un navegador no entrega la ruta absoluta local
 * del fichero y tampoco permite imponer una carpeta inicial arbitraria.
 * Cuando existe defaultDirectory se usa para construir el valor visible con
 * el nombre elegido; la integración nativa podrá sustituir este componente
 * sin cambiar los formularios que lo consumen.
 */
export function FilePathPicker({
  value,
  onChange,
  label = 'Fichero',
  defaultDirectory,
  disabled,
  error,
  helperText,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    onChange(defaultDirectory ? joinPath(defaultDirectory, file.name) : file.name);
    event.target.value = '';
  };

  return (
    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'flex-start' }}>
      <TextField
        fullWidth
        size="small"
        label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        error={error}
        helperText={helperText}
      />
      <Tooltip title={defaultDirectory ? `Buscar fichero. Ruta de la petición: ${defaultDirectory}` : 'Buscar fichero'}>
        <span>
          <IconButton
            aria-label="Buscar fichero"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            <FolderOpenIcon />
          </IconButton>
        </span>
      </Tooltip>
      <input ref={inputRef} type="file" hidden onChange={handleFile} />
    </Box>
  );
}
