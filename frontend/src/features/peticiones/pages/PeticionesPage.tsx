import { Alert, Box, Button, Checkbox, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useMemo, useRef, useState } from 'react'
import { getHttpErrorMessage } from '../../../api/httpError'
import { useResourceMutations } from '../../../api/useResourceMutations'
import { useCurrentUser } from '../../../app/currentUser'
import { AppIcon } from '../../../components/common/AppIcon'
import { ConfirmDeleteDialog } from '../../../components/common/ConfirmDeleteDialog'
import { EntityDrawer } from '../../../components/common/EntityDrawer'
import { StateChip } from '../../../components/common/StateChip'
import { PageHeader } from '../../../components/layout/PageHeader'
import { BusinessEntityFilters, type EstadoActividadFiltro } from '../../../components/filters/BusinessEntityFilters'
import { DatePeriodFilter, getDateRange, type DatePeriod } from '../../../components/filters/DatePeriodFilter'
import { FilterBar } from '../../../components/filters/FilterBar'
import { ResourceTable } from '../../../components/tables/ResourceTable'
import { formatDate, formatHours } from '../../../utils/presentation'
import { exportToExcel } from '../../../utils/exportExcel'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { useEstados } from '../../estados/hooks/useEstados'
import { useEstadosHoras } from '../../estadosHoras/hooks/useEstadosHoras'
import { useTiposHora } from '../../tiposHora/hooks/useTiposHora'
import { useImputaciones } from '../../imputaciones/hooks/useImputaciones'
import { ImputacionInfoDrawer } from '../../imputaciones/components/ImputacionInfoDrawer'
import type { Imputacion } from '../../imputaciones/types/imputacion'
import { useSubcategorias } from '../../subcategorias/hooks/useSubcategorias'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'
import { useDocumentos } from '../../documentos/hooks/useDocumentos'
import { DocumentosVinculadosDrawer } from '../../documentos/components/DocumentosVinculadosDrawer'
import { useHistorialPeticion, usePeticionMutations } from '../hooks/usePeticionMutations'
import { usePeticiones } from '../hooks/usePeticiones'
import type { CambioEstadoRequest, Peticion, PeticionRequest } from '../types/peticion'
import { ExpandingTextField } from '../../../components/forms/ExpandingTextField'

const id = (v:number|string) => Number(v)
const emptyForm:PeticionRequest={codigo:'',asunto:'',descripcion:'',categoriaId:'',subcategoriaId:'',usuarioId:'',estadoId:'',fechaInicioPrevista:'',fechaFinPrevista:'',fechaInicioReal:'',fechaFinReal:'',horasPrevistas:0,porcentaje:0,rutaDocumentos:'',activo:true}

export function PeticionesPage(){
 const { currentUserId } = useCurrentUser()
 const q=usePeticiones(),eq=useEstados(),ehq=useEstadosHoras(),thq=useTiposHora(),iq=useImputaciones(),dq=useDocumentos(),cq=useCategorias(),sq=useSubcategorias(),uq=useUsuarios(),m=usePeticionMutations()
 const imputacionMutations=useResourceMutations<any,any>('/imputaciones','imputaciones')
 const [selected,setSelected]=useState<Peticion|null>(null)
 const [editOpen,setEditOpen]=useState(false)
 const [deleteOpen,setDeleteOpen]=useState(false)
 const [changeOpen,setChangeOpen]=useState(false)
 const [historyOpen,setHistoryOpen]=useState(false)
 const [quickImputacionOpen,setQuickImputacionOpen]=useState(false)
 const [docsPeticion,setDocsPeticion]=useState<Peticion|null>(null)
 const [historyImputacion,setHistoryImputacion]=useState<Imputacion|null>(null)
 const [actividadFiltro,setActividadFiltro]=useState<EstadoActividadFiltro>('activas')
 const [estadosFiltro,setEstadosFiltro]=useState<string[]|null>(null)
 const [categoriasFiltro,setCategoriasFiltro]=useState<string[]>([])
 const [subcategoriasFiltro,setSubcategoriasFiltro]=useState<string[]>([])
 const [campoFecha,setCampoFecha]=useState<keyof Peticion>('fechaAlta')
 const [periodoFecha,setPeriodoFecha]=useState<DatePeriod>('todas')
 const [desde,setDesde]=useState('')
 const [hasta,setHasta]=useState('')
 const [form,setForm]=useState<PeticionRequest>(emptyForm)
 const [change,setChange]=useState<CambioEstadoRequest>({estadoNuevoId:'',usuarioId:'',fechaCambio:dayjs().format('YYYY-MM-DDTHH:mm'),observaciones:''})
 const [quickImputacion,setQuickImputacion]=useState({fecha:dayjs().format('YYYY-MM-DD'),horas:0,extra:false,estadoHorasId:'',tipoHoraId:'',usuarioId:'',descripcion:''})
 const exportRowsRef=useRef<Peticion[]>([])
 const history=useHistorialPeticion(selected?.id,historyOpen)
 const estadosSeleccionados=estadosFiltro??(eq.data??[]).filter(e=>!e.estadoFinal).map(e=>String(e.id))
 const subcategoriasFormulario=useMemo(()=>form.categoriaId?(sq.data??[]).filter(s=>String(s.categoriaId)===String(form.categoriaId)):[],[sq.data,form.categoriaId])
 const rows=useMemo(()=>(q.data??[]).filter(r=>{
  const c=(cq.data??[]).find(x=>String(x.id)===String(r.categoriaId))
  const sc=(sq.data??[]).find(x=>String(x.id)===String(r.subcategoriaId))
  if(actividadFiltro!=='todas'&&(actividadFiltro==='activas'?(!r.activo||!c?.activo||!sc?.activo):(Boolean(r.activo)&&Boolean(c?.activo)&&Boolean(sc?.activo))))return false
  if(estadosSeleccionados.length&&!estadosSeleccionados.includes(String(r.estadoId)))return false
  if(categoriasFiltro.length&&!categoriasFiltro.includes(String(r.categoriaId)))return false
  if(subcategoriasFiltro.length&&!subcategoriasFiltro.includes(String(r.subcategoriaId)))return false
  const f=String(r[campoFecha]??'')
  if(periodoFecha!=='todas'){
   if(!f)return false
   if(desde&&dayjs(f).isBefore(dayjs(desde),'day'))return false
   if(hasta&&dayjs(f).isAfter(dayjs(hasta),'day'))return false
  }
  return true
 }),[q.data,cq.data,sq.data,actividadFiltro,estadosSeleccionados,categoriasFiltro,subcategoriasFiltro,campoFecha,periodoFecha,desde,hasta])

 function cambiaActividad(value:EstadoActividadFiltro){
  setActividadFiltro(value)
  setCategoriasFiltro([])
  setSubcategoriasFiltro([])
 }
 function openQuickImputacion(row:Peticion){
  setSelected(row)
  setQuickImputacion({
   fecha:dayjs().format('YYYY-MM-DD'),horas:0,extra:false,
   estadoHorasId:(ehq.data??[]).find(e=>e.activo)?.id??'',tipoHoraId:(thq.data??[]).find(t=>t.activo)?.id??'',usuarioId:currentUserId||row.usuarioId,descripcion:row.asunto
  })
  setQuickImputacionOpen(true)
 }
 async function saveQuickImputacion(){
  if(!selected)return
  await imputacionMutations.createMutation.mutateAsync({
   peticionId:Number(selected.id),usuarioId:Number(quickImputacion.usuarioId),fecha:quickImputacion.fecha,
   horas:Number(quickImputacion.horas),extra:Boolean(quickImputacion.extra),estadoHorasId:Number(quickImputacion.estadoHorasId),tipoHoraId:quickImputacion.tipoHoraId===''?null:Number(quickImputacion.tipoHoraId),descripcion:quickImputacion.descripcion
  })
  setQuickImputacionOpen(false)
 }


 function limpiarFiltros(){
  setActividadFiltro('activas')
  setEstadosFiltro(null)
  setCategoriasFiltro([])
  setSubcategoriasFiltro([])
  setCampoFecha('fechaAlta')
  const range=getDateRange('todas')
  setPeriodoFecha('todas')
  setDesde(range.desde)
  setHasta(range.hasta)
 }

 function exportar(){
  exportToExcel('peticion',exportRowsRef.current,[
   {header:'Categoría',value:r=>{const c=(cq.data??[]).find(x=>String(x.id)===String(r.categoriaId));return c?`${c.codigo} - ${c.nombre}`:(r.categoriaNombre??'')}},
   {header:'Subcategoría',value:r=>{const sc=(sq.data??[]).find(x=>String(x.id)===String(r.subcategoriaId));return sc?`${sc.codigo} - ${sc.nombre}`:(r.subcategoriaNombre??'')}},
   {header:'Código',value:r=>r.codigo},
   {header:'Asunto',value:r=>r.asunto},
   {header:'Descripción',value:r=>r.descripcion??''},
   {header:'Usuario',value:r=>r.usuarioNombre??''},
   {header:'Estado petición',value:r=>r.estadoNombre??''},
   {header:'Fecha alta',value:r=>r.fechaAlta??''},
   {header:'Inicio previsto',value:r=>r.fechaInicioPrevista??''},
   {header:'Fin previsto',value:r=>r.fechaFinPrevista??''},
   {header:'Inicio real',value:r=>r.fechaInicioReal??''},
   {header:'Fin real',value:r=>r.fechaFinReal??''},
   {header:'Horas previstas',value:r=>Number(r.horasPrevistas??0)},
   {header:'Horas reales',value:r=>Number(r.horasReales??0)},
   {header:'% avance',value:r=>Number(r.porcentaje??0)},
   {header:'Ruta documentos',value:r=>r.rutaDocumentos??''},
   {header:'Activo',value:r=>r.activo?'Sí':'No'},
  ])
 }


 const columns:GridColDef<Peticion>[]=[
  {field:'categoriaNombre',headerName:'Categoría',width:115,renderCell:({row})=>{const c=(cq.data??[]).find(x=>String(x.id)===String(row.categoriaId));return <Tooltip title={c?.nombre??''}><Box component="span">{c?.codigo??row.categoriaNombre}</Box></Tooltip>}},
  {field:'subcategoriaNombre',headerName:'Subcategoría',width:125,renderCell:({row})=>{const sc=(sq.data??[]).find(x=>String(x.id)===String(row.subcategoriaId));return <Tooltip title={sc?.nombre??''}><Box component="span">{sc?.codigo??row.subcategoriaNombre}</Box></Tooltip>}},
  {field:'codigo',headerName:'Código',width:115},
  {field:'asunto',headerName:'Asunto',flex:1,minWidth:240},
  {field:'estadoNombre',headerName:'Estado',width:145,renderCell:({row})=>{const estado=(eq.data??[]).find(e=>String(e.id)===String(row.estadoId));return <StateChip label={row.estadoNombre} color={estado?.color}/>}},
  {field:'fechaInicioPrevista',headerName:'Inicio prev.',width:115,valueFormatter:v=>formatDate(v)},
  {field:'fechaFinPrevista',headerName:'Fin prev.',width:115,valueFormatter:v=>formatDate(v)},
  {field:'horasPrevistas',headerName:'H. prev.',width:90,valueFormatter:formatHours},
  {field:'horasReales',headerName:'H. reales',width:90,valueFormatter:formatHours},
  {field:'porcentaje',headerName:'%',width:75},
  {field:'acciones',headerName:'Acciones',width:244,sortable:false,renderCell:({row})=><Stack direction="row" spacing={.25}>
    <Tooltip title="Nueva imputación"><IconButton size="small" color="primary" onClick={(e)=>{e.stopPropagation();openQuickImputacion(row)}}><AppIcon name="addTime" fontSize="small" /></IconButton></Tooltip>
    <Tooltip title={(dq.data??[]).some(d=>String(d.peticionId)===String(row.id))?`Documentos vinculados (${(dq.data??[]).filter(d=>String(d.peticionId)===String(row.id)).length})`:'Sin documentos vinculados'}><IconButton size="small" onClick={(e)=>{e.stopPropagation();setDocsPeticion(row)}}><AppIcon name={(dq.data??[]).some(d=>String(d.peticionId)===String(row.id))?'documentFilled':'documentEmpty'} fontSize="small" color={(dq.data??[]).some(d=>String(d.peticionId)===String(row.id))?'primary':'action'} /></IconButton></Tooltip>
    <Tooltip title="Editar petición"><IconButton size="small" color="primary" onClick={(e)=>{e.stopPropagation();openEdit(row)}}><AppIcon name="edit" fontSize="small" /></IconButton></Tooltip>
    <Tooltip title="Cambiar estado"><IconButton size="small" color="secondary" onClick={(e)=>{e.stopPropagation();setSelected(row);setChange({estadoNuevoId:eq.data?.[0]?.id??'',usuarioId:currentUserId||row.usuarioId,fechaCambio:dayjs().format('YYYY-MM-DDTHH:mm'),observaciones:''});setChangeOpen(true)}}><AppIcon name="changeState" fontSize="small" /></IconButton></Tooltip>
    <Tooltip title="Ver historial"><IconButton size="small" onClick={(e)=>{e.stopPropagation();setSelected(row);setHistoryOpen(true)}}><AppIcon name="history" fontSize="small" /></IconButton></Tooltip>
    <Tooltip title="Eliminar petición"><IconButton size="small" color="error" onClick={(e)=>{e.stopPropagation();setSelected(row);setDeleteOpen(true)}}><AppIcon name="delete" fontSize="small" /></IconButton></Tooltip>
  </Stack>},
 ]

 function openEdit(row?:Peticion){
  setSelected(row??null)
  setForm(row?{
   codigo:row.codigo,asunto:row.asunto,descripcion:row.descripcion??'',categoriaId:row.categoriaId,subcategoriaId:row.subcategoriaId,
   usuarioId:row.usuarioId,estadoId:row.estadoId,fechaInicioPrevista:row.fechaInicioPrevista??'',fechaFinPrevista:row.fechaFinPrevista??'',
   fechaInicioReal:row.fechaInicioReal??'',fechaFinReal:row.fechaFinReal??'',horasPrevistas:row.horasPrevistas??0,porcentaje:row.porcentaje??0,
   rutaDocumentos:row.rutaDocumentos??'',activo:row.activo,
  }:{...emptyForm,usuarioId:currentUserId,estadoId:eq.data?.[0]?.id??''})
  setEditOpen(true)
 }
 async function save(){
  const payload={...form,categoriaId:id(form.categoriaId),subcategoriaId:id(form.subcategoriaId),usuarioId:id(form.usuarioId),estadoId:id(form.estadoId)}
  if(selected)await m.updateMutation.mutateAsync({id:selected.id,payload})
  else await m.createMutation.mutateAsync(payload)
  setEditOpen(false)
 }
 async function saveChange(){
  if(!selected)return
  await m.changeMutation.mutateAsync({id:selected.id,payload:{...change,estadoNuevoId:id(change.estadoNuevoId),usuarioId:id(change.usuarioId)}})
  setChangeOpen(false)
 }
 const err=m.createMutation.error||m.updateMutation.error||m.deleteMutation.error||m.changeMutation.error||imputacionMutations.createMutation.error

 return <Box>
  <PageHeader title="Peticiones" subtitle="Seguimiento y planificación del trabajo" createLabel="Nueva petición" onCreate={()=>openEdit()} onExport={exportar} exportLabel="Exportar peticiones a Excel" onClearFilters={limpiarFiltros}/>
  {err&&<Alert severity="error" sx={{mb:1}}>{getHttpErrorMessage(err)}</Alert>}
  <FilterBar>
   <BusinessEntityFilters
    estado={actividadFiltro} categorias={categoriasFiltro} subcategorias={subcategoriasFiltro} estadosPeticion={estadosSeleccionados}
    categoriasData={cq.data??[]} subcategoriasData={sq.data??[]} estadosPeticionData={eq.data??[]}
    onEstadoChange={cambiaActividad}
    onCategoriasChange={values=>{setCategoriasFiltro(values);setSubcategoriasFiltro(prev=>prev.filter(v=>(sq.data??[]).some(sc=>String(sc.id)===v&&(!values.length||values.includes(String(sc.categoriaId))))))}}
    onSubcategoriasChange={setSubcategoriasFiltro}
    onEstadosPeticionChange={setEstadosFiltro}
   />
  </FilterBar>
  <ResourceTable rows={rows} columns={columns} loading={q.isLoading} error={q.error} searchFields={['codigo','asunto','descripcion']} searchPlaceholder="Buscar por textos..." onFilteredRowsChange={filtered=>{exportRowsRef.current=filtered}}
   toolbar={<>
    <FormControl size="small" sx={{minWidth:170}}><InputLabel>Fecha a filtrar</InputLabel><Select label="Fecha a filtrar" value={campoFecha} onChange={e=>setCampoFecha(e.target.value as keyof Peticion)}><MenuItem value="fechaAlta">Fecha alta</MenuItem><MenuItem value="fechaInicioPrevista">Inicio previsto</MenuItem><MenuItem value="fechaFinPrevista">Fin previsto</MenuItem><MenuItem value="fechaInicioReal">Inicio real</MenuItem><MenuItem value="fechaFinReal">Fin real</MenuItem></Select></FormControl>
    <DatePeriodFilter period={periodoFecha} desde={desde} hasta={hasta} error={Boolean(desde&&hasta&&dayjs(hasta).isBefore(dayjs(desde),'day'))} onChange={(period,from,to)=>{setPeriodoFecha(period);setDesde(from);setHasta(to)}}/>
   </>} />

  <EntityDrawer open={editOpen} title={selected?'Editar petición':'Nueva petición'} saving={m.createMutation.isPending||m.updateMutation.isPending} onClose={()=>setEditOpen(false)} onSave={save}>
   <Stack spacing={2} sx={{flex:1,minHeight:0}}>
    <FormControl size="small" required><InputLabel>Categoría</InputLabel><Select label="Categoría" value={form.categoriaId} onChange={e=>setForm({...form,categoriaId:e.target.value,subcategoriaId:''})}>{(cq.data??[]).map(c=><MenuItem key={c.id} value={String(c.id)}>{c.codigo?`${c.codigo} - `:''}{c.nombre}</MenuItem>)}</Select></FormControl>
    <FormControl size="small" required disabled={!form.categoriaId}><InputLabel>Subcategoría</InputLabel><Select label="Subcategoría" value={form.subcategoriaId} onChange={e=>setForm({...form,subcategoriaId:e.target.value})}>{subcategoriasFormulario.map(s=><MenuItem key={s.id} value={String(s.id)}>{s.codigo?`${s.codigo} - `:''}{s.nombre}</MenuItem>)}</Select></FormControl>
    <TextField size="small" label="Código" required value={form.codigo} onChange={e=>setForm({...form,codigo:e.target.value})}/>
    <TextField size="small" label="Asunto" required value={form.asunto} onChange={e=>setForm({...form,asunto:e.target.value})}/>
    <ExpandingTextField label="Descripción" value={form.descripcion} onChange={descripcion=>setForm({...form,descripcion})}/>
    <FormControl size="small" required><InputLabel>Usuario</InputLabel><Select label="Usuario" value={form.usuarioId} onChange={e=>setForm({...form,usuarioId:e.target.value})}>{(uq.data??[]).map(u=><MenuItem key={u.id} value={String(u.id)}>{u.nombre}</MenuItem>)}</Select></FormControl>
    <FormControl size="small" required><InputLabel>Estado inicial</InputLabel><Select label="Estado inicial" value={form.estadoId} onChange={e=>setForm({...form,estadoId:e.target.value})}>{(eq.data??[]).map(e=><MenuItem key={e.id} value={String(e.id)}>{e.nombre}</MenuItem>)}</Select></FormControl>
    <Stack direction="row" spacing={1}>
     <TextField fullWidth size="small" type="date" label="Inicio previsto" slotProps={{ inputLabel: { shrink: true } }} value={form.fechaInicioPrevista} onChange={e=>setForm({...form,fechaInicioPrevista:e.target.value})}/>
     <TextField fullWidth size="small" type="date" label="Fin previsto" slotProps={{ inputLabel: { shrink: true } }} value={form.fechaFinPrevista} onChange={e=>setForm({...form,fechaFinPrevista:e.target.value})}/>
    </Stack>
    <Stack direction="row" spacing={1}>
     <TextField fullWidth size="small" type="number" label="Horas previstas" value={form.horasPrevistas} onChange={e=>setForm({...form,horasPrevistas:Number(e.target.value)})}/>
     <TextField fullWidth size="small" type="number" label="% avance" value={form.porcentaje} onChange={e=>setForm({...form,porcentaje:Number(e.target.value)})}/>
    </Stack>
    <TextField size="small" label="Ruta documentos" value={form.rutaDocumentos} onChange={e=>setForm({...form,rutaDocumentos:e.target.value})}/>
   </Stack>
  </EntityDrawer>

  <EntityDrawer open={changeOpen} title={`Cambiar estado${selected?` · ${selected.codigo}`:''}`} saving={m.changeMutation.isPending} onClose={()=>setChangeOpen(false)} onSave={saveChange}>
   <Stack spacing={2}>
    <FormControl size="small" required><InputLabel>Nuevo estado</InputLabel><Select label="Nuevo estado" value={change.estadoNuevoId} onChange={e=>setChange({...change,estadoNuevoId:e.target.value})}>{(eq.data??[]).map(e=><MenuItem key={e.id} value={String(e.id)}>{e.nombre}</MenuItem>)}</Select></FormControl>
    <FormControl size="small" required><InputLabel>Usuario</InputLabel><Select label="Usuario" value={change.usuarioId} onChange={e=>setChange({...change,usuarioId:e.target.value})}>{(uq.data??[]).map(u=><MenuItem key={u.id} value={String(u.id)}>{u.nombre}</MenuItem>)}</Select></FormControl>
    <TextField size="small" type="datetime-local" label="Fecha" slotProps={{ inputLabel: { shrink: true } }} value={change.fechaCambio} onChange={e=>setChange({...change,fechaCambio:e.target.value})}/>
    <TextField size="small" multiline minRows={4} required label="Observaciones" value={change.observaciones} onChange={e=>setChange({...change,observaciones:e.target.value})}/>
   </Stack>
  </EntityDrawer>

  <EntityDrawer open={historyOpen} title={`Historial${selected?` · ${selected.codigo}`:''}`} saveLabel="Cerrar" onClose={()=>setHistoryOpen(false)} onSave={()=>setHistoryOpen(false)}>
   {history.isLoading?<Typography>Cargando…</Typography>:<Stack spacing={1.5}>{(history.data??[]).map(h=><Box key={h.id} sx={{p:1.5,border:'1px solid #e2e8f0',borderRadius:1}}><Typography fontWeight={700} sx={{mb:.75}}>{formatDate(h.fechaCambio,true)}</Typography><Stack direction="row" spacing={1} alignItems="center" sx={{mb:.5}}><StateChip label={h.estadoAnteriorNombre} color={(eq.data??[]).find(e=>String(e.id)===String(h.estadoAnteriorId))?.color}/><AppIcon name="changeState" fontSize="small" color="action"/><StateChip label={h.estadoNuevoNombre} color={(eq.data??[]).find(e=>String(e.id)===String(h.estadoNuevoId))?.color}/></Stack><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography variant="caption">{h.usuarioNombre||''}</Typography><Typography variant="body2">{h.observaciones||'Sin observaciones'}</Typography></Box>{h.imputacionId!=null&&<Tooltip title="Cambio generado por una imputación de horas. Ver detalle"><IconButton color="primary" size="small" onClick={()=>setHistoryImputacion((iq.data??[]).find(i=>String(i.id)===String(h.imputacionId))??null)}><AppIcon name="link" fontSize="small"/></IconButton></Tooltip>}</Stack></Box>)}</Stack>}
  </EntityDrawer>

  <EntityDrawer open={quickImputacionOpen} title={`Nueva imputación${selected?` · ${selected.codigo}`:''}`} saving={imputacionMutations.createMutation.isPending} onClose={()=>setQuickImputacionOpen(false)} onSave={saveQuickImputacion}>
   <Stack spacing={2}>
    <TextField size="small" label="Categoría" value={(cq.data??[]).find(c=>String(c.id)===String(selected?.categoriaId))?.nombre??''} disabled/>
    <TextField size="small" label="Subcategoría" value={(sq.data??[]).find(sc=>String(sc.id)===String(selected?.subcategoriaId))?.nombre??''} disabled/>
    <TextField size="small" label="Petición" value={selected?`${selected.codigo} - ${selected.asunto}`:''} disabled/>
    <TextField size="small" type="date" label="Fecha" slotProps={{inputLabel:{shrink:true}}} value={quickImputacion.fecha} onChange={e=>setQuickImputacion({...quickImputacion,fecha:e.target.value})}/>
    <TextField size="small" type="number" label="Horas" required value={quickImputacion.horas} onChange={e=>setQuickImputacion({...quickImputacion,horas:Number(e.target.value)})}/>
    <FormControlLabel control={<Checkbox checked={quickImputacion.extra} onChange={e=>setQuickImputacion({...quickImputacion,extra:e.target.checked})}/>} label="Extra"/>
    <FormControl size="small" required><InputLabel>Estado horas</InputLabel><Select label="Estado horas" value={quickImputacion.estadoHorasId} onChange={e=>setQuickImputacion({...quickImputacion,estadoHorasId:e.target.value})}>{(ehq.data??[]).filter(e=>e.activo).map(e=><MenuItem key={e.id} value={String(e.id)}>{e.nombre}</MenuItem>)}</Select></FormControl>
    <FormControl size="small"><InputLabel>Tipo de horas</InputLabel><Select label="Tipo de horas" value={quickImputacion.tipoHoraId} onChange={e=>setQuickImputacion({...quickImputacion,tipoHoraId:e.target.value})}><MenuItem value=""><em>Sin tipo</em></MenuItem>{(thq.data??[]).filter(t=>t.activo).map(t=><MenuItem key={t.id} value={String(t.id)}>{t.nombre}</MenuItem>)}</Select></FormControl>
    <FormControl size="small" required><InputLabel>Usuario</InputLabel><Select label="Usuario" value={quickImputacion.usuarioId} onChange={e=>setQuickImputacion({...quickImputacion,usuarioId:e.target.value})}>{(uq.data??[]).map(u=><MenuItem key={u.id} value={String(u.id)}>{u.nombre}</MenuItem>)}</Select></FormControl>
    <TextField size="small" multiline minRows={3} label="Descripción" value={quickImputacion.descripcion} onChange={e=>setQuickImputacion({...quickImputacion,descripcion:e.target.value})}/>
   </Stack>
  </EntityDrawer>

  <DocumentosVinculadosDrawer
   open={Boolean(docsPeticion)}
   target={docsPeticion ? {peticionId:docsPeticion.id,peticionCodigo:docsPeticion.codigo,usuarioId:docsPeticion.usuarioId,imputacionId:null} : null}
   onClose={()=>setDocsPeticion(null)}
  />

  <ImputacionInfoDrawer open={Boolean(historyImputacion)} imputacion={historyImputacion} onClose={()=>setHistoryImputacion(null)}/>

  <ConfirmDeleteDialog open={deleteOpen} text={`¿Está seguro de que desea borrar la petición ${selected?.codigo??''}?`} loading={m.deleteMutation.isPending} onCancel={()=>setDeleteOpen(false)} onConfirm={async()=>{if(selected)await m.deleteMutation.mutateAsync(selected.id);setDeleteOpen(false)}}/>
 </Box>
}
