import axios from 'axios'

/**
 * En desarrollo las peticiones pasan por el proxy de Vite (/api -> localhost:8081).
 * Esto evita CORS y mantiene el frontend desacoplado de la URL física del backend.
 */
export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10_000,
  headers: {
    Accept: 'application/json',
  },
})
