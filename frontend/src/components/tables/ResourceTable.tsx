import { Alert, Box, InputAdornment, Paper, TextField } from '@mui/material'
import { DataGrid, type GridColDef, type GridValidRowModel } from '@mui/x-data-grid'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { UiGlyph } from '../common/UiGlyph'

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
}

export function ResourceTable<T extends GridValidRowModel>({
  rows,
  columns,
  loading = false,
  error,
  searchFields = [],
  searchPlaceholder = 'Buscar...',
  emptyMessage = 'No hay datos para mostrar.',
  getRowId,
  defaultPageSize = 25,
  summary,
}: ResourceTableProps<T>) {
  const [search, setSearch] = useState('')
  const filteredRows = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('es')
    if (!q || searchFields.length === 0) return rows
    return rows.filter((row) => searchFields.some((field) => {
      const value = row[field]
      return value != null && String(value).toLocaleLowerCase('es').includes(q)
    }))
  }, [rows, search, searchFields])

  return (
    <Box>
      <TextField
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        size="small"
        placeholder={searchPlaceholder}
        sx={{ width: 360, mb: 1.5 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><UiGlyph text="⌕" title="Buscar" /></InputAdornment> }}
      />
      {error && <Alert severity="error" sx={{ mb: 1.5 }}>No se han podido recuperar los datos del backend.</Alert>}
      {summary && <Box sx={{ mb: 1.25 }}>{summary(filteredRows)}</Box>}
      <Paper variant="outlined" sx={{ height: 'calc(100vh - 190px)', minHeight: 430, overflow: 'hidden' }}>
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          getRowId={getRowId}
          disableRowSelectionOnClick
          density="compact"
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: defaultPageSize } } }}
          localeText={{ noRowsLabel: emptyMessage }}
          sx={{ border: 0, '& .MuiDataGrid-columnHeaders': { bgcolor: '#f8fafc' } }}
        />
      </Paper>
    </Box>
  )
}
