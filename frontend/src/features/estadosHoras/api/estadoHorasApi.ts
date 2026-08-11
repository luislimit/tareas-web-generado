import { apiClient } from '../../../api/apiClient'
import type { EstadoHoras } from '../types/estadoHoras'
export async function getEstadosHoras():Promise<EstadoHoras[]>{const {data}=await apiClient.get<EstadoHoras[]>('/estados-horas');return data}
