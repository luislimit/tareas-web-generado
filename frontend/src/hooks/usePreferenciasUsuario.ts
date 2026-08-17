import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getPreferenciasUsuario,
  PreferenciaUsuarioUpdate,
  updatePreferenciasUsuario,
} from '../api/preferenciasUsuarioApi';

export const preferenciasUsuarioKey = (usuarioId: number) => ['preferencias-usuario', usuarioId] as const;

export function usePreferenciasUsuario(usuarioId?: number | null) {
  return useQuery({
    queryKey: usuarioId ? preferenciasUsuarioKey(usuarioId) : ['preferencias-usuario', 'sin-usuario'],
    queryFn: () => getPreferenciasUsuario(usuarioId!),
    enabled: Boolean(usuarioId),
    staleTime: 60_000,
  });
}

export function useGuardarPreferenciasUsuario(usuarioId?: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PreferenciaUsuarioUpdate) => {
      if (!usuarioId) {
        throw new Error('No hay usuario actual para guardar preferencias');
      }
      return updatePreferenciasUsuario(usuarioId, payload);
    },
    onSuccess: (data) => {
      if (usuarioId) {
        queryClient.setQueryData(preferenciasUsuarioKey(usuarioId), data);
      }
    },
  });
}
