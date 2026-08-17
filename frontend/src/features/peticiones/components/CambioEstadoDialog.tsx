import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { onlyActive } from '../../../utils/activeOptions';

export interface EstadoOption {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface CambioEstadoPayload {
  estadoNuevoId: number;
  usuarioId: number;
  fechaCambio?: string;
  observaciones: string;
}

interface Props {
  open: boolean;
  currentEstadoId: number;
  usuarioId: number;
  estados: EstadoOption[];
  submitting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onSubmit: (payload: CambioEstadoPayload) => void;
}

export function CambioEstadoDialog({
  open,
  currentEstadoId,
  usuarioId,
  estados,
  submitting,
  errorMessage,
  onClose,
  onSubmit,
}: Props) {
  const [estadoNuevoId, setEstadoNuevoId] = useState<number | ''>('');
  const [observaciones, setObservaciones] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const selectable = useMemo(
    () => onlyActive(estados).filter((estado) => estado.id !== currentEstadoId),
    [currentEstadoId, estados],
  );

  useEffect(() => {
    if (!open) return;
    setEstadoNuevoId('');
    setObservaciones('');
    setLocalError(null);
  }, [open]);

  const submit = () => {
    if (!estadoNuevoId) {
      setLocalError('Debe seleccionar un estado nuevo.');
      return;
    }
    if (estadoNuevoId === currentEstadoId) {
      setLocalError('El nuevo estado debe ser distinto del estado actual.');
      return;
    }
    if (!observaciones.trim()) {
      setLocalError('La descripción/observaciones del cambio de estado es obligatoria.');
      return;
    }

    setLocalError(null);
    onSubmit({
      estadoNuevoId,
      usuarioId,
      observaciones: observaciones.trim(),
    });
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>Cambiar estado</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {(localError || errorMessage) && <Alert severity="error">{localError || errorMessage}</Alert>}
          <TextField
            select
            fullWidth
            size="small"
            label="Nuevo estado"
            value={estadoNuevoId}
            onChange={(event) => setEstadoNuevoId(Number(event.target.value) || '')}
          >
            {selectable.map((estado) => (
              <MenuItem key={estado.id} value={estado.id}>{estado.nombre}</MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            required
            multiline
            minRows={3}
            label="Descripción / observaciones"
            value={observaciones}
            onChange={(event) => setObservaciones(event.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancelar</Button>
        <Button variant="contained" onClick={submit} disabled={submitting}>Cambiar estado</Button>
      </DialogActions>
    </Dialog>
  );
}
