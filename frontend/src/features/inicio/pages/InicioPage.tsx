import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import dayjs from 'dayjs'
import { useMemo, type ReactNode } from 'react'
import { getHttpErrorMessage } from '../../../api/httpError'
import { PageHeader } from '../../../components/layout/PageHeader'
import { AppIcon } from '../../../components/common/AppIcon'
import { formatHours, textOf } from '../../../utils/presentation'
import { useImputaciones } from '../../imputaciones/hooks/useImputaciones'
import { usePeticiones } from '../../peticiones/hooks/usePeticiones'

function Tile({ label, value, icon }: { label: string; value: string | number; icon: ReactNode }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, minWidth: 210, flex: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Box>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: .5 }}>{value}</Typography>
        </Box>
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
      </Stack>
    </Paper>
  )
}

export function InicioPage() {
  const peticiones = usePeticiones()
  const imputaciones = useImputaciones()

  const stats = useMemo(() => {
    const pet = Array.isArray(peticiones.data) ? peticiones.data : []
    const imp = Array.isArray(imputaciones.data) ? imputaciones.data : []
    const now = dayjs()

    const pendientes = pet.filter((x) =>
      !['finalizada', 'cancelada'].includes(textOf(x.estadoNombre).toLowerCase()),
    ).length
    const semana = imp
      .filter((x) => x.fecha && dayjs(x.fecha).isAfter(now.subtract(7, 'day')))
      .reduce((acc, x) => acc + (Number(x.horas) || 0), 0)
    const mes = imp
      .filter((x) => x.fecha && dayjs(x.fecha).isSame(now, 'month'))
      .reduce((acc, x) => acc + (Number(x.horas) || 0), 0)
    const vencen = pet.filter((x) =>
      x.fechaFinPrevista
      && dayjs(x.fechaFinPrevista).isAfter(now)
      && dayjs(x.fechaFinPrevista).isBefore(now.add(7, 'day')),
    ).length

    return { pendientes, semana, mes, vencen }
  }, [peticiones.data, imputaciones.data])

  return (
    <Box>
      <PageHeader title="Inicio" subtitle="Resumen del trabajo actual" />

      {peticiones.error && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          No se han podido recuperar las peticiones: {getHttpErrorMessage(peticiones.error)}
        </Alert>
      )}
      {imputaciones.error && (
        <Alert severity="warning" sx={{ mb: 1 }}>
          No se han podido recuperar las imputaciones: {getHttpErrorMessage(imputaciones.error)}
        </Alert>
      )}

      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
        <Tile
          label="Peticiones pendientes"
          value={peticiones.error ? '—' : stats.pendientes}
          icon={<AppIcon name="pending" sx={{ fontSize: 30 }} />}
        />
        <Tile
          label="Horas últimos 7 días"
          value={imputaciones.error ? '—' : formatHours(stats.semana)}
          icon={<AppIcon name="calendarWeek" sx={{ fontSize: 30 }} />}
        />
        <Tile
          label="Horas este mes"
          value={imputaciones.error ? '—' : formatHours(stats.mes)}
          icon={<AppIcon name="calendarMonth" sx={{ fontSize: 30 }} />}
        />
        <Tile
          label="Vencen próximos 7 días"
          value={peticiones.error ? '—' : stats.vencen}
          icon={<AppIcon name="warning" sx={{ fontSize: 30 }} />}
        />
      </Stack>

      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Typography fontWeight={600}>Vista de trabajo</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>
          El dashboard se alimenta de Peticiones e Imputaciones reales. Las pantallas de negocio están disponibles desde el menú lateral.
        </Typography>
      </Paper>
    </Box>
  )
}
