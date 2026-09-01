import { Alert, Box, Paper } from '@mui/material'
import { DataGrid, gridFilteredSortedRowIdsSelector, type GridColDef, type GridFilterModel, type GridRowParams, type GridValidRowModel, useGridApiRef } from '@mui/x-data-grid'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { FilterBar } from '../filters/FilterBar'
import { SearchTextFilter } from '../filters/SearchTextFilter'

interface TablePreferences {
  search?: string
  density?: 'compact' | 'standard' | 'comfortable'
  visibility?: Record<string, boolean>
  order?: string[]
  widths?: Record<string, number>
  filterModel?: GridFilterModel
}

interface ResourceTableProps<T extends GridValidRowModel> {
  rows: T[]
  columns: GridColDef<T>[]
  loading?: boolean
  error?: unknown
  searchFields?: (keyof T)[]
  searchPlaceholder?: string
  emptyMessage?: string
  getRowId?: (row: T) => string | number
  defaultPageSize?: number
  summary?: (visibleRows: T[]) => ReactNode
  preferenceKey?: string
  preferenceUserId?: string | number
  onFilteredRowsChange?: (rows: T[]) => void
  toolbar?: ReactNode
  selectedRowId?: string | number | null
  onRowClick?: (row: T) => void
  onRowDoubleClick?: (row: T) => void
}

function prefKey(userId: string | number | undefined, key: string | undefined) {
  return key ? `tareas.user.${userId || 'anon'}.table.${key}` : ''
}

const RESET_COLUMNS_EVENT = 'tareas:reset-table-columns'

export function resetStoredTableColumns(userId: string | number | undefined, key: string | undefined) {
  const storageKey = prefKey(userId, key)
  if (!storageKey) return
  try {
    const raw = localStorage.getItem(storageKey)
    const current: TablePreferences = raw ? JSON.parse(raw) : {}
    const { visibility: _visibility, order: _order, widths: _widths, ...rest } = current
    localStorage.setItem(storageKey, JSON.stringify(rest))
  } catch {
    localStorage.removeItem(storageKey)
  }
  window.dispatchEvent(new CustomEvent(RESET_COLUMNS_EVENT, { detail: { storageKey } }))
}

function ResourceTableImpl<T extends GridValidRowModel>({
  rows,
  columns,
  loading = false,
  error,
  searchFields = [],
  searchPlaceholder = 'Buscar por textos...',
  emptyMessage = 'No hay datos para mostrar.',
  getRowId,
  defaultPageSize = 25,
  summary,
  preferenceKey,
  preferenceUserId,
  onFilteredRowsChange,
  toolbar,
  selectedRowId,
  onRowClick,
  onRowDoubleClick,
}: ResourceTableProps<T>) {
  const storageKey = prefKey(preferenceUserId, preferenceKey)
  const apiRef = useGridApiRef()
  const [prefs, setPrefs] = useState<TablePreferences>({ density: 'compact' })

  useEffect(() => {
    if (!storageKey) return
    try {
      const raw = localStorage.getItem(storageKey)
      setPrefs(raw ? { density: 'compact', ...JSON.parse(raw) } : { density: 'compact' })
    } catch {
      setPrefs({ density: 'compact' })
    }
  }, [storageKey])

  useEffect(() => {
    if (!storageKey) return
    const handleResetColumns = (event: Event) => {
      const customEvent = event as CustomEvent<{ storageKey?: string }>
      if (customEvent.detail?.storageKey !== storageKey) return
      setPrefs(current => {
        const { visibility: _visibility, order: _order, widths: _widths, ...rest } = current
        return rest
      })
    }
    window.addEventListener(RESET_COLUMNS_EVENT, handleResetColumns)
    return () => window.removeEventListener(RESET_COLUMNS_EVENT, handleResetColumns)
  }, [storageKey])

  const savePrefs = (patch: Partial<TablePreferences>) => {
    setPrefs(current => {
      const next = { ...current, ...patch }
      if (storageKey) localStorage.setItem(storageKey, JSON.stringify(next))
      return next
    })
  }

  const search = prefs.search ?? ''
  const filteredRows = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('es')
    if (!q || searchFields.length === 0) return rows
    return rows.filter((row) => searchFields.some((field) => {
      const value = row[field]
      return value != null && String(value).toLocaleLowerCase('es').includes(q)
    }))
  }, [rows, search, searchFields])

  const lastNotifiedRows = useRef<T[]>([])
  const notifyGridFilteredRows = () => {
    if (!onFilteredRowsChange) return
    let visibleRows = filteredRows
    try {
      const ids = gridFilteredSortedRowIdsSelector(apiRef)
      const byId = new Map(filteredRows.map(row => [String(getRowId ? getRowId(row) : row.id), row]))
      visibleRows = ids.map(id => byId.get(String(id))).filter((row): row is T => Boolean(row))
    } catch {
      // Before DataGrid initializes, the external/text-filtered rows are the best available set.
    }
    const previous = lastNotifiedRows.current
    const unchanged = previous.length === visibleRows.length && previous.every((row, index) => row === visibleRows[index])
    if (unchanged) return
    lastNotifiedRows.current = visibleRows
    onFilteredRowsChange(visibleRows)
  }

  useEffect(() => {
    notifyGridFilteredRows()
  }, [filteredRows, prefs.filterModel, onFilteredRowsChange])

  const configuredColumns = useMemo(() => {
    const byField = new Map(columns.map(column => [column.field, column]))
    const ordered = (prefs.order ?? []).map(field => byField.get(field)).filter(Boolean) as GridColDef<T>[]
    const remaining = columns.filter(column => !(prefs.order ?? []).includes(column.field))
    return [...ordered, ...remaining].map(column => prefs.widths?.[column.field] ? { ...column, width: prefs.widths[column.field], flex: undefined } : column)
  }, [columns, prefs.order, prefs.widths])

  return (
    <Box>
      <FilterBar>
        {toolbar}
        <SearchTextFilter value={search} onChange={(value) => savePrefs({ search: value })} placeholder={searchPlaceholder} />
      </FilterBar>
      {error && <Alert severity="error" sx={{ mb: 1.5 }}>No se han podido recuperar los datos del backend.</Alert>}
      {summary && <Box sx={{ mb: 1.25 }}>{summary(filteredRows)}</Box>}
      <Paper variant="outlined" sx={{ height: 'calc(100vh - 190px)', minHeight: 430, overflow: 'hidden' }}>
        <DataGrid
          apiRef={apiRef}
          rows={filteredRows}
          columns={configuredColumns}
          loading={loading}
          getRowId={getRowId}
          disableRowSelectionOnClick
          onRowClick={(params: GridRowParams<T>) => onRowClick?.(params.row)}
          onRowDoubleClick={(params: GridRowParams<T>) => onRowDoubleClick?.(params.row)}
          getRowClassName={(params) => selectedRowId != null && String(params.id) === String(selectedRowId) ? 'resource-row-selected' : ''}
          density={prefs.density ?? 'compact'}
          onDensityChange={(density) => savePrefs({ density })}
          filterModel={prefs.filterModel ?? { items: [] }}
          onFilterModelChange={(filterModel) => {
            savePrefs({ filterModel })
            queueMicrotask(notifyGridFilteredRows)
          }}
          columnVisibilityModel={prefs.visibility ?? {}}
          onColumnVisibilityModelChange={(visibility) => savePrefs({ visibility })}
          onColumnWidthChange={(params) => savePrefs({ widths: { ...(prefs.widths ?? {}), [params.colDef.field]: params.width } })}
          onColumnOrderChange={(params) => {
            const order = configuredColumns.map(column => column.field)
            const [moved] = order.splice(params.oldIndex, 1)
            order.splice(params.targetIndex, 0, moved)
            savePrefs({ order })
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: defaultPageSize } } }}
          localeText={{ noRowsLabel: emptyMessage }}
          sx={{
            border: 0,
            '& .MuiDataGrid-columnHeaders': { bgcolor: '#f8fafc' },
            '& .MuiDataGrid-row.resource-row-selected': {
              bgcolor: 'action.selected',
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '-2px',
            },
            '& .MuiDataGrid-row.resource-row-selected:hover': { bgcolor: 'action.selected' },
          }}
        />
      </Paper>
    </Box>
  )
}

export const ResourceTable = memo(ResourceTableImpl) as typeof ResourceTableImpl
