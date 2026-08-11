import { useQuery } from '@tanstack/react-query'
import { getImputaciones } from '../api/imputacionApi'
export function useImputaciones(){return useQuery({queryKey:['imputaciones'],queryFn:getImputaciones})}
