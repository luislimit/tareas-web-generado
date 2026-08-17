import { useQuery } from '@tanstack/react-query'
import { getTiposHora } from '../api/tipoHoraApi'
export function useTiposHora(){return useQuery({queryKey:['tipos-hora'],queryFn:getTiposHora})}
