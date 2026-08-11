import { useQuery } from '@tanstack/react-query'
import { getUsuarios } from '../api/usuarioApi'
export function useUsuarios(){return useQuery({queryKey:['usuarios'],queryFn:getUsuarios})}
