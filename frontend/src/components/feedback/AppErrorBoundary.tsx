import { Alert, AlertTitle, Box, Button, Paper, Typography } from '@mui/material'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error no controlado en Tareas Web', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: '#f8fafc', p: 3 }}>
        <Paper variant="outlined" sx={{ width: 'min(760px, 100%)', p: 3 }}>
          <Alert severity="error">
            <AlertTitle>No se ha podido cargar la aplicación</AlertTitle>
            Se ha producido un error en el frontend. El detalle se muestra debajo y también se ha escrito en la consola del navegador.
          </Alert>
          <Typography component="pre" sx={{ mt: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: 13 }}>
            {this.state.error.message}
          </Typography>
          <Button sx={{ mt: 2 }} variant="contained" onClick={() => window.location.reload()}>Recargar</Button>
        </Paper>
      </Box>
    )
  }
}
