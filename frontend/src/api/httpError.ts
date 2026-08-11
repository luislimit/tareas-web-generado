import axios from 'axios'

export function getHttpErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; detail?: string; error?: string } | undefined
    return data?.message || data?.detail || data?.error || error.message || 'Error de comunicación con el backend.'
  }
  return error instanceof Error ? error.message : 'Se ha producido un error inesperado.'
}
