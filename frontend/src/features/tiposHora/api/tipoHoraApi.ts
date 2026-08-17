import { apiClient } from '../../../api/apiClient'
import type { TipoHora } from '../types/tipoHora'
export async function getTiposHora():Promise<TipoHora[]>{return (await apiClient.get<TipoHora[]>('/tipos-hora')).data}
