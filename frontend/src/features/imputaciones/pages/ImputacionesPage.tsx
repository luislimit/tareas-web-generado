import { Alert, Box, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Tooltip, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCurrentUser } from '../../../app/currentUser'
import { useUserStoredState } from '../../../hooks/useUserPagePreferences'
import { AppIcon } from '../../../components/common/AppIcon'
import { StateChip } from '../../../components/common/StateChip'
import { MasterCrudPage, type CrudCreatePreset } from '../../../components/forms/MasterCrudPage'
import { BusinessEntityFiltersWithPetitions, type EstadoActividadFiltro } from '../../../components/filters/BusinessEntityFilters'
import { DatePeriodFilter, getDateRange, type DatePeriod } from '../../../components/filters/DatePeriodFilter'
import { boolLabel, formatDate, formatHours } from '../../../utils/presentation'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { useDocumentos } from '../../documentos/hooks/useDocumentos'
import { DocumentosVinculadosDrawer } from '../../documentos/components/DocumentosVinculadosDrawer'
import { useTiposHora } from '../../tiposHora/hooks/useTiposHora'
import { useEstadosHoras } from '../../estadosHoras/hooks/useEstadosHoras'
import { useEstados } from '../../estados/hooks/useEstados'
import { usePeticiones } from '../../peticiones/hooks/usePeticiones'
import { useSubcategorias } from '../../subcategorias/hooks/useSubcategorias'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'
import { useImputaciones } from '../hooks/useImputaciones'
import type { Imputacion } from '../types/imputacion'

type QuickCreateState = { quickCreate?:'imputacion'; categoriaId?:number|string; subcategoriaId?:number|string; peticionId?:number|string }

const inicial=getDateRange('hoy')

export function ImputacionesPage(){
 const q=useImputaciones(),pq=usePeticiones(),cq=useCategorias(),sq=useSubcategorias(),uq=useUsuarios(),eq=useEstadosHoras(),epq=useEstados(),thq=useTiposHora(),dq=useDocumentos()
 const { currentUserId } = useCurrentUser()
 const location=useLocation()
 const quickState=(location.state??{}) as QuickCreateState
 const [actividadFiltro,setActividadFiltro]=useUserStoredState<EstadoActividadFiltro>(currentUserId,'imputaciones','actividad','activas')
 const [categoriasFiltro,setCategoriasFiltro]=useUserStoredState<string[]>(currentUserId,'imputaciones','categorias',[])
 const [subcategoriasFiltro,setSubcategoriasFiltro]=useUserStoredState<string[]>(currentUserId,'imputaciones','subcategorias',[])
 const [estadosPeticionFiltro,setEstadosPeticionFiltro]=useUserStoredState<string[]|null>(currentUserId,'imputaciones','estadosPeticion',null)
 const [peticionesFiltro,setPeticionesFiltro]=useUserStoredState<string[]>(currentUserId,'imputaciones','peticiones',[])
 const [campoFecha,setCampoFecha]=useUserStoredState<'fecha'|'fechaAlta'>(currentUserId,'imputaciones','campoFecha','fecha')
 const [periodo,setPeriodo]=useUserStoredState<DatePeriod>(currentUserId,'imputaciones','periodoFecha','hoy')
 const [desde,setDesde]=useUserStoredState<string>(currentUserId,'imputaciones','fechaDesde',inicial.desde)
 const [hasta,setHasta]=useUserStoredState<string>(currentUserId,'imputaciones','fechaHasta',inicial.hasta)
 const rangoPeriodo=periodo==='personalizado'?{desde,hasta}:getDateRange(periodo)
 const desdeFiltro=rangoPeriodo.desde, hastaFiltro=rangoPeriodo.hasta
 const [docsImputacion,setDocsImputacion]=useState<Imputacion|null>(null)
 const estadosPeticionSeleccionados=estadosPeticionFiltro??(epq.data??[]).filter(e=>!e.estadoFinal).map(e=>String(e.id))

 const columns:GridColDef<Imputacion>[]=[
  {field:'categoriaNombre',headerName:'Categoría',width:115,renderCell:({row})=>{const p=(pq.data??[]).find(x=>String(x.id)===String(row.peticionId));const c=(cq.data??[]).find(x=>String(x.id)===String(p?.categoriaId));return <Tooltip title={c?.nombre??''}><Box component="span">{c?.codigo??''}</Box></Tooltip>}},
  {field:'subcategoriaNombre',headerName:'Subcategoría',width:125,renderCell:({row})=>{const p=(pq.data??[]).find(x=>String(x.id)===String(row.peticionId));const sc=(sq.data??[]).find(x=>String(x.id)===String(p?.subcategoriaId));return <Tooltip title={sc?.nombre??''}><Box component="span">{sc?.codigo??''}</Box></Tooltip>}},
  {field:'peticionCodigo',headerName:'Petición',width:140,renderCell:({row})=>{const p=(pq.data??[]).find(x=>String(x.id)===String(row.peticionId));return <Tooltip title={p?.asunto??''}><Box component="span">{row.peticionCodigo??p?.codigo??''}</Box></Tooltip>}},
  {field:'fecha',headerName:'Fecha',width:115,valueFormatter:v=>formatDate(v)},
  {field:'usuarioNombre',headerName:'Usuario',width:150},
  {field:'horas',headerName:'Horas',width:90,valueFormatter:formatHours},
  {field:'tipoHoraNombre',headerName:'Tipo de horas',width:155},
  {field:'extra',headerName:'Extra',width:80,valueFormatter:v=>boolLabel(v)},
  {field:'estadoHorasNombre',headerName:'Estado horas',width:155,renderCell:({row})=>{const estado=(eq.data??[]).find(e=>String(e.id)===String(row.estadoHorasId));return <StateChip label={row.estadoHorasNombre} color={estado?.color}/>}},
  {field:'descripcion',headerName:'Descripción',flex:1,minWidth:220}
 ]


 const rangoInvalido=Boolean(desdeFiltro&&hastaFiltro&&dayjs(hastaFiltro).isBefore(dayjs(desdeFiltro),'day'))
 const rows=useMemo(()=>{
  if(rangoInvalido)return []
  const peticiones=new Map((pq.data??[]).map(p=>[String(p.id),p]))
  return (q.data??[]).filter(r=>{
   const p=peticiones.get(String(r.peticionId))
   const c=(cq.data??[]).find(x=>String(x.id)===String(p?.categoriaId))
   const sc=(sq.data??[]).find(x=>String(x.id)===String(p?.subcategoriaId))
   if(actividadFiltro!=='todas'&&(actividadFiltro==='activas'?(!p?.activo||!c?.activo||!sc?.activo):(Boolean(p?.activo)&&Boolean(c?.activo)&&Boolean(sc?.activo))))return false
   if(categoriasFiltro.length&&(!p||!categoriasFiltro.includes(String(p.categoriaId))))return false
   if(subcategoriasFiltro.length&&(!p||!subcategoriasFiltro.includes(String(p.subcategoriaId))))return false
   if(estadosPeticionSeleccionados.length&&(!p||!estadosPeticionSeleccionados.includes(String(p.estadoId))))return false
   if(peticionesFiltro.length&&!peticionesFiltro.includes(String(r.peticionId)))return false
   const fechaValor=String(r[campoFecha]??'')
   if(periodo!=='todas'){
    if(!fechaValor)return false
    if(desdeFiltro&&dayjs(fechaValor).isBefore(dayjs(desdeFiltro),'day'))return false
    if(hastaFiltro&&dayjs(fechaValor).isAfter(dayjs(hastaFiltro),'day'))return false
   }
   return true
  }).map(r=>{
   const p=peticiones.get(String(r.peticionId))
   return {...r,categoriaNombre:(cq.data??[]).find(c=>String(c.id)===String(p?.categoriaId))?.nombre??'',subcategoriaNombre:(sq.data??[]).find(sc=>String(sc.id)===String(p?.subcategoriaId))?.nombre??''}
  })
 },[q.data,pq.data,cq.data,sq.data,actividadFiltro,categoriasFiltro,subcategoriasFiltro,estadosPeticionSeleccionados,peticionesFiltro,campoFecha,periodo,desdeFiltro,hastaFiltro,rangoInvalido])

 function cambiaActividad(value:EstadoActividadFiltro){
  setActividadFiltro(value)
  setCategoriasFiltro([])
  setSubcategoriasFiltro([])
  setPeticionesFiltro([])
 }
 function cambiaCategorias(values:string[]){
  setCategoriasFiltro(values)
  setSubcategoriasFiltro(prev=>prev.filter(v=>(sq.data??[]).some(s=>String(s.id)===v&&(!values.length||values.includes(String(s.categoriaId))))))
  setPeticionesFiltro(prev=>prev.filter(v=>(pq.data??[]).some(p=>String(p.id)===v&&(!values.length||values.includes(String(p.categoriaId))))))
 }
 function cambiaEstadosPeticion(values:string[]){
  setEstadosPeticionFiltro(values)
  setPeticionesFiltro(prev=>prev.filter(v=>(pq.data??[]).some(p=>String(p.id)===v&&(!values.length||values.includes(String(p.estadoId))))))
 }
 function cambiaSubcategorias(values:string[]){
  setSubcategoriasFiltro(values)
  setPeticionesFiltro(prev=>prev.filter(v=>(pq.data??[]).some(p=>String(p.id)===v&&(!categoriasFiltro.length||categoriasFiltro.includes(String(p.categoriaId)))&&(!values.length||values.includes(String(p.subcategoriaId))))))
 }

 const categoriaOpts=(cq.data??[]).map(c=>({value:c.id,label:`${c.codigo?`${c.codigo} - `:''}${c.nombre}`}))
 const userOpts=(uq.data??[]).map(u=>({value:u.id,label:u.nombre}))
 const estadoOpts=(eq.data??[]).filter(e=>e.activo).map(e=>({value:e.id,label:e.nombre}))
 const tipoHoraOpts=(thq.data??[]).filter(t=>t.activo).map(t=>({value:t.id,label:t.nombre}))
 const createPreset:CrudCreatePreset|undefined=quickState.quickCreate==='imputacion'&&quickState.peticionId!=null?{
  key:`${location.key}-${quickState.peticionId}`,
  values:{categoriaId:quickState.categoriaId??'',subcategoriaId:quickState.subcategoriaId??'',peticionId:quickState.peticionId},
  disabledFields:['categoriaId','subcategoriaId','peticionId'],
 }:undefined

 const filters=<BusinessEntityFiltersWithPetitions
  estado={actividadFiltro} categorias={categoriasFiltro} subcategorias={subcategoriasFiltro} estadosPeticion={estadosPeticionSeleccionados}
  categoriasData={cq.data??[]} subcategoriasData={sq.data??[]} estadosPeticionData={epq.data??[]}
  peticionesData={pq.data??[]} peticiones={peticionesFiltro}
  onEstadoChange={cambiaActividad} onCategoriasChange={cambiaCategorias} onSubcategoriasChange={cambiaSubcategorias}
  onEstadosPeticionChange={cambiaEstadosPeticion} onPeticionesChange={setPeticionesFiltro}
 />

 const secondaryFilters=<>
  <FormControl size="small" sx={{minWidth:170}}><InputLabel>Fecha a filtrar</InputLabel><Select label="Fecha a filtrar" value={campoFecha} onChange={e=>setCampoFecha(e.target.value as 'fecha'|'fechaAlta')}><MenuItem value="fecha">Fecha imputación</MenuItem><MenuItem value="fechaAlta">Fecha alta</MenuItem></Select></FormControl>
  <DatePeriodFilter period={periodo} desde={desdeFiltro} hasta={hastaFiltro} error={rangoInvalido} onChange={(period,from,to)=>{setPeriodo(period);setDesde(from);setHasta(to)}}/>
  {rangoInvalido&&<Alert severity="error" sx={{py:0}}>La fecha hasta debe ser mayor o igual que la fecha desde.</Alert>}
 </>

 return <>
 <MasterCrudPage<Imputacion>
  title="Imputaciones" subtitle="Registro rápido de horas realizadas" singular="imputación"
  rows={rows} loading={q.isLoading} error={q.error} columns={columns} url="/imputaciones" queryKey="imputaciones"
  searchFields={['peticionCodigo','descripcion']} filters={filters} secondaryFilters={secondaryFilters} createPreset={createPreset}
  onClearFilters={()=>{cambiaActividad('activas');setEstadosPeticionFiltro(null);setCampoFecha('fecha');setPeriodo('hoy');setDesde(inicial.desde);setHasta(inicial.hasta)}}
  tableSummary={visibleRows=>{const total=visibleRows.reduce((sum,row)=>{const horas=Number(row.horas);return sum+(Number.isFinite(horas)?horas:0)},0);return <Box sx={{display:'flex',justifyContent:'flex-end'}}><Typography variant="body2" fontWeight={700}>Horas mostradas: {formatHours(total)}</Typography></Box>}}
  actionsWidth={178}
  rowActions={row=><>
   <Tooltip title={(dq.data??[]).some(d=>String(d.imputacionId)===String(row.id))?`Documentos vinculados (${(dq.data??[]).filter(d=>String(d.imputacionId)===String(row.id)).length})`:'Sin documentos vinculados'}><IconButton size="small" onClick={e=>{e.stopPropagation();setDocsImputacion(row)}}><AppIcon name={(dq.data??[]).some(d=>String(d.imputacionId)===String(row.id))?'documentFilled':'documentEmpty'} fontSize="small" color={(dq.data??[]).some(d=>String(d.imputacionId)===String(row.id))?'primary':'action'}/></IconButton></Tooltip>
  </>}
  fields={[
   {name:'categoriaId',label:'Categoría',type:'select',required:true,options:categoriaOpts,onChange:()=>({subcategoriaId:'',peticionId:''})},
   {name:'subcategoriaId',label:'Subcategoría',type:'select',required:true,disabled:form=>!form.categoriaId,options:form=>(sq.data??[]).filter(s=>String(s.categoriaId)===String(form.categoriaId??'')).map(s=>({value:s.id,label:`${s.codigo?`${s.codigo} - `:''}${s.nombre}`})),onChange:()=>({peticionId:''})},
   {name:'peticionId',label:'Petición',type:'select',required:true,disabled:form=>!form.subcategoriaId,options:form=>(pq.data??[]).filter(p=>String(p.categoriaId)===String(form.categoriaId??'')&&String(p.subcategoriaId)===String(form.subcategoriaId??'')).map(p=>({value:p.id,label:`${p.codigo} - ${p.asunto}`}))},
   {name:'usuarioId',label:'Usuario',type:'select',required:true,options:userOpts},
   {name:'fecha',label:'Fecha',type:'date',required:true},
   {name:'horas',label:'Horas',type:'number',required:true},
   {name:'extra',label:'Extra',type:'checkbox'},
   {name:'estadoHorasId',label:'Estado horas',type:'select',required:true,options:estadoOpts,selectFirst:true},
   {name:'tipoHoraId',label:'Tipo de horas',type:'select',options:[{value:'',label:'— Sin tipo —'},...tipoHoraOpts]},
   {name:'descripcion',label:'Descripción',expanding:true}
  ]}
  toForm={r=>{
   const peticion=(pq.data??[]).find(p=>String(p.id)===String(r?.peticionId??''))
   return {categoriaId:peticion?.categoriaId??'',subcategoriaId:peticion?.subcategoriaId??'',peticionId:r?.peticionId??'',usuarioId:r?.usuarioId??currentUserId,fecha:r?.fecha??dayjs().format('YYYY-MM-DD'),horas:r?.horas??0,extra:r?.extra??false,estadoHorasId:r?.estadoHorasId??'',tipoHoraId:r?.tipoHoraId??'',descripcion:r?.descripcion??peticion?.asunto??''}
  }}
  toPayload={f=>({peticionId:Number(f.peticionId),usuarioId:Number(f.usuarioId),fecha:f.fecha,horas:Number(f.horas),extra:Boolean(f.extra),estadoHorasId:Number(f.estadoHorasId),tipoHoraId:f.tipoHoraId===''?null:Number(f.tipoHoraId),descripcion:f.descripcion})}
 />

 <DocumentosVinculadosDrawer
  open={Boolean(docsImputacion)}
  target={docsImputacion ? {peticionId:docsImputacion.peticionId,peticionCodigo:docsImputacion.peticionCodigo,usuarioId:docsImputacion.usuarioId,imputacionId:docsImputacion.id} : null}
  onClose={()=>setDocsImputacion(null)}
 />
 </>
}
