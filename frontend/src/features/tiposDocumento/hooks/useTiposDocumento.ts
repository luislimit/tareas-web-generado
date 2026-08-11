import { useQuery } from '@tanstack/react-query'
import { getTiposDocumento } from '../api/tipoDocumentoApi'
export function useTiposDocumento(){return useQuery({queryKey:['tipos-documento'],queryFn:getTiposDocumento})}
