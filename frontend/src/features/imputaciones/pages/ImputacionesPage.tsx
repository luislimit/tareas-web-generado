import { Alert, Box, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { MultiSelectMenuItem } from '../../../components/common/MultiSelectMenuItem'
import { StateChip } from '../../../components/common/StateChip'
import { MasterCrudPage } from '../../../components/forms/MasterCrudPage'
import { boolLabel, formatDate, formatHours } from '../../../utils/presentation'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { useEstadosHoras } from '../../estadosHoras/hooks/useEstadosHoras'
import { usePeticiones } from '../../peticiones/hooks/usePeticiones'
import { useSubcategorias } from '../../subcategorias/hooks/useSubcategorias'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'
import { useImputaciones } from '../hooks/useImputaciones'
import { useCurrentUser } from '../../../app/currentUser'
import type { Imputacion } from '../types/imputacion'

type PeriodoFiltro = 'semana-pasada'|'mes-pasado'|'hoy'|'esta-semana'|'este-mes'|'este-ano'|'periodo'

function fechasPeriodo(periodo:PeriodoFiltro):{desde:string;hasta:string}|null{
 const hoy=dayjs()
 const fmt=(d:dayjs.Dayjs)=>d.format('YYYY-MM-DD')
 const lunes=hoy.subtract((hoy.day()+6)%7,'day')
 switch(periodo){
  case 'semana-pasada': return {desde:fmt(lunes.subtract(7,'day')),hasta:fmt(lunes.subtract(1,'day'))}
  case 'mes-pasado': {const mes=hoy.subtract(1,'month');return {desde:fmt(mes.startOf('month')),hasta:fmt(mes.endOf('month'))}}
  case 'hoy': return {desde:fmt(hoy),hasta:fmt(hoy)}
  case 'esta-semana': return {desde:fmt(lunes),hasta:fmt(lunes.add(6,'day'))}
  case 'este-mes': return {desde:fmt(hoy.startOf('month')),hasta:fmt(hoy.endOf('month'))}
  case 'este-ano': return {desde:fmt(hoy.startOf('year')),hasta:fmt(hoy.endOf('year'))}
  case 'periodo': return null
 }
}

const inicial=fechasPeriodo('hoy')!

export function ImputacionesPage(){
 const q=useImputaciones(),pq=usePeticiones(),cq=useCategorias(),sq=useSubcategorias(),uq=useUsuarios(),eq=useEstadosHoras()
 const { currentUserId } = useCurrentUser()
 const [categoriasFiltro,setCategoriasFiltro]=useState<string[]>([])
 const [subcategoriasFiltro,setSubcategoriasFiltro]=useState<string[]>([])
 const [peticionesFiltro,setPeticionesFiltro]=useState<string[]>([])
 const [periodo,setPeriodo]=useState<PeriodoFiltro>('hoy')
 const [desde,setDesde]=useState(inicial.desde)
 const [hasta,setHasta]=useState(inicial.hasta)

 const columns:GridColDef<Imputacion>[]=[
  {field:'fecha',headerName:'Fecha',width:115,valueFormatter:v=>formatDate(v)},
  {field:'peticionCodigo',headerName:'Petición',width:140},
  {field:'usuarioNombre',headerName:'Usuario',width:150},
  {field:'horas',headerName:'Horas',width:90,valueFormatter:formatHours},
  {field:'extra',headerName:'Extra',width:80,valueFormatter:v=>boolLabel(v)},
  {field:'estadoHorasNombre',headerName:'Estado horas',width:155,renderCell:({row})=>{const estado=(eq.data??[]).find(e=>String(e.id)===String(row.estadoHorasId));return <StateChip label={row.estadoHorasNombre} color={estado?.color}/>}},
  {field:'descripcion',headerName:'Descripción',flex:1,minWidth:220}
 ]

 const subcategoriasDisponibles=useMemo(()=>{
  const all=sq.data??[]
  return categoriasFiltro.length?all.filter(s=>categoriasFiltro.includes(String(s.categoriaId))):all
 },[sq.data,categoriasFiltro])

 const peticionesDisponibles=useMemo(()=>{
  return (pq.data??[]).filter(p=>(!categoriasFiltro.length||categoriasFiltro.includes(String(p.categoriaId)))&&(!subcategoriasFiltro.length||subcategoriasFiltro.includes(String(p.subcategoriaId))))
 },[pq.data,categoriasFiltro,subcategoriasFiltro])

 const rangoInvalido=Boolean(desde&&hasta&&dayjs(hasta).isBefore(dayjs(desde),'day'))
 const rows=useMemo(()=>{
  if(rangoInvalido)return []
  const peticiones=new Map((pq.data??[]).map(p=>[String(p.id),p]))
  return (q.data??[]).filter(r=>{
   const p=peticiones.get(String(r.peticionId))
   if(categoriasFiltro.length&&(!p||!categoriasFiltro.includes(String(p.categoriaId))))return false
   if(subcategoriasFiltro.length&&(!p||!subcategoriasFiltro.includes(String(p.subcategoriaId))))return false
   if(peticionesFiltro.length&&!peticionesFiltro.includes(String(r.peticionId)))return false
   if(desde&&dayjs(r.fecha).isBefore(dayjs(desde),'day'))return false
   if(hasta&&dayjs(r.fecha).isAfter(dayjs(hasta),'day'))return false
   return true
  })
 },[q.data,pq.data,categoriasFiltro,subcategoriasFiltro,peticionesFiltro,desde,hasta,rangoInvalido])


 function cambiaCategorias(values:string[]){
  setCategoriasFiltro(values)
  setSubcategoriasFiltro(prev=>prev.filter(v=>(sq.data??[]).some(s=>String(s.id)===v&&(!values.length||values.includes(String(s.categoriaId))))))
  setPeticionesFiltro(prev=>prev.filter(v=>(pq.data??[]).some(p=>String(p.id)===v&&(!values.length||values.includes(String(p.categoriaId))))))
 }
 function cambiaSubcategorias(values:string[]){
  setSubcategoriasFiltro(values)
  setPeticionesFiltro(prev=>prev.filter(v=>(pq.data??[]).some(p=>String(p.id)===v&&(!categoriasFiltro.length||categoriasFiltro.includes(String(p.categoriaId)))&&(!values.length||values.includes(String(p.subcategoriaId))))))
 }
 function cambiaPeriodo(value:PeriodoFiltro){
  setPeriodo(value)
  const fechas=fechasPeriodo(value)
  if(fechas){setDesde(fechas.desde);setHasta(fechas.hasta)}
 }

 const categoriaOpts=(cq.data??[]).map(c=>({value:c.id,label:`${c.codigo?`${c.codigo} - `:''}${c.nombre}`}))
 const userOpts=(uq.data??[]).map(u=>({value:u.id,label:u.nombre}))
 const estadoOpts=(eq.data??[]).map(e=>({value:e.id,label:e.nombre}))
 const filters=<>
  <Stack direction="row" spacing={1} sx={{mb:1.5}} alignItems="center" flexWrap="wrap" useFlexGap>
   <FormControl size="small" sx={{minWidth:210}}><InputLabel>Categorías</InputLabel><Select multiple label="Categorías" value={categoriasFiltro} onChange={e=>cambiaCategorias(typeof e.target.value==='string'?e.target.value.split(','):e.target.value)}>{(cq.data??[]).map(c=><MultiSelectMenuItem key={c.id} value={String(c.id)} selected={categoriasFiltro.includes(String(c.id))}>{c.codigo?`${c.codigo} - `:''}{c.nombre}</MultiSelectMenuItem>)}</Select></FormControl>
   <FormControl size="small" sx={{minWidth:210}}><InputLabel>Subcategorías</InputLabel><Select multiple label="Subcategorías" value={subcategoriasFiltro} onChange={e=>cambiaSubcategorias(typeof e.target.value==='string'?e.target.value.split(','):e.target.value)}>{subcategoriasDisponibles.map(s=><MultiSelectMenuItem key={s.id} value={String(s.id)} selected={subcategoriasFiltro.includes(String(s.id))}>{s.codigo?`${s.codigo} - `:''}{s.nombre}</MultiSelectMenuItem>)}</Select></FormControl>
   <FormControl size="small" sx={{minWidth:250}}><InputLabel>Peticiones</InputLabel><Select multiple label="Peticiones" value={peticionesFiltro} onChange={e=>setPeticionesFiltro(typeof e.target.value==='string'?e.target.value.split(','):e.target.value)}>{peticionesDisponibles.map(p=><MultiSelectMenuItem key={p.id} value={String(p.id)} selected={peticionesFiltro.includes(String(p.id))}>{p.codigo} - {p.asunto}</MultiSelectMenuItem>)}</Select></FormControl>
   <FormControl size="small" sx={{minWidth:170}}><InputLabel>Periodo</InputLabel><Select label="Periodo" value={periodo} onChange={e=>cambiaPeriodo(e.target.value as PeriodoFiltro)}><MenuItem value="semana-pasada">Semana pasada</MenuItem><MenuItem value="mes-pasado">Mes pasado</MenuItem><MenuItem value="hoy">Hoy</MenuItem><MenuItem value="esta-semana">Esta semana</MenuItem><MenuItem value="este-mes">Este mes</MenuItem><MenuItem value="este-ano">Este año</MenuItem><MenuItem value="periodo">Por periodo</MenuItem></Select></FormControl>
   <TextField size="small" type="date" label="Fecha desde" slotProps={{inputLabel:{shrink:true}}} disabled={periodo!=='periodo'} value={desde} onChange={e=>setDesde(e.target.value)} error={rangoInvalido}/>
   <TextField size="small" type="date" label="Fecha hasta" slotProps={{inputLabel:{shrink:true}}} disabled={periodo!=='periodo'} value={hasta} onChange={e=>setHasta(e.target.value)} error={rangoInvalido}/>
  </Stack>
  {rangoInvalido&&<Alert severity="error" sx={{mb:1.5}}>La fecha hasta debe ser mayor o igual que la fecha desde.</Alert>}
 </>

 return <MasterCrudPage<Imputacion>
  title="Imputaciones" subtitle="Registro rápido de horas realizadas" singular="imputación"
  rows={rows} loading={q.isLoading} error={q.error} columns={columns} url="/imputaciones" queryKey="imputaciones"
  searchFields={['peticionCodigo','descripcion']} filters={filters}
  tableSummary={visibleRows=>{const total=visibleRows.reduce((sum,row)=>{const horas=Number(row.horas);return sum+(Number.isFinite(horas)?horas:0)},0);return <Box sx={{display:'flex',justifyContent:'flex-end'}}><Typography variant="body2" fontWeight={700}>Horas mostradas: {formatHours(total)}</Typography></Box>}}
  fields={[
   {name:'categoriaId',label:'Categoría',type:'select',required:true,options:categoriaOpts,onChange:()=>({subcategoriaId:'',peticionId:''})},
   {name:'subcategoriaId',label:'Subcategoría',type:'select',required:true,disabled:form=>!form.categoriaId,options:form=>(sq.data??[]).filter(s=>String(s.categoriaId)===String(form.categoriaId??'')).map(s=>({value:s.id,label:`${s.codigo?`${s.codigo} - `:''}${s.nombre}`})),onChange:()=>({peticionId:''})},
   {name:'peticionId',label:'Petición',type:'select',required:true,disabled:form=>!form.subcategoriaId,options:form=>(pq.data??[]).filter(p=>String(p.categoriaId)===String(form.categoriaId??'')&&String(p.subcategoriaId)===String(form.subcategoriaId??'')).map(p=>({value:p.id,label:`${p.codigo} - ${p.asunto}`}))},
   {name:'usuarioId',label:'Usuario',type:'select',required:true,options:userOpts},
   {name:'fecha',label:'Fecha',type:'date',required:true},
   {name:'horas',label:'Horas',type:'number',required:true},
   {name:'extra',label:'Extra',type:'checkbox'},
   {name:'estadoHorasId',label:'Estado horas',type:'select',required:true,options:estadoOpts},
   {name:'descripcion',label:'Descripción'}
  ]}
  toForm={r=>{
   const peticion=(pq.data??[]).find(p=>String(p.id)===String(r?.peticionId??''))
   return {categoriaId:peticion?.categoriaId??'',subcategoriaId:peticion?.subcategoriaId??'',peticionId:r?.peticionId??'',usuarioId:r?.usuarioId??currentUserId,fecha:r?.fecha??dayjs().format('YYYY-MM-DD'),horas:r?.horas??0,extra:r?.extra??false,estadoHorasId:r?.estadoHorasId??'',descripcion:r?.descripcion??''}
  }}
  toPayload={f=>({peticionId:Number(f.peticionId),usuarioId:Number(f.usuarioId),fecha:f.fecha,horas:Number(f.horas),extra:Boolean(f.extra),estadoHorasId:Number(f.estadoHorasId),descripcion:f.descripcion})}
 />
}
