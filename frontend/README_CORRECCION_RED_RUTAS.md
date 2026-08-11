# Corrección de red y navegación

Cambios incluidos:

- `vite.config.ts`: proxy `/api` hacia `http://localhost:8081`.
- `src/api/apiClient.ts`: usa `baseURL: '/api'`.
- `src/app/router.tsx`: elimina temporalmente `React.lazy` y los imports dinámicos de páginas.

## Importante

Después de copiar los archivos hay que detener Vite y volverlo a arrancar. Los cambios de `vite.config.ts` no se aplican con HMR.

Si el backend no está arrancado en 8081, Vite mostrará un error de proxy en consola y las llamadas a `/api/...` fallarán.
