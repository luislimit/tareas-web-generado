import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import dayjs from 'dayjs'

export type DatePeriod = 'todas'|'hoy'|'esta-semana'|'semana-pasada'|'este-mes'|'mes-pasado'|'este-ano'|'personalizado'

export interface DateRange { desde: string; hasta: string }

export function getDateRange(period: DatePeriod): DateRange {
  const hoy = dayjs()
  const fmt = (value: dayjs.Dayjs) => value.format('YYYY-MM-DD')
  const lunes = hoy.subtract((hoy.day() + 6) % 7, 'day')
  switch (period) {
    case 'hoy': return { desde: fmt(hoy), hasta: fmt(hoy) }
    case 'esta-semana': return { desde: fmt(lunes), hasta: fmt(lunes.add(6, 'day')) }
    case 'semana-pasada': return { desde: fmt(lunes.subtract(7, 'day')), hasta: fmt(lunes.subtract(1, 'day')) }
    case 'este-mes': return { desde: fmt(hoy.startOf('month')), hasta: fmt(hoy.endOf('month')) }
    case 'mes-pasado': { const mes = hoy.subtract(1, 'month'); return { desde: fmt(mes.startOf('month')), hasta: fmt(mes.endOf('month')) } }
    case 'este-ano': return { desde: fmt(hoy.startOf('year')), hasta: fmt(hoy.endOf('year')) }
    case 'todas':
    case 'personalizado': return { desde: '', hasta: '' }
  }
}

interface Props {
  period: DatePeriod
  desde: string
  hasta: string
  onChange: (period: DatePeriod, desde: string, hasta: string) => void
  error?: boolean
}

export function DatePeriodFilter({ period, desde, hasta, onChange, error = false }: Props) {
  const setPeriod = (next: DatePeriod) => {
    if (next === 'personalizado') onChange(next, desde, hasta)
    else {
      const range = getDateRange(next)
      onChange(next, range.desde, range.hasta)
    }
  }
  return <>
    <FormControl size="small" sx={{ minWidth: 165 }}>
      <InputLabel>Periodo</InputLabel>
      <Select label="Periodo" value={period} onChange={event => setPeriod(event.target.value as DatePeriod)}>
        <MenuItem value="todas">Todas</MenuItem>
        <MenuItem value="hoy">Hoy</MenuItem>
        <MenuItem value="esta-semana">Esta semana</MenuItem>
        <MenuItem value="semana-pasada">Semana pasada</MenuItem>
        <MenuItem value="este-mes">Este mes</MenuItem>
        <MenuItem value="mes-pasado">Mes pasado</MenuItem>
        <MenuItem value="este-ano">Este año</MenuItem>
        <MenuItem value="personalizado">Personalizado</MenuItem>
      </Select>
    </FormControl>
    <TextField size="small" type="date" label="Fecha desde" slotProps={{ inputLabel: { shrink: true } }} value={desde}
      onChange={event => onChange('personalizado', event.target.value, hasta)} disabled={period !== 'personalizado'} error={error}/>
    <TextField size="small" type="date" label="Fecha hasta" slotProps={{ inputLabel: { shrink: true } }} value={hasta}
      onChange={event => onChange('personalizado', desde, event.target.value)} disabled={period !== 'personalizado'} error={error}/>
  </>
}
