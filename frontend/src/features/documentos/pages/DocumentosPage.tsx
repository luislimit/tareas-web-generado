import { Box, Button, IconButton, Tooltip } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useCurrentUser } from '../../../app/currentUser'
import { useUserStoredState } from '../../../hooks/useUserPagePreferences'
import { AppIcon } from '../../../components/common/AppIcon'
import { MasterCrudPage, type CrudCreatePreset } from '../../../components/forms/MasterCrudPage'
import { BusinessEntityFiltersWithPetitions, type EstadoActividadFiltro } from '../../../components/filters/BusinessEntityFilters'
import { DatePeriodFilter, getDateRange, type DatePeriod } from '../../../components/filters/DatePeriodFilter'
import dayjs from 'dayjs'
import { formatDate } from '../../../utils/presentation'
import { getHttpErrorMessage } from '../../../api/httpError'
import { exportToExcel } from '../../../utils/exportExcel'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { ImputacionInfoDrawer } from '../../imputaciones/components/ImputacionInfoDrawer'
import { useImputaciones } from '../../imputaciones/hooks/useImputaciones'
import type { Imputacion } from '../../imputaciones/types/imputacion'
import { usePeticiones } from '../../peticiones/hooks/usePeticiones'
import { useEstados } from '../../estados/hooks/useEstados'
import { useSubcategorias } from '../../subcategorias/hooks/useSubcategorias'
import { useTiposDocumento } from '../../tiposDocumento/hooks/useTiposDocumento'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'
import { useDocumentos } from '../hooks/useDocumentos'
import { abrirDocumento } from '../api/documentoApi'
import type { Documento } from '../types/documento'

type QuickCreateState = { quickCreate?:'documento'; categoriaId?:number|string; subcategoriaId?:number|string; peticionId?:number|string; imputacionId?:number|string }

export function DocumentosPage(){
 const q=useDocumentos(),pq=usePeticiones(),cq=useCategorias(),sq=useSubcategorias(),epq=useEstados(),tq=useTiposDocumento(),uq=useUsuarios(),iq=useImputaciones()
 const { currentUserId } = useCurrentUser()
 const location=useLocation()
 const quickState=(location.state??{}) as QuickCreateState
 const [actividadFiltro,setActividadFiltro]=useUserStoredState<EstadoActividadFiltro>(currentUserId,'documentos','actividad','activas')
 const [categoriasFiltro,setCategoriasFiltro]=useUserStoredState<string[]>(currentUserId,'documentos','categorias',[])
 const [subcategoriasFiltro,setSubcategoriasFiltro]=useUserStoredState<string[]>(currentUserId,'documentos','subcategorias',[])
 const [estadosPeticionFiltro,setEstadosPeticionFiltro]=useUserStoredState<string[]|null>(currentUserId,'documentos','estadosPeticion',null)
 const [peticionesFiltro,setPeticionesFiltro]=useUserStoredState<string[]>(currentUserId,'documentos','peticiones',[])
 const [periodo,setPeriodo]=useUserStoredState<DatePeriod>(currentUserId,'documentos','periodoFecha','todas')
 const [desde,setDesde]=useUserStoredState<string>(currentUserId,'documentos','fechaDesde','')
 const [hasta,setHasta]=useUserStoredState<string>(currentUserId,'documentos','fechaHasta','')
 const rangoPeriodo=periodo==='personalizado'?{desde,hasta}:getDateRange(periodo)
 const desdeFiltro=rangoPeriodo.desde, hastaFiltro=rangoPeriodo.hasta
 const [imputacionInfo,setImputacionInfo]=useState<Imputacion|null>(null)
 const exportRowsRef=useRef<Documento[]>([])

 const estadosPeticionSeleccionados=estadosPeticionFiltro??(epq.data??[]).filter(e=>!e.estadoFinal).map(e=>String(e.id))
 const columns:GridColDef<Documento>[]=[
  {field:'categoriaNombre',headerName:'Categoría',width:115,renderCell:({row})=>{const p=(pq.data??[]).find(x=>String(x.id)===String(row.peticionId));const c=(cq.data??[]).find(x=>String(x.id)===String(p?.categoriaId));return <Tooltip title={c?.nombre??''}><Box component="span">{c?.codigo??''}</Box></Tooltip>}},
  {field:'subcategoriaNombre',headerName:'Subcategoría',width:125,renderCell:({row})=>{const p=(pq.data??[]).find(x=>String(x.id)===String(row.peticionId));const sc=(sq.data??[]).find(x=>String(x.id)===String(p?.subcategoriaId));return <Tooltip title={sc?.nombre??''}><Box component="span">{sc?.codigo??''}</Box></Tooltip>}},
  {field:'peticionCodigo',headerName:'Petición',width:150,renderCell:({row})=>{const p=(pq.data??[]).find(x=>String(x.id)===String(row.peticionId));return <Tooltip title={p?.asunto??''}><Box component="span">{row.peticionCodigo??p?.codigo??''}</Box></Tooltip>}},
  {field:'nombre',headerName:'Fichero',minWidth:300,flex:1},
  {field:'tipoDocumentoNombre',headerName:'Tipo',width:150},
  {field:'vinculo',headerName:'Horas',width:76,sortable:false,filterable:false,renderCell:({row})=>row.imputacionId?<Tooltip title="Vinculado a una imputación. Ver detalle"><IconButton size="small" color="primary" onClick={()=>setImputacionInfo((iq.data??[]).find(i=>String(i.id)===String(row.imputacionId))??null)}><AppIcon name="link" fontSize="small"/></IconButton></Tooltip>:null},
  {field:'usuarioNombre',headerName:'Usuario',width:140},
  {field:'fechaAlta',headerName:'Fecha alta',width:115,valueFormatter:v=>formatDate(v)}
 ]


 const rows=useMemo(()=>{
  if(desdeFiltro&&hastaFiltro&&dayjs(hastaFiltro).isBefore(dayjs(desdeFiltro),'day'))return []
  const peticiones=new Map((pq.data??[]).map(p=>[String(p.id),p]))
  return (q.data??[]).filter(r=>{
   const p=peticiones.get(String(r.peticionId))
   const categoria=(cq.data??[]).find(c=>String(c.id)===String(p?.categoriaId))
   const subcategoria=(sq.data??[]).find(sc=>String(sc.id)===String(p?.subcategoriaId))
   if(actividadFiltro!=='todas'&&((categoria?.activo??false)!==(actividadFiltro==='activas')||(subcategoria?.activo??false)!==(actividadFiltro==='activas')))return false
   if(categoriasFiltro.length&&(!p||!categoriasFiltro.includes(String(p.categoriaId))))return false
   if(subcategoriasFiltro.length&&(!p||!subcategoriasFiltro.includes(String(p.subcategoriaId))))return false
   if(estadosPeticionSeleccionados.length&&(!p||!estadosPeticionSeleccionados.includes(String(p.estadoId))))return false
   if(peticionesFiltro.length&&!peticionesFiltro.includes(String(r.peticionId)))return false
   if(periodo!=='todas'){
    if(!r.fechaAlta)return false
    if(desdeFiltro&&dayjs(r.fechaAlta).isBefore(dayjs(desdeFiltro),'day'))return false
    if(hastaFiltro&&dayjs(r.fechaAlta).isAfter(dayjs(hastaFiltro),'day'))return false
   }
   return true
  }).map(r=>{
   const p=peticiones.get(String(r.peticionId))
   return {...r,categoriaNombre:(cq.data??[]).find(c=>String(c.id)===String(p?.categoriaId))?.nombre??'',subcategoriaNombre:(sq.data??[]).find(sc=>String(sc.id)===String(p?.subcategoriaId))?.nombre??''}
  })
 },[q.data,pq.data,cq.data,sq.data,actividadFiltro,categoriasFiltro,subcategoriasFiltro,estadosPeticionSeleccionados,peticionesFiltro,periodo,desdeFiltro,hastaFiltro])
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

 function exportar(){
  exportToExcel('documento',exportRowsRef.current,[
   {header:'Categoría',value:r=>{const p=(pq.data??[]).find(x=>String(x.id)===String(r.peticionId));const c=(cq.data??[]).find(x=>String(x.id)===String(p?.categoriaId));return c?`${c.codigo} - ${c.nombre}`:''}},
   {header:'Subcategoría',value:r=>{const p=(pq.data??[]).find(x=>String(x.id)===String(r.peticionId));const sc=(sq.data??[]).find(x=>String(x.id)===String(p?.subcategoriaId));return sc?`${sc.codigo} - ${sc.nombre}`:''}},
   {header:'Petición',value:r=>{const p=(pq.data??[]).find(x=>String(x.id)===String(r.peticionId));return p?`${p.codigo} - ${p.asunto}`:(r.peticionCodigo??'')}},
   {header:'Fichero',value:r=>r.nombre},
   {header:'Tipo documento',value:r=>r.tipoDocumentoNombre??''},
   {header:'Usuario',value:r=>r.usuarioNombre??''},
   {header:'Fecha alta',value:r=>r.fechaAlta??''},
   {header:'Descripción',value:r=>r.descripcion??''},
   {header:'Imputación',value:r=>r.imputacionId??''},
  ])
 }

 const categoriaOpts=(cq.data??[]).filter(c=>c.activo).map(c=>({value:c.id,label:`${c.codigo?`${c.codigo} - `:''}${c.nombre}`}))
 const tipoOpts=(tq.data??[]).filter(t=>t.activo).map(t=>({value:t.id,label:t.nombre}))
 const userOpts=(uq.data??[]).filter(u=>u.activo).map(u=>({value:u.id,label:u.nombre}))
 const createPreset:CrudCreatePreset|undefined=quickState.quickCreate==='documento'&&quickState.peticionId!=null?{
  key:`${location.key}-${quickState.peticionId}-${quickState.imputacionId??''}`,
  values:{categoriaId:quickState.categoriaId??'',subcategoriaId:quickState.subcategoriaId??'',peticionId:quickState.peticionId,imputacionId:quickState.imputacionId??''},
  disabledFields:['categoriaId','subcategoriaId','peticionId'],
 }:undefined

 const filters=<BusinessEntityFiltersWithPetitions
  estado={actividadFiltro} categorias={categoriasFiltro} subcategorias={subcategoriasFiltro} estadosPeticion={estadosPeticionSeleccionados}
  categoriasData={cq.data??[]} subcategoriasData={sq.data??[]} estadosPeticionData={epq.data??[]}
  peticionesData={pq.data??[]} peticiones={peticionesFiltro}
  onEstadoChange={cambiaActividad} onCategoriasChange={cambiaCategorias} onSubcategoriasChange={cambiaSubcategorias}
  onEstadosPeticionChange={cambiaEstadosPeticion} onPeticionesChange={setPeticionesFiltro}
 />
 const rangoInvalido=Boolean(desdeFiltro&&hastaFiltro&&dayjs(hastaFiltro).isBefore(dayjs(desdeFiltro),'day'))
 const secondaryFilters=<DatePeriodFilter period={periodo} desde={desdeFiltro} hasta={hastaFiltro} error={rangoInvalido} onChange={(period,from,to)=>{setPeriodo(period);setDesde(from);setHasta(to)}}/>

 return <>
  <MasterCrudPage<Documento>
   title="Documentos" subtitle="Referencias a ficheros asociados a peticiones" singular="documento"
   rows={rows} loading={q.isLoading} error={q.error} columns={columns} url="/documentos" queryKey="documentos"
   searchFields={['nombre','descripcion','peticionCodigo']} filters={filters} secondaryFilters={secondaryFilters} createPreset={createPreset}
   onClearFilters={()=>{cambiaActividad('activas');setEstadosPeticionFiltro(null);const range=getDateRange('todas');setPeriodo('todas');setDesde(range.desde);setHasta(range.hasta)}}
   iconOnlyCreate onFilteredRowsChange={filtered=>{exportRowsRef.current=filtered}}
   onExport={exportar} exportLabel="Exportar documentos a Excel"
   actionsWidth={230} rowActions={row=><Button size="small" startIcon={<AppIcon name="open" fontSize="small"/>} onClick={async e=>{e.stopPropagation();try{await abrirDocumento(row.id)}catch(err){window.alert(getHttpErrorMessage(err))}}}>Abrir</Button>}
   fields={[
    {name:'categoriaId',label:'Categoría',type:'select',required:true,options:categoriaOpts,onChange:()=>({subcategoriaId:'',peticionId:''})},
    {name:'subcategoriaId',label:'Subcategoría',type:'select',required:true,disabled:form=>!form.categoriaId,options:form=>(sq.data??[]).filter(s=>String(s.categoriaId)===String(form.categoriaId??'')&&s.activo).map(s=>({value:s.id,label:`${s.codigo?`${s.codigo} - `:''}${s.nombre}`})),onChange:()=>({peticionId:''})},
    {name:'peticionId',label:'Petición',type:'select',required:true,disabled:form=>!form.subcategoriaId,options:form=>(pq.data??[]).filter(p=>String(p.categoriaId)===String(form.categoriaId??'')&&String(p.subcategoriaId)===String(form.subcategoriaId??'')&&p.activo).map(p=>({value:p.id,label:`${p.codigo} - ${p.asunto}`}))},
    {name:'tipoDocumentoId',label:'Tipo documento',type:'select',required:true,options:tipoOpts},
    {name:'usuarioId',label:'Usuario',type:'select',required:true,options:userOpts},
    {name:'nombre',label:'Fichero',required:true,fileDrop:true},
    {name:'descripcion',label:'Descripción',expanding:true}
   ]}
   toForm={r=>{const peticion=(pq.data??[]).find(p=>String(p.id)===String(r?.peticionId??''));return {categoriaId:peticion?.categoriaId??'',subcategoriaId:peticion?.subcategoriaId??'',peticionId:r?.peticionId??'',tipoDocumentoId:r?.tipoDocumentoId??'',usuarioId:r?.usuarioId??currentUserId,nombre:r?.nombre??'',descripcion:r?.descripcion??'',imputacionId:r?.imputacionId??quickState.imputacionId??''}}}
   toDuplicateForm={r=>{const peticion=(pq.data??[]).find(p=>String(p.id)===String(r.peticionId??''));return {categoriaId:peticion?.categoriaId??'',subcategoriaId:peticion?.subcategoriaId??'',peticionId:r.peticionId??'',tipoDocumentoId:r.tipoDocumentoId??'',usuarioId:r.usuarioId??currentUserId,nombre:'',descripcion:r.descripcion??'',imputacionId:r.imputacionId??''}}}
   toPayload={f=>({peticionId:Number(f.peticionId),tipoDocumentoId:Number(f.tipoDocumentoId),nombre:f.nombre,descripcion:f.descripcion,usuarioId:Number(f.usuarioId),imputacionId:f.imputacionId===''?null:Number(f.imputacionId)})}
  />
  <ImputacionInfoDrawer open={Boolean(imputacionInfo)} imputacion={imputacionInfo} onClose={()=>setImputacionInfo(null)}/>
 </>
}
