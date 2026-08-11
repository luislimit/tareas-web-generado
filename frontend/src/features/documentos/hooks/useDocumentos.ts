import { useQuery } from '@tanstack/react-query'
import { getDocumentos } from '../api/documentoApi'
export function useDocumentos(){return useQuery({queryKey:['documentos'],queryFn:getDocumentos})}
