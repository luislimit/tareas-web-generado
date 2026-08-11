import { apiClient } from '../../../api/apiClient'
import type { Categoria } from '../types/categoria'

export async function getCategorias(): Promise<Categoria[]> {
  const response = await apiClient.get<Categoria[]>('/categorias')
  return response.data
}
