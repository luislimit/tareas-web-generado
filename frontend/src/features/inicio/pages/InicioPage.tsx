import {
  Alert,
  Box,
  Collapse,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import dayjs from 'dayjs'
import { useMemo, useState, type ReactNode } from 'react'
import { getHttpErrorMessage } from '../../../api/httpError'
import { AppIcon } from '../../../components/common/AppIcon'
import { PageHeader } from '../../../components/layout/PageHeader'
import { formatHours, textOf } from '../../../utils/presentation'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { useImputaciones } from '../../imputaciones/hooks/useImputaciones'
import { usePeticiones } from '../../peticiones/hooks/usePeticiones'
import type { Peticion } from '../../peticiones/types/peticion'
import { useSubcategorias } from '../../subcategorias/hooks/useSubcategorias'

type PeriodoHoras = 'hoy' | 'semana' | 'mes'
type EstadoFiltro = 'pendiente' | 'en curso'

type TreeLeaf = {
  id: string
  label: string
  secondary?: string
  value: number
}

type TreeBranch = {
  id: string
  label: string
  secondary?: string
  value: number
  children: TreeBranch[] | TreeLeaf[]
}

function Tile({
  label,
  value,
  icon,
  active = false,
  onClick,
  tooltip,
}: {
  label: string
  value: string | number
  icon: ReactNode
  active?: boolean
  onClick?: () => void
  tooltip?: string
}) {
  const content = (
    <Paper
      variant="outlined"
      onClick={onClick}
      sx={{
        p: 2,
        minWidth: 190,
        flex: 1,
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        borderColor: active ? 'primary.main' : 'divider',
        borderWidth: active ? 2 : 1,
        bgcolor: active ? 'action.selected' : 'background.paper',
        transition: 'border-color .15s ease, background-color .15s ease, transform .15s ease',
        '&:hover': onClick ? { borderColor: 'primary.main', transform: 'translateY(-1px)' } : undefined,
      }}
    >
      {active && (
        <Box
          aria-label="Filtro activo"
          sx={{
            position: 'absolute',
            top: 7,
            right: 8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'grid',
            placeItems: 'center',
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          ✓
        </Box>
      )}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box sx={{ pr: 3 }}>
          <Typography variant="body2" color="text.secondary">{label}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: .5 }}>{value}</Typography>
        </Box>
        <Box sx={{ color: active ? 'primary.main' : 'text.secondary' }}>{icon}</Box>
      </Stack>
    </Paper>
  )

  return tooltip ? <Tooltip title={tooltip}>{content}</Tooltip> : content
}

function nombreEstado(value?: string) {
  return textOf(value).trim().toLocaleLowerCase('es-ES')
}

function displayCategory(code?: string, name?: string) {
  if (code && name) return `${code} · ${name}`
  return code || name || 'Sin categoría'
}

function DashboardTree({
  title,
  subtitle,
  nodes,
  valueFormatter,
  emptyText,
}: {
  title: string
  subtitle: string
  nodes: TreeBranch[]
  valueFormatter: (value: number) => string
  emptyText: string
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const maxValue = Math.max(0, ...nodes.map((node) => node.value))

  const toggle = (key: string) => {
    setCollapsed((current) => ({ ...current, [key]: !current[key] }))
  }

  return (
    <Paper variant="outlined" sx={{ p: 2, minHeight: 370 }}>
      <Box sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
      </Box>

      {nodes.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography color="text.secondary">{emptyText}</Typography>
        </Box>
      ) : (
        <Stack spacing={.6}>
          {nodes.map((category) => {
            const categoryCollapsed = collapsed[category.id] === true
            return (
              <Box key={category.id}>
                <TreeRow
                  label={category.label}
                  secondary={category.secondary}
                  value={category.value}
                  valueFormatter={valueFormatter}
                  progress={maxValue > 0 ? (category.value / maxValue) * 100 : 0}
                  expanded={!categoryCollapsed}
                  onToggle={() => toggle(category.id)}
                  level={0}
                />
                <Collapse in={!categoryCollapsed} timeout="auto" unmountOnExit>
                  <Stack spacing={.35} sx={{ mt: .25 }}>
                    {(category.children as TreeBranch[]).map((subcategory) => {
                      const subCollapsed = collapsed[subcategory.id] !== false
                      return (
                        <Box key={subcategory.id}>
                          <TreeRow
                            label={subcategory.label}
                            secondary={subcategory.secondary}
                            value={subcategory.value}
                            valueFormatter={valueFormatter}
                            progress={category.value > 0 ? (subcategory.value / category.value) * 100 : 0}
                            expanded={!subCollapsed}
                            onToggle={() => toggle(subcategory.id)}
                            level={1}
                          />
                          <Collapse in={!subCollapsed} timeout="auto" unmountOnExit>
                            <Stack spacing={.2} sx={{ mt: .15 }}>
                              {(subcategory.children as TreeLeaf[]).map((leaf) => (
                                <TreeRow
                                  key={leaf.id}
                                  label={leaf.label}
                                  secondary={leaf.secondary}
                                  value={leaf.value}
                                  valueFormatter={valueFormatter}
                                  progress={subcategory.value > 0 ? (leaf.value / subcategory.value) * 100 : 0}
                                  level={2}
                                />
                              ))}
                            </Stack>
                          </Collapse>
                        </Box>
                      )
                    })}
                  </Stack>
                </Collapse>
              </Box>
            )
          })}
        </Stack>
      )}
    </Paper>
  )
}

function TreeRow({
  label,
  secondary,
  value,
  valueFormatter,
  progress,
  level,
  expanded,
  onToggle,
}: {
  label: string
  secondary?: string
  value: number
  valueFormatter: (value: number) => string
  progress: number
  level: number
  expanded?: boolean
  onToggle?: () => void
}) {
  return (
    <Box
      sx={{
        pl: level * 2.3,
        pr: .75,
        py: level === 0 ? .8 : .55,
        borderRadius: 1,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={.5}>
        {onToggle ? (
          <IconButton size="small" onClick={onToggle} sx={{ p: .25 }}>
            <AppIcon name={expanded ? 'chevronDown' : 'chevronRight'} sx={{ fontSize: 18 }} />
          </IconButton>
        ) : (
          <Box sx={{ width: 25 }} />
        )}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{ fontWeight: level === 0 ? 700 : level === 1 ? 600 : 400 }}
              >
                {label}
              </Typography>
              {secondary && (
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {secondary}
                </Typography>
              )}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
              {valueFormatter(value)}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={Math.max(0, Math.min(100, progress))}
            sx={{ height: 3, borderRadius: 2, mt: .35 }}
          />
        </Box>
      </Stack>
    </Box>
  )
}

function buildHourTree(
  peticiones: Peticion[],
  imputaciones: Array<{ id: number | string; peticionId: number | string; peticionCodigo?: string; fecha?: string; horas?: number; categoriaNombre?: string; subcategoriaNombre?: string }>,
  categoriaMap: Map<string, { codigo?: string; nombre?: string }>,
  subcategoriaMap: Map<string, { codigo?: string; nombre?: string }>,
): TreeBranch[] {
  const peticionMap = new Map(peticiones.map((peticion) => [String(peticion.id), peticion]))
  const categories = new Map<string, TreeBranch>()

  for (const imputacion of imputaciones) {
    const horas = Number(imputacion.horas) || 0
    if (horas === 0) continue

    const peticion = peticionMap.get(String(imputacion.peticionId))
    const categoriaId = peticion ? String(peticion.categoriaId) : `nombre:${imputacion.categoriaNombre ?? 'sin-categoria'}`
    const subcategoriaId = peticion ? String(peticion.subcategoriaId) : `nombre:${imputacion.subcategoriaNombre ?? 'sin-subcategoria'}`
    const categoria = peticion ? categoriaMap.get(String(peticion.categoriaId)) : undefined
    const subcategoria = peticion ? subcategoriaMap.get(String(peticion.subcategoriaId)) : undefined
    const categoryKey = `h-cat-${categoriaId}`
    const subcategoryKey = `${categoryKey}-sub-${subcategoriaId}`
    const petitionKey = `${subcategoryKey}-pet-${String(imputacion.peticionId)}`

    let categoryNode = categories.get(categoryKey)
    if (!categoryNode) {
      categoryNode = {
        id: categoryKey,
        label: displayCategory(categoria?.codigo, categoria?.nombre ?? peticion?.categoriaNombre ?? imputacion.categoriaNombre),
        value: 0,
        children: [],
      }
      categories.set(categoryKey, categoryNode)
    }
    categoryNode.value += horas

    const subcategories = categoryNode.children as TreeBranch[]
    let subcategoryNode = subcategories.find((item) => item.id === subcategoryKey)
    if (!subcategoryNode) {
      subcategoryNode = {
        id: subcategoryKey,
        label: displayCategory(subcategoria?.codigo, subcategoria?.nombre ?? peticion?.subcategoriaNombre ?? imputacion.subcategoriaNombre),
        value: 0,
        children: [],
      }
      subcategories.push(subcategoryNode)
    }
    subcategoryNode.value += horas

    const petitions = subcategoryNode.children as TreeLeaf[]
    let petitionNode = petitions.find((item) => item.id === petitionKey)
    if (!petitionNode) {
      petitionNode = {
        id: petitionKey,
        label: peticion?.codigo ?? imputacion.peticionCodigo ?? `Petición ${String(imputacion.peticionId)}`,
        secondary: peticion?.asunto,
        value: 0,
      }
      petitions.push(petitionNode)
    }
    petitionNode.value += horas
  }

  for (const category of categories.values()) {
    const subcategories = category.children as TreeBranch[]
    subcategories.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'es'))
    for (const subcategory of subcategories) {
      ;(subcategory.children as TreeLeaf[]).sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'es'))
    }
  }

  return [...categories.values()].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'es'))
}

function buildPetitionTree(
  peticiones: Peticion[],
  categoriaMap: Map<string, { codigo?: string; nombre?: string }>,
  subcategoriaMap: Map<string, { codigo?: string; nombre?: string }>,
): TreeBranch[] {
  const categories = new Map<string, TreeBranch>()

  for (const peticion of peticiones) {
    const categoriaId = String(peticion.categoriaId)
    const subcategoriaId = String(peticion.subcategoriaId)
    const categoria = categoriaMap.get(categoriaId)
    const subcategoria = subcategoriaMap.get(subcategoriaId)
    const categoryKey = `p-cat-${categoriaId}`
    const subcategoryKey = `${categoryKey}-sub-${subcategoriaId}`

    let categoryNode = categories.get(categoryKey)
    if (!categoryNode) {
      categoryNode = {
        id: categoryKey,
        label: displayCategory(categoria?.codigo, categoria?.nombre ?? peticion.categoriaNombre),
        value: 0,
        children: [],
      }
      categories.set(categoryKey, categoryNode)
    }
    categoryNode.value += 1

    const subcategories = categoryNode.children as TreeBranch[]
    let subcategoryNode = subcategories.find((item) => item.id === subcategoryKey)
    if (!subcategoryNode) {
      subcategoryNode = {
        id: subcategoryKey,
        label: displayCategory(subcategoria?.codigo, subcategoria?.nombre ?? peticion.subcategoriaNombre),
        value: 0,
        children: [],
      }
      subcategories.push(subcategoryNode)
    }
    subcategoryNode.value += 1

    ;(subcategoryNode.children as TreeLeaf[]).push({
      id: `${subcategoryKey}-pet-${String(peticion.id)}`,
      label: peticion.codigo,
      secondary: `${peticion.asunto}${peticion.estadoNombre ? ` · ${peticion.estadoNombre}` : ''}`,
      value: 1,
    })
  }

  for (const category of categories.values()) {
    const subcategories = category.children as TreeBranch[]
    subcategories.sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'es'))
    for (const subcategory of subcategories) {
      ;(subcategory.children as TreeLeaf[]).sort((a, b) => a.label.localeCompare(b.label, 'es'))
    }
  }

  return [...categories.values()].sort((a, b) => b.value - a.value || a.label.localeCompare(b.label, 'es'))
}

export function InicioPage() {
  const peticiones = usePeticiones()
  const imputaciones = useImputaciones()
  const categorias = useCategorias()
  const subcategorias = useSubcategorias()
  const [periodoHoras, setPeriodoHoras] = useState<PeriodoHoras>('hoy')
  const [estadosPeticion, setEstadosPeticion] = useState<EstadoFiltro[]>(['pendiente', 'en curso'])

  const pet = Array.isArray(peticiones.data) ? peticiones.data : []
  const imp = Array.isArray(imputaciones.data) ? imputaciones.data : []

  const categoriaMap = useMemo(
    () => new Map((categorias.data ?? []).map((categoria) => [String(categoria.id), categoria])),
    [categorias.data],
  )
  const subcategoriaMap = useMemo(
    () => new Map((subcategorias.data ?? []).map((subcategoria) => [String(subcategoria.id), subcategoria])),
    [subcategorias.data],
  )

  const stats = useMemo(() => {
    const hoy = dayjs()
    const inicioSemana = hoy.subtract((hoy.day() + 6) % 7, 'day').startOf('day')
    const finSemana = inicioSemana.add(6, 'day').endOf('day')

    const pendientes = pet.filter((x) => nombreEstado(x.estadoNombre) === 'pendiente').length
    const enCurso = pet.filter((x) => nombreEstado(x.estadoNombre) === 'en curso').length
    const horasHoy = imp
      .filter((x) => x.fecha && dayjs(x.fecha).isSame(hoy, 'day'))
      .reduce((acc, x) => acc + (Number(x.horas) || 0), 0)
    const horasSemana = imp
      .filter((x) => x.fecha && !dayjs(x.fecha).isBefore(inicioSemana, 'day') && !dayjs(x.fecha).isAfter(finSemana, 'day'))
      .reduce((acc, x) => acc + (Number(x.horas) || 0), 0)
    const horasMes = imp
      .filter((x) => x.fecha && dayjs(x.fecha).isSame(hoy, 'month') && dayjs(x.fecha).isSame(hoy, 'year'))
      .reduce((acc, x) => acc + (Number(x.horas) || 0), 0)

    return { pendientes, enCurso, horasHoy, horasSemana, horasMes }
  }, [pet, imp])

  const imputacionesPeriodo = useMemo(() => {
    const hoy = dayjs()
    const inicioSemana = hoy.subtract((hoy.day() + 6) % 7, 'day').startOf('day')
    const finSemana = inicioSemana.add(6, 'day').endOf('day')

    return imp.filter((x) => {
      if (!x.fecha) return false
      const fecha = dayjs(x.fecha)
      if (periodoHoras === 'hoy') return fecha.isSame(hoy, 'day')
      if (periodoHoras === 'semana') return !fecha.isBefore(inicioSemana, 'day') && !fecha.isAfter(finSemana, 'day')
      return fecha.isSame(hoy, 'month') && fecha.isSame(hoy, 'year')
    })
  }, [imp, periodoHoras])

  const peticionesEstado = useMemo(() => {
    const estados = estadosPeticion.length ? estadosPeticion : ['pendiente', 'en curso']
    return pet.filter((item) => estados.includes(nombreEstado(item.estadoNombre) as EstadoFiltro))
  }, [pet, estadosPeticion])

  const horasTree = useMemo(
    () => buildHourTree(pet, imputacionesPeriodo, categoriaMap, subcategoriaMap),
    [pet, imputacionesPeriodo, categoriaMap, subcategoriaMap],
  )
  const peticionesTree = useMemo(
    () => buildPetitionTree(peticionesEstado, categoriaMap, subcategoriaMap),
    [peticionesEstado, categoriaMap, subcategoriaMap],
  )

  const toggleEstadoPeticion = (estado: EstadoFiltro) => {
    setEstadosPeticion((current) =>
      current.includes(estado)
        ? current.filter((item) => item !== estado)
        : [...current, estado],
    )
  }

  const periodoLabel = periodoHoras === 'hoy' ? 'hoy' : periodoHoras === 'semana' ? 'esta semana' : 'este mes'
  const estadosLabel = estadosPeticion.length === 0 || estadosPeticion.length === 2
    ? 'pendientes y en curso'
    : estadosPeticion[0] === 'pendiente' ? 'pendientes' : 'en curso'

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
          active={estadosPeticion.includes('pendiente')}
          onClick={() => toggleEstadoPeticion('pendiente')}
          tooltip="Mostrar u ocultar peticiones pendientes en el árbol"
        />
        <Tile
          label="Peticiones en curso"
          value={peticiones.error ? '—' : stats.enCurso}
          icon={<AppIcon name="inProgress" sx={{ fontSize: 30 }} />}
          active={estadosPeticion.includes('en curso')}
          onClick={() => toggleEstadoPeticion('en curso')}
          tooltip="Mostrar u ocultar peticiones en curso en el árbol"
        />
        <Tile
          label="Horas hoy"
          value={imputaciones.error ? '—' : formatHours(stats.horasHoy)}
          icon={<AppIcon name="time" sx={{ fontSize: 30 }} />}
          active={periodoHoras === 'hoy'}
          onClick={() => setPeriodoHoras('hoy')}
          tooltip="Ver distribución de horas de hoy"
        />
        <Tile
          label="Horas esta semana"
          value={imputaciones.error ? '—' : formatHours(stats.horasSemana)}
          icon={<AppIcon name="calendarWeek" sx={{ fontSize: 30 }} />}
          active={periodoHoras === 'semana'}
          onClick={() => setPeriodoHoras('semana')}
          tooltip="Ver distribución de horas de esta semana"
        />
        <Tile
          label="Horas este mes"
          value={imputaciones.error ? '—' : formatHours(stats.horasMes)}
          icon={<AppIcon name="calendarMonth" sx={{ fontSize: 30 }} />}
          active={periodoHoras === 'mes'}
          onClick={() => setPeriodoHoras('mes')}
          tooltip="Ver distribución de horas de este mes"
        />
      </Stack>

      <Box
        sx={{
          mt: 2,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', xl: 'minmax(0, 1fr) minmax(0, 1fr)' },
          gap: 2,
        }}
      >
        <DashboardTree
          title="Horas por trabajo"
          subtitle={`Distribución por categoría, subcategoría y petición · ${periodoLabel}`}
          nodes={horasTree}
          valueFormatter={(value) => formatHours(value)}
          emptyText={`No hay horas imputadas ${periodoLabel}.`}
        />
        <DashboardTree
          title="Peticiones activas"
          subtitle={`Distribución por categoría, subcategoría y petición · ${estadosLabel}`}
          nodes={peticionesTree}
          valueFormatter={(value) => `${value}`}
          emptyText="No hay peticiones para los estados seleccionados."
        />
      </Box>
    </Box>
  )
}
