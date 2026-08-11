import { apiClient } from './apiClient'

export async function createResource<T, P>(url: string, payload: P): Promise<T> {
  const { data } = await apiClient.post<T>(url, payload)
  return data
}
export async function updateResource<T, P>(url: string, id: number|string, payload: P): Promise<T> {
  const { data } = await apiClient.put<T>(`${url}/${id}`, payload)
  return data
}
export async function deleteResource(url: string, id: number|string): Promise<void> {
  await apiClient.delete(`${url}/${id}`)
}
