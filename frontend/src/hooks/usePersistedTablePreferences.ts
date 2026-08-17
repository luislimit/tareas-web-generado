import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PreferenciaUsuario } from '../api/preferenciasUsuarioApi';
import { useGuardarPreferenciasUsuario, usePreferenciasUsuario } from './usePreferenciasUsuario';

export interface TablePreferences {
  filters?: unknown;
  columnVisibilityModel?: Record<string, boolean>;
  columnOrder?: string[];
  columnWidths?: Record<string, number>;
  density?: 'compact' | 'standard' | 'comfortable';
}

interface UsePersistedTablePreferencesArgs {
  usuarioId?: number | null;
  storageKey: string;
  defaultValue?: TablePreferences;
}

function safeParse<T>(value?: string | null): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

function fromServer(pref?: PreferenciaUsuario): TablePreferences {
  if (!pref) return {};
  return {
    filters: safeParse(pref.filtrosPeticiones),
    columnVisibilityModel: safeParse(pref.columnasVisibles),
    columnOrder: safeParse(pref.ordenColumnas),
    columnWidths: safeParse(pref.anchoColumnas),
    density: (pref.densidad as TablePreferences['density']) || undefined,
  };
}

/**
 * Persistencia doble:
 *  - inmediata en localStorage para sobrevivir a recargas/cierres;
 *  - sincronizada con preferencias del usuario en backend cuando existe usuario actual.
 *
 * El nombre storageKey debe identificar la pantalla, por ejemplo "peticiones".
 */
export function usePersistedTablePreferences({
  usuarioId,
  storageKey,
  defaultValue = {},
}: UsePersistedTablePreferencesArgs) {
  const localKey = `tareas:${usuarioId ?? 'anon'}:${storageKey}:table`;
  const server = usePreferenciasUsuario(usuarioId);
  const saveServer = useGuardarPreferenciasUsuario(usuarioId);
  const hydrated = useRef(false);

  const localInitial = useMemo(() => {
    if (typeof window === 'undefined') return defaultValue;
    return safeParse<TablePreferences>(window.localStorage.getItem(localKey)) ?? defaultValue;
  }, [localKey]);

  const [value, setValue] = useState<TablePreferences>(localInitial);

  useEffect(() => {
    hydrated.current = false;
    const local = typeof window === 'undefined'
      ? undefined
      : safeParse<TablePreferences>(window.localStorage.getItem(localKey));
    setValue(local ?? defaultValue);
  }, [localKey]);

  useEffect(() => {
    if (!server.data || hydrated.current) return;
    const remote = fromServer(server.data);
    setValue((current) => ({ ...current, ...remote }));
    hydrated.current = true;
  }, [server.data]);

  const persist = useCallback((next: TablePreferences) => {
    setValue(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(localKey, JSON.stringify(next));
    }

    if (usuarioId) {
      const base = server.data;
      saveServer.mutate({
        ultimaRutaDocumentos: base?.ultimaRutaDocumentos ?? null,
        filtrosPeticiones: JSON.stringify(next.filters ?? null),
        columnasVisibles: JSON.stringify(next.columnVisibilityModel ?? null),
        ordenColumnas: JSON.stringify(next.columnOrder ?? null),
        anchoColumnas: JSON.stringify(next.columnWidths ?? null),
        densidad: next.density ?? null,
        ultimoUsuarioId: base?.ultimoUsuarioId ?? null,
        ultimaPeticionId: base?.ultimaPeticionId ?? null,
        pestanaActiva: base?.pestanaActiva ?? null,
        tema: base?.tema ?? null,
      });
    }
  }, [localKey, saveServer, server.data, usuarioId]);

  const patch = useCallback((partial: Partial<TablePreferences>) => {
    persist({ ...value, ...partial });
  }, [persist, value]);

  return {
    preferences: value,
    setPreferences: persist,
    patchPreferences: patch,
    loadingPreferences: Boolean(usuarioId) && server.isLoading,
  };
}
