import { Alert, Box, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Tooltip } from '@mui/material'
import type { GridColDef, GridRowParams } from '@mui/x-data-grid'
import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getHttpErrorMessage } from '../../api/httpError'
import { useResourceMutations } from '../../api/useResourceMutations'
import { ConfirmDeleteDialog } from '../common/ConfirmDeleteDialog'
import { EntityDrawer } from '../common/EntityDrawer'
import { PageHeader } from '../layout/PageHeader'
import { ResourceTable } from '../tables/ResourceTable'
import { AppIcon } from '../common/AppIcon'

export interface SelectOption { value:number|string; label:string }
export interface CrudField {
  name:string
  label:string
  type?:'text'|'number'|'checkbox'|'select'|'color'|'email'|'date'
  required?:boolean
  options?:SelectOption[] | ((form:Record<string,unknown>)=>SelectOption[])
  disabled?:boolean | ((form:Record<string,unknown>)=>boolean)
  onChange?:(value:unknown, form:Record<string,unknown>)=>Record<string,unknown>
}
interface Props<T extends {id:number|string}> {
 title:string; subtitle?:string; singular:string; rows:T[]; loading:boolean; error?:unknown; columns:GridColDef<T>[]; fields:CrudField[]; url:string; queryKey:string;
 toForm:(row?:T)=>Record<string,unknown>; toPayload:(form:Record<string,unknown>)=>Record<string,unknown>; searchFields?:(keyof T)[]; filters?:ReactNode; tableSummary?:(visibleRows:T[])=>ReactNode
}
export function MasterCrudPage<T extends {id:number|string}>({title,subtitle,singular,rows,loading,error,columns,fields,url,queryKey,toForm,toPayload,searchFields=[],filters,tableSummary}:Props<T>){
 const [selected,setSelected]=useState<T|null>(null); const [open,setOpen]=useState(false); const [form,setForm]=useState<Record<string,unknown>>(()=>toForm()); const [deleteOpen,setDeleteOpen]=useState(false)
 const {createMutation,updateMutation,deleteMutation}=useResourceMutations<T,Record<string,unknown>>(url,queryKey)
 const saving=createMutation.isPending||updateMutation.isPending; const mutationError=createMutation.error||updateMutation.error||deleteMutation.error
 const actionCols=useMemo<GridColDef<T>[]>(()=>[...columns,{field:'acciones',headerName:'Acciones',width:104,sortable:false,filterable:false,renderCell:({row})=><Stack direction="row" spacing={.25}><Tooltip title="Editar"><IconButton size="small" color="primary" onClick={(e)=>{e.stopPropagation();edit(row)}}><AppIcon name="edit" fontSize="small" /></IconButton></Tooltip><Tooltip title="Eliminar"><IconButton size="small" color="error" onClick={(e)=>{e.stopPropagation();setSelected(row);setDeleteOpen(true)}}><AppIcon name="delete" fontSize="small" /></IconButton></Tooltip></Stack>}], [columns])
 function create(){setSelected(null);setForm(toForm());setOpen(true)}
 function edit(row:T){setSelected(row);setForm(toForm(row));setOpen(true)}
 async function save(){const payload=toPayload(form); if(selected) await updateMutation.mutateAsync({id:selected.id,payload}); else await createMutation.mutateAsync(payload); setOpen(false)}
 async function remove(){if(!selected)return; await deleteMutation.mutateAsync(selected.id);setDeleteOpen(false);setSelected(null)}
 const set=(field:CrudField,value:unknown)=>setForm(v=>({...v,[field.name]:value,...(field.onChange?.(value,v)??{})}))
 const optionsOf=(field:CrudField)=>typeof field.options==='function'?field.options(form):(field.options??[])
 const disabledOf=(field:CrudField)=>typeof field.disabled==='function'?field.disabled(form):Boolean(field.disabled)
 return <Box>
  <PageHeader title={title} subtitle={subtitle} actionLabel={`Nuevo ${singular}`} actionIcon={<AppIcon name="add" fontSize="small" />} onAction={create}/>
  {mutationError&&<Alert severity="error" sx={{mb:1.5}}>{getHttpErrorMessage(mutationError)}</Alert>}
  {filters}
  <ResourceTable rows={rows} columns={actionCols} loading={loading} error={error} searchFields={searchFields} searchPlaceholder={`Buscar en ${title.toLowerCase()}...`} summary={tableSummary} />
  <EntityDrawer open={open} title={selected?`Editar ${singular}`:`Nuevo ${singular}`} saving={saving} onClose={()=>setOpen(false)} onSave={save}>
   <Stack spacing={2}>{fields.map(f=>f.type==='checkbox'?<FormControlLabel key={f.name} control={<Checkbox checked={Boolean(form[f.name])} onChange={(_,v)=>set(f,v)}/>} label={f.label}/>:f.type==='select'?<FormControl key={f.name} fullWidth size="small" required={f.required}><InputLabel>{f.label}</InputLabel><Select label={f.label} value={(form[f.name]??'') as string|number} disabled={disabledOf(f)} onChange={e=>set(f,e.target.value)}>{optionsOf(f).map(o=><MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}</Select></FormControl>:<TextField key={f.name} fullWidth size="small" required={f.required} label={f.label} type={f.type==='number'?'number':f.type==='email'?'email':f.type==='color'?'color':f.type==='date'?'date':'text'} InputLabelProps={f.type==='date'?{shrink:true}:undefined} value={(form[f.name]??'') as string|number} disabled={disabledOf(f)} onChange={e=>set(f,f.type==='number'?(e.target.value===''?'':Number(e.target.value)):e.target.value)}/>)}</Stack>
  </EntityDrawer>
  <ConfirmDeleteDialog open={deleteOpen} text={`¿Está seguro de que desea borrar ${singular}${selected?` seleccionado`:''}?`} loading={deleteMutation.isPending} onCancel={()=>setDeleteOpen(false)} onConfirm={remove}/>
 </Box>
}
