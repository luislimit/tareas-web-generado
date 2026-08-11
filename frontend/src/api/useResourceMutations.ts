import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createResource, deleteResource, updateResource } from './resourceApi'

export function useResourceMutations<T, P>(url:string, queryKey:string){
 const qc=useQueryClient()
 const invalidate=()=>qc.invalidateQueries({queryKey:[queryKey]})
 return {
  createMutation: useMutation({mutationFn:(payload:P)=>createResource<T,P>(url,payload),onSuccess:invalidate}),
  updateMutation: useMutation({mutationFn:({id,payload}:{id:number|string,payload:P})=>updateResource<T,P>(url,id,payload),onSuccess:invalidate}),
  deleteMutation: useMutation({mutationFn:(id:number|string)=>deleteResource(url,id),onSuccess:invalidate}),
 }
}
