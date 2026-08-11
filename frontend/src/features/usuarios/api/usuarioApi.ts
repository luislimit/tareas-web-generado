import { apiClient } from '../../../api/apiClient'
import type { Usuario } from '../types/usuario'
export async function getUsuarios():Promise<Usuario[]>{const {data}=await apiClient.get<Usuario[]>('/usuarios');return data}
