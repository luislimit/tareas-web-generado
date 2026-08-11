import { apiClient } from '../../../api/apiClient'
import type { Estado } from '../types/estado'
export async function getEstados():Promise<Estado[]>{const {data}=await apiClient.get<Estado[]>('/estados');return data}
