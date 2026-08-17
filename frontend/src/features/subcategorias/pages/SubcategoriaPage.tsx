import { FormControl, InputLabel, Select } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { useMemo } from 'react'
import { ActiveStatusChip } from '../../../components/common/ActiveStatusChip'
import { MultiSelectMenuItem } from '../../../components/common/MultiSelectMenuItem'
import { MasterCrudPage } from '../../../components/forms/MasterCrudPage'
import { useCurrentUser } from '../../../app/currentUser'
import { useUserStoredState } from '../../../hooks/useUserPagePreferences'
import { formatDate, textOf } from '../../../utils/presentation'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { useSubcategorias } from '../hooks/useSubcategorias'
import type { Subcategoria } from '../types/subcategoria'

const columns: GridColDef<Subcategoria>[] = [
  { field: 'categoria', headerName: 'Categoría', width: 210, valueGetter: (_v, r) => r.categoriaNombre || textOf((r as any).categoria) },
  { field: 'codigo', headerName: 'Código', width: 130 },
  { field: 'nombre', headerName: 'Nombre', flex: 1, minWidth: 200 },
  { field: 'fechaAlta', headerName: 'Fecha alta', width: 130, valueFormatter: value => formatDate(value) },
  { field: 'activo', headerName: 'Estado', width: 110, renderCell: p => <ActiveStatusChip active={Boolean(p.value)} activeLabel="Activa" inactiveLabel="Inactiva" /> },
]

export function SubcategoriaPage() {
  const q = useSubcategorias()
  const cq = useCategorias()
  const { currentUserId } = useCurrentUser()
  const [categoriasFiltro, setCategoriasFiltro] = useUserStoredState<string[]>(currentUserId, 'subcategorias', 'categorias', [])

  const rows = useMemo(() => {
    if (!categoriasFiltro.length) return q.data ?? []
    return (q.data ?? []).filter(row => categoriasFiltro.includes(String(row.categoriaId)))
  }, [q.data, categoriasFiltro])

  const opts = (form: Record<string, unknown>) => (cq.data ?? [])
    .filter(c => c.activo || String(c.id) === String(form.categoriaId ?? ''))
    .map(c => ({ value: c.id, label: `${c.codigo} - ${c.nombre}` }))

  const filters = (
    <FormControl size="small" sx={{ minWidth: 230 }}>
      <InputLabel>Categorías</InputLabel>
      <Select
        multiple
        label="Categorías"
        value={categoriasFiltro}
        onChange={e => setCategoriasFiltro(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
      >
        {(cq.data ?? []).map(c => (
          <MultiSelectMenuItem key={c.id} value={String(c.id)} selected={categoriasFiltro.includes(String(c.id))}>
            {c.codigo} - {c.nombre}
          </MultiSelectMenuItem>
        ))}
      </Select>
    </FormControl>
  )

  return (
    <MasterCrudPage<Subcategoria>
      adminToolbar
      title="Subcategorías"
      subtitle="Clasificación dependiente de una categoría"
      singular="subcategoría"
      rows={rows}
      loading={q.isLoading}
      error={q.error}
      columns={columns}
      url="/subcategorias"
      queryKey="subcategorias"
      searchFields={['codigo', 'nombre', 'categoriaNombre']}
      filters={filters}
      onClearFilters={() => setCategoriasFiltro([])}
      fields={[
        { name: 'categoriaId', label: 'Categoría', type: 'select', required: true, options: opts },
        { name: 'codigo', label: 'Código', required: true },
        { name: 'nombre', label: 'Nombre', required: true },
        { name: 'activo', label: 'Activa', type: 'checkbox' },
      ]}
      toForm={row => ({
        categoriaId: row?.categoriaId ?? (row as any)?.categoria?.id ?? '',
        codigo: row?.codigo ?? '',
        nombre: row?.nombre ?? '',
        activo: row?.activo ?? true,
      })}
      toPayload={f => ({ categoriaId: Number(f.categoriaId), codigo: f.codigo, nombre: f.nombre, activo: f.activo })}
    />
  )
}
