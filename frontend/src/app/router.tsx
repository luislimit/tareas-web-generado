import { Alert } from '@mui/material'
import { createBrowserRouter, isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { CategoriasPage } from '../features/categorias/pages/CategoriasPage'
import { ConfiguracionPage } from '../features/configuracion/pages/ConfiguracionPage'
import { DocumentosPage } from '../features/documentos/pages/DocumentosPage'
import { EstadoPage } from '../features/estados/pages/EstadoPage'
import { EstadosHorasPage } from '../features/estadosHoras/pages/EstadosHorasPage'
import { ImputacionesPage } from '../features/imputaciones/pages/ImputacionesPage'
import { InicioPage } from '../features/inicio/pages/InicioPage'
import { PeticionesPage } from '../features/peticiones/pages/PeticionesPage'
import { SubcategoriaPage } from '../features/subcategorias/pages/SubcategoriaPage'
import { TipoDocumentoPage } from '../features/tiposDocumento/pages/TipoDocumentoPage'
import { TiposHoraPage } from '../features/tiposHora/pages/TiposHoraPage'
import { UsuarioPage } from '../features/usuarios/pages/UsuarioPage'

function RouteError() {
  const error = useRouteError()
  let message = 'Se ha producido un error cargando esta pantalla.'

  if (isRouteErrorResponse(error)) {
    message = `${error.status} ${error.statusText}`
  } else if (error instanceof Error) {
    message = error.message
  }

  console.error('Error de ruta', error)
  return <Alert severity="error" sx={{ m: 2 }}>{message}</Alert>
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <InicioPage /> },
      { path: '/peticiones', element: <PeticionesPage /> },
      { path: '/imputaciones', element: <ImputacionesPage /> },
      { path: '/documentos', element: <DocumentosPage /> },
      { path: '/admin/categorias', element: <CategoriasPage /> },
      { path: '/admin/subcategorias', element: <SubcategoriaPage /> },
      { path: '/admin/estados', element: <EstadoPage /> },
      { path: '/admin/estados-horas', element: <EstadosHorasPage /> },
      { path: '/admin/tipos-hora', element: <TiposHoraPage /> },
      { path: '/admin/usuarios', element: <UsuarioPage /> },
      { path: '/admin/tipos-documento', element: <TipoDocumentoPage /> },
      { path: '/configuracion', element: <ConfiguracionPage /> },
    ],
  },
])
