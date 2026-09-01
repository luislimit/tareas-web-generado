import { Alert, Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { FileDropTextField } from './FileDropTextField'
import { ExpandingTextField } from './ExpandingTextField'
import { getHttpErrorMessage } from '../../api/httpError'
import { useResourceMutations } from '../../api/useResourceMutations'
import { ConfirmDeleteDialog } from '../common/ConfirmDeleteDialog'
import { DatePeriodFilter, getDateRange, type DatePeriod } from '../filters/DatePeriodFilter'
import { FilterBar } from '../filters/FilterBar'
import { EntityDrawer } from '../common/EntityDrawer'
import { PageHeader } from '../layout/PageHeader'
import { ResourceTable, resetStoredTableColumns } from '../tables/ResourceTable'
import { useCurrentUser } from '../../app/currentUser'
import { useUserStoredState } from '../../hooks/useUserPagePreferences'
import { exportToExcel, type ExcelColumn } from '../../utils/exportExcel'
import dayjs from 'dayjs'

export interface SelectOption { value:number|string; label:string }
export interface CrudField {
  name:string
  label:string
  type?:'text'|'number'|'checkbox'|'select'|'color'|'email'|'date'
  required?:boolean
  options?:SelectOption[] | ((form:Record<string,unknown>)=>SelectOption[])
  disabled?:boolean | ((form:Record<string,unknown>)=>boolean)
  onChange?:(value:unknown, form:Record<string,unknown>)=>Record<string,unknown>
  selectFirst?:boolean
  multiline?:boolean
  minRows?:number
  expanding?:boolean
  fileDrop?:boolean
}

export interface CrudCreatePreset {
  key:string
  values:Record<string,unknown>
  disabledFields?:string[]
}

const EMPTY_SEARCH_FIELDS:string[]=[]

function excelValue(value: unknown) {
  if (value == null) return ''
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (typeof value === 'object') return JSON.stringify(value)
  return value
}

interface Props<T extends {id:number|string}> {
 title:string
 subtitle?:string
 singular:string
 rows:T[]
 loading:boolean
 error?:unknown
 columns:GridColDef<T>[]
 fields:CrudField[]
 url:string
 queryKey:string
 toForm:(row?:T)=>Record<string,unknown>
 toPayload:(form:Record<string,unknown>)=>Record<string,unknown>
 toDuplicateForm?:(row:T)=>Record<string,unknown>
 searchFields?:(keyof T)[]
 filters?:ReactNode
 tableSummary?:(visibleRows:T[])=>ReactNode
 createPreset?:CrudCreatePreset
 rowActions?:(row:T)=>ReactNode
 actionsWidth?:number
 headerActions?:ReactNode
 iconOnlyCreate?:boolean
 onExport?:()=>void
 exportLabel?:string
 onFilteredRowsChange?:(rows:T[])=>void
 adminToolbar?:boolean
 onClearFilters?:()=>void
 secondaryFilters?:ReactNode
 dateField?:keyof T
 initialDatePeriod?:DatePeriod
}

export function MasterCrudPage<T extends {id:number|string}>({
  title, subtitle, singular, rows, loading, error, columns, fields, url, queryKey,
  toForm, toPayload, toDuplicateForm, searchFields, filters, tableSummary, createPreset, rowActions, actionsWidth=132,
  headerActions, iconOnlyCreate=false, onExport, exportLabel, onFilteredRowsChange, adminToolbar=false, onClearFilters,
  secondaryFilters, dateField, initialDatePeriod='todas',
}:Props<T>){
 const { currentUserId } = useCurrentUser()
 const effectiveSearchFields=(searchFields??EMPTY_SEARCH_FIELDS) as (keyof T)[]
 const [selected,setSelected]=useState<T|null>(null)
 const [open,setOpen]=useState(false)
 const [duplicateMode,setDuplicateMode]=useState(false)
 const [form,setForm]=useState<Record<string,unknown>>(()=>toForm())
 const [deleteOpen,setDeleteOpen]=useState(false)
 const [presetDisabledFields,setPresetDisabledFields]=useState<string[]>([])
 const [estadoFiltro,setEstadoFiltro]=useUserStoredState<'activos'|'inactivos'|'todos'>(currentUserId, queryKey, 'estado', 'activos')
 const initialRange=getDateRange(initialDatePeriod)
 const [datePeriod,setDatePeriod]=useUserStoredState<DatePeriod>(currentUserId, queryKey, 'periodoFecha', initialDatePeriod)
 const [dateDesde,setDateDesde]=useUserStoredState<string>(currentUserId, queryKey, 'fechaDesde', initialRange.desde)
 const [dateHasta,setDateHasta]=useUserStoredState<string>(currentUserId, queryKey, 'fechaHasta', initialRange.hasta)
 const exportRowsRef=useRef<T[]>(rows)
 const {createMutation,updateMutation,deleteMutation}=useResourceMutations<T,Record<string,unknown>>(url,queryKey)
 const saving=createMutation.isPending||updateMutation.isPending
 const mutationError=createMutation.error||updateMutation.error||deleteMutation.error

 const actionCols=useMemo<GridColDef<T>[]>(()=>rowActions?[
  ...columns,
  {
    field:'acciones', headerName:'Acciones', width:actionsWidth, sortable:false, filterable:false,
    renderCell:({row})=><Stack direction="row" spacing={.25} onClickCapture={()=>setSelected(row)}>{rowActions(row)}</Stack>,
  },
 ]:columns, [columns, rowActions, actionsWidth])

 const excelColumns=useMemo<ExcelColumn<T>[]>(()=>columns.map(column=>({
  header:column.headerName??column.field,
  value:(row:T)=>excelValue((row as unknown as Record<string,unknown>)[column.field]),
 })),[columns])
 const exportPrefix=queryKey.replace(/[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ]+/g,'_').replace(/^_+|_+$/g,'')||'datos'
 const hasActivo=adminToolbar && fields.some(field=>field.name==='activo')
 const effectiveRows=useMemo(()=>rows.filter(row=>{
  if(hasActivo&&estadoFiltro!=='todos'&&Boolean((row as unknown as Record<string,unknown>).activo)!==(estadoFiltro==='activos'))return false
  if(dateField&&datePeriod!=='todas'){
   const value=(row as unknown as Record<string,unknown>)[String(dateField)]
   if(!value)return false
   const date=dayjs(String(value))
   if(dateDesde&&date.isBefore(dayjs(dateDesde),'day'))return false
   if(dateHasta&&date.isAfter(dayjs(dateHasta),'day'))return false
  }
  return true
 }),[rows,hasActivo,estadoFiltro,dateField,datePeriod,dateDesde,dateHasta])
 const exportAction=onExport??(()=>exportToExcel(exportPrefix,exportRowsRef.current,excelColumns))
 const handleFilteredRowsChange=useCallback((filtered:T[])=>{
  if(adminToolbar)exportRowsRef.current=filtered
  onFilteredRowsChange?.(filtered)
 },[adminToolbar,onFilteredRowsChange])

 useEffect(()=>{
  if(!createPreset)return
  setSelected(null)
  setDuplicateMode(false)
  setForm({...toForm(), ...createPreset.values})
  setPresetDisabledFields(createPreset.disabledFields??[])
  setOpen(true)
 },[createPreset?.key])

 useEffect(()=>{
  if(!open || selected)return
  let changed=false
  const next={...form}
  for(const field of fields){
    if(field.type!=='select' || !field.selectFirst || next[field.name]!=='' && next[field.name]!=null)continue
    const options=typeof field.options==='function'?field.options(next):(field.options??[])
    if(options.length){next[field.name]=options[0].value;changed=true}
  }
  if(changed)setForm(next)
 },[open, selected, form, fields])

 function create(){
  setDuplicateMode(false)
  setSelected(null)
  setPresetDisabledFields([])
  setForm(toForm())
  setOpen(true)
 }
 function edit(row:T){
  setDuplicateMode(false)
  setSelected(row)
  setPresetDisabledFields([])
  setForm(toForm(row))
  setOpen(true)
 }
 function duplicate(row:T){
  setSelected(row)
  setDuplicateMode(true)
  setPresetDisabledFields([])
  setForm(toDuplicateForm?toDuplicateForm(row):toForm(row))
  setOpen(true)
 }
 async function save(){
  const payload=toPayload(form)
  if(selected&&!duplicateMode) await updateMutation.mutateAsync({id:selected.id,payload})
  else await createMutation.mutateAsync(payload)
  setOpen(false)
 }
 async function remove(){
  if(!selected)return
  await deleteMutation.mutateAsync(selected.id)
  setDeleteOpen(false)
  setSelected(null)
 }
 const set=(field:CrudField,value:unknown)=>setForm(v=>({...v,[field.name]:value,...(field.onChange?.(value,v)??{})}))
 const optionsOf=(field:CrudField)=>typeof field.options==='function'?field.options(form):(field.options??[])
 const disabledOf=(field:CrudField)=>presetDisabledFields.includes(field.name) || (typeof field.disabled==='function'?field.disabled(form):Boolean(field.disabled))
 const handleRowClick=useCallback((row:T)=>setSelected(row),[])
 const handleRowDoubleClick=useCallback((row:T)=>{
  setDuplicateMode(false)
  setSelected(row)
  setPresetDisabledFields([])
  setForm(toForm(row))
  setOpen(true)
 },[toForm])
 const tableToolbar=useMemo(()=><>
  {secondaryFilters}
  {dateField&&<DatePeriodFilter period={datePeriod} desde={dateDesde} hasta={dateHasta} error={Boolean(dateDesde&&dateHasta&&dayjs(dateHasta).isBefore(dayjs(dateDesde),'day'))} onChange={(period,desde,hasta)=>{setDatePeriod(period);setDateDesde(desde);setDateHasta(hasta)}}/>}
 </>,[secondaryFilters,dateField,datePeriod,dateDesde,dateHasta])

 return <Box>
  <PageHeader
   title={title}
   subtitle={subtitle}
   createLabel={`Nuevo ${singular}`}
   onCreate={create}
   onExport={exportAction}
   exportLabel={exportLabel??`Exportar ${title.toLowerCase()} a Excel`}
   onDuplicate={()=>{if(selected)duplicate(selected)}}
   duplicateLabel={`Duplicar ${singular}`}
   duplicateDisabled={!selected}
   onEdit={()=>{if(selected)edit(selected)}}
   editLabel={`Editar ${singular}`}
   editDisabled={!selected}
   onDelete={()=>{if(selected)setDeleteOpen(true)}}
   deleteLabel={`Eliminar ${singular}`}
   deleteDisabled={!selected}
   onResetColumns={()=>resetStoredTableColumns(currentUserId, queryKey)}
   onClearFilters={(hasActivo||onClearFilters||dateField)?()=>{
    if(hasActivo)setEstadoFiltro('activos')
    if(dateField){const range=getDateRange(initialDatePeriod);setDatePeriod(initialDatePeriod);setDateDesde(range.desde);setDateHasta(range.hasta)}
    onClearFilters?.()
   }:undefined}
  >
    {headerActions}
  </PageHeader>
  {mutationError&&<Alert severity="error" sx={{mb:1.5}}>{getHttpErrorMessage(mutationError)}</Alert>}
  {(hasActivo||filters)&&<FilterBar>
    {hasActivo&&<FormControl size="small" sx={{minWidth:150}}><InputLabel>Estado</InputLabel><Select label="Estado" value={estadoFiltro} onChange={e=>setEstadoFiltro(e.target.value as 'activos'|'inactivos'|'todos')}><MenuItem value="activos">Activos</MenuItem><MenuItem value="inactivos">Inactivos</MenuItem><MenuItem value="todos">Todos</MenuItem></Select></FormControl>}
    {filters}
  </FilterBar>}
  <ResourceTable preferenceKey={queryKey} preferenceUserId={currentUserId} rows={effectiveRows} columns={actionCols} loading={loading} error={error} searchFields={effectiveSearchFields} searchPlaceholder="Buscar por textos..." summary={tableSummary} onFilteredRowsChange={handleFilteredRowsChange}
   selectedRowId={selected?.id} onRowClick={handleRowClick} onRowDoubleClick={handleRowDoubleClick}
   toolbar={tableToolbar} />
  <EntityDrawer open={open} title={duplicateMode?`Duplicar ${singular}`:selected?`Editar ${singular}`:`Nuevo ${singular}`} saving={saving} saveLabel={selected&&!duplicateMode?'Modificar':'Crear'} duplicateMode={duplicateMode} onClose={()=>setOpen(false)} onSave={save}>
   <Stack spacing={2} sx={{flex:1,minHeight:0}}>{fields.map(f=>f.type==='checkbox'?
    <FormControlLabel key={f.name} control={<Checkbox checked={Boolean(form[f.name])} disabled={disabledOf(f)} onChange={(_,v)=>set(f,v)}/>} label={f.label}/>
    :f.type==='select'?
    <FormControl key={f.name} fullWidth size="small" required={f.required}>
      <InputLabel>{f.label}</InputLabel>
      <Select label={f.label} value={(form[f.name]??'') as string|number} disabled={disabledOf(f)} onChange={e=>set(f,e.target.value)}>
        {optionsOf(f).map(o=><MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
      </Select>
    </FormControl>
    :f.fileDrop?<FileDropTextField key={f.name} fullWidth size="small" required={f.required} label={f.label}
      value={String(form[f.name]??'')} disabled={disabledOf(f)} onValueChange={value=>set(f,value)}/>
    :f.expanding?<ExpandingTextField key={f.name} label={f.label} required={f.required} disabled={disabledOf(f)} value={String(form[f.name]??'')} onChange={value=>set(f,value)}/>
    :<TextField key={f.name} fullWidth size="small" required={f.required} label={f.label}
      type={f.type==='number'?'number':f.type==='email'?'email':f.type==='color'?'color':f.type==='date'?'date':'text'}
      slotProps={f.type==='date'?{inputLabel:{shrink:true}}:undefined}
      multiline={f.multiline} minRows={f.multiline?(f.minRows??3):undefined}
      value={(form[f.name]??'') as string|number} disabled={disabledOf(f)}
      onChange={e=>set(f,f.type==='number'?(e.target.value===''?'':Number(e.target.value)):e.target.value)}/>)}</Stack>
  </EntityDrawer>
  <ConfirmDeleteDialog open={deleteOpen} text={`¿Está seguro de que desea borrar ${singular}${selected?` seleccionado`:''}?`} loading={deleteMutation.isPending} onCancel={()=>setDeleteOpen(false)} onConfirm={remove}/>
 </Box>
}
