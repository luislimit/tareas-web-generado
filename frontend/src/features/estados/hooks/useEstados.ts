import { useQuery } from '@tanstack/react-query'
import { getEstados } from '../api/estadoApi'
export function useEstados(){return useQuery({queryKey:['estados'],queryFn:getEstados})}
