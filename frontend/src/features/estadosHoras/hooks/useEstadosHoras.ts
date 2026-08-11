import { useQuery } from '@tanstack/react-query'
import { getEstadosHoras } from '../api/estadoHorasApi'
export function useEstadosHoras(){return useQuery({queryKey:['estados-horas'],queryFn:getEstadosHoras})}
