import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cambiarEstadoPeticion, createPeticion, deletePeticion, getHistorialPeticion, updatePeticion } from '../api/peticionApi'
import type { CambioEstadoRequest, PeticionRequest } from '../types/peticion'
export function usePeticionMutations(){const q=useQueryClient(),inv=()=>q.invalidateQueries({queryKey:['peticiones']});return {
 createMutation:useMutation({mutationFn:createPeticion,onSuccess:inv}),
 updateMutation:useMutation({mutationFn:({id,payload}:{id:number|string,payload:PeticionRequest})=>updatePeticion(id,payload),onSuccess:inv}),
 deleteMutation:useMutation({mutationFn:deletePeticion,onSuccess:inv}),
 changeMutation:useMutation({mutationFn:({id,payload}:{id:number|string,payload:CambioEstadoRequest})=>cambiarEstadoPeticion(id,payload),onSuccess:inv}),
}}
export function useHistorialPeticion(id:number|string|undefined,enabled:boolean){return useQuery({queryKey:['peticiones',id,'historial'],queryFn:()=>getHistorialPeticion(id!),enabled:enabled&&id!=null})}
