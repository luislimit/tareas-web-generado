import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
      // Al volver a una pantalla, consulta siempre de nuevo al backend aunque la caché siga fresca.
      refetchOnMount: 'always',
    },
  },
})
