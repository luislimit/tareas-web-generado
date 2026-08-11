import { useQuery } from '@tanstack/react-query'
import { getSubcategorias } from '../api/subcategoriaApi'
export function useSubcategorias(){return useQuery({queryKey:['subcategorias'],queryFn:getSubcategorias})}
