import { Autocomplete, TextField } from '@mui/material';
import { activePlusCurrent, onlyActive } from '../../utils/activeOptions';

export interface ActiveOption {
  id: number;
  activo: boolean;
  nombre: string;
}

interface Props<T extends ActiveOption> {
  label: string;
  options: T[];
  valueId?: number | null;
  onChange: (id: number | null) => void;
  disabled?: boolean;
  required?: boolean;
  allowCurrentInactive?: boolean;
  error?: boolean;
  helperText?: string;
}

/**
 * Selector para formularios de alta/edición.
 * Nunca ofrece inactivos como nueva selección.
 */
export function ActiveEntityAutocomplete<T extends ActiveOption>({
  label,
  options,
  valueId,
  onChange,
  disabled,
  required,
  allowCurrentInactive = true,
  error,
  helperText,
}: Props<T>) {
  const selectable = allowCurrentInactive
    ? activePlusCurrent(options, valueId)
    : onlyActive(options);
  const value = selectable.find((item) => item.id === valueId) ?? null;

  return (
    <Autocomplete
      size="small"
      options={selectable}
      value={value}
      disabled={disabled}
      getOptionLabel={(option) => option.nombre}
      isOptionEqualToValue={(option, selected) => option.id === selected.id}
      onChange={(_, option) => onChange(option?.id ?? null)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
}
