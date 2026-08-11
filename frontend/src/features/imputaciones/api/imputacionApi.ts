import { apiClient } from '../../../api/apiClient'
import type { Imputacion } from '../types/imputacion'
export async function getImputaciones(): Promise<Imputacion[]> { const {data}=await apiClient.get<Imputacion[]>('/imputaciones'); return data }
