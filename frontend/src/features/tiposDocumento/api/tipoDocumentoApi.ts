import { apiClient } from '../../../api/apiClient'
import type { TipoDocumento } from '../types/tipoDocumento'
export async function getTiposDocumento():Promise<TipoDocumento[]>{const {data}=await apiClient.get<TipoDocumento[]>('/tipos-documento');return data}
