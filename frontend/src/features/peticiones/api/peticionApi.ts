import { apiClient } from '../../../api/apiClient'
import type { CambioEstadoRequest, Peticion, PeticionEstado, PeticionRequest } from '../types/peticion'
export async function getPeticiones():Promise<Peticion[]>{return (await apiClient.get<Peticion[]>('/peticiones')).data}
export async function createPeticion(p:PeticionRequest):Promise<Peticion>{return (await apiClient.post<Peticion>('/peticiones',p)).data}
export async function updatePeticion(id:number|string,p:PeticionRequest):Promise<Peticion>{return (await apiClient.put<Peticion>(`/peticiones/${id}`,p)).data}
export async function deletePeticion(id:number|string):Promise<void>{await apiClient.delete(`/peticiones/${id}`)}
export async function cambiarEstadoPeticion(id:number|string,p:CambioEstadoRequest):Promise<Peticion>{return (await apiClient.post<Peticion>(`/peticiones/${id}/cambio-estado`,p)).data}
export async function getHistorialPeticion(id:number|string):Promise<PeticionEstado[]>{return (await apiClient.get<PeticionEstado[]>(`/peticiones/${id}/historial`)).data}
