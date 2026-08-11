import { apiClient } from '../../../api/apiClient'
import type { Documento } from '../types/documento'
export async function getDocumentos():Promise<Documento[]>{const {data}=await apiClient.get<Documento[]>('/documentos');return data}
