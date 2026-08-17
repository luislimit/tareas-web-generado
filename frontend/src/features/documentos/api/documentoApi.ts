import { apiClient } from '../../../api/apiClient'
import type { Documento } from '../types/documento'
export async function getDocumentos():Promise<Documento[]>{return (await apiClient.get<Documento[]>('/documentos')).data}
export async function getDocumentosPeticion(peticionId:number|string):Promise<Documento[]>{return (await apiClient.get<Documento[]>('/documentos',{params:{peticionId}})).data}

export async function abrirDocumento(id:number|string):Promise<void>{await apiClient.post(`/documentos/${id}/abrir`)}
