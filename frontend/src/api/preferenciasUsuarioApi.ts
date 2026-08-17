import { apiClient } from './apiClient';

export interface PreferenciaUsuario {
  id?: number;
  usuarioId: number;
  ultimaRutaDocumentos?: string | null;
  filtrosPeticiones?: string | null;
  columnasVisibles?: string | null;
  ordenColumnas?: string | null;
  anchoColumnas?: string | null;
  densidad?: string | null;
  ultimoUsuarioId?: number | null;
  ultimaPeticionId?: number | null;
  pestanaActiva?: string | null;
  tema?: string | null;
}

export type PreferenciaUsuarioUpdate = Omit<PreferenciaUsuario, 'id' | 'usuarioId'>;

export async function getPreferenciasUsuario(usuarioId: number): Promise<PreferenciaUsuario> {
  const { data } = await apiClient.get<PreferenciaUsuario>(`/usuarios/${usuarioId}/preferencias`);
  return data;
}

export async function updatePreferenciasUsuario(
  usuarioId: number,
  payload: PreferenciaUsuarioUpdate,
): Promise<PreferenciaUsuario> {
  const { data } = await apiClient.put<PreferenciaUsuario>(
    `/usuarios/${usuarioId}/preferencias`,
    payload,
  );
  return data;
}
