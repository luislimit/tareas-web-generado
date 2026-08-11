import { apiClient } from '../../../api/apiClient'
import type { Subcategoria } from '../types/subcategoria'
export async function getSubcategorias():Promise<Subcategoria[]>{const {data}=await apiClient.get<Subcategoria[]>('/subcategorias');return data}
