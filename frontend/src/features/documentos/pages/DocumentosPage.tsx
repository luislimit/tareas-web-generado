import { FormControl, InputLabel, Select, Stack } from '@mui/material'
import type { GridColDef } from '@mui/x-data-grid'
import { useMemo, useState } from 'react'
import { MultiSelectMenuItem } from '../../../components/common/MultiSelectMenuItem'
import { MasterCrudPage } from '../../../components/forms/MasterCrudPage'
import { formatDate } from '../../../utils/presentation'
import { useCategorias } from '../../categorias/hooks/useCategorias'
import { usePeticiones } from '../../peticiones/hooks/usePeticiones'
import { useSubcategorias } from '../../subcategorias/hooks/useSubcategorias'
import { useTiposDocumento } from '../../tiposDocumento/hooks/useTiposDocumento'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'
import { useDocumentos } from '../hooks/useDocumentos'
import { useCurrentUser } from '../../../app/currentUser'
import type { Documento } from '../types/documento'

const columns:GridColDef<Documento>[]=[
 {field:'nombre',headerName:'Nombre',minWidth:220,flex:1},
 {field:'peticionCodigo',headerName:'Petición',width:160},
 {field:'tipoDocumentoNombre',headerName:'Tipo',width:150},
 {field:'ruta',headerName:'Ruta',minWidth:240,flex:1},
 {field:'usuarioNombre',headerName:'Usuario',width:140},
 {field:'fechaAlta',headerName:'Fecha alta',width:115,valueFormatter:v=>formatDate(v)}
]

export function DocumentosPage(){
 const q=useDocumentos(),pq=usePeticiones(),cq=useCategorias(),sq=useSubcategorias(),tq=useTiposDocumento(),uq=useUsuarios()
 const { currentUserId } = useCurrentUser()
 const [categoriasFiltro,setCategoriasFiltro]=useState<string[]>([])
 const [subcategoriasFiltro,setSubcategoriasFiltro]=useState<string[]>([])
 const [peticionesFiltro,setPeticionesFiltro]=useState<string[]>([])

 const subcategoriasDisponibles=useMemo(()=>{
  const all=sq.data??[]
  return categoriasFiltro.length?all.filter(s=>categoriasFiltro.includes(String(s.categoriaId))):all
 },[sq.data,categoriasFiltro])

 const peticionesDisponibles=useMemo(()=>{
  return (pq.data??[]).filter(p=>(!categoriasFiltro.length||categoriasFiltro.includes(String(p.categoriaId)))&&(!subcategoriasFiltro.length||subcategoriasFiltro.includes(String(p.subcategoriaId))))
 },[pq.data,categoriasFiltro,subcategoriasFiltro])

 const rows=useMemo(()=>{
  const peticiones=new Map((pq.data??[]).map(p=>[String(p.id),p]))
  return (q.data??[]).filter(r=>{
   const p=peticiones.get(String(r.peticionId))
   if(categoriasFiltro.length&&(!p||!categoriasFiltro.includes(String(p.categoriaId))))return false
   if(subcategoriasFiltro.length&&(!p||!subcategoriasFiltro.includes(String(p.subcategoriaId))))return false
   if(peticionesFiltro.length&&!peticionesFiltro.includes(String(r.peticionId)))return false
   return true
  })
 },[q.data,pq.data,categoriasFiltro,subcategoriasFiltro,peticionesFiltro])

 function cambiaCategorias(values:string[]){
  setCategoriasFiltro(values)
  setSubcategoriasFiltro(prev=>prev.filter(v=>(sq.data??[]).some(s=>String(s.id)===v&&(!values.length||values.includes(String(s.categoriaId))))))
  setPeticionesFiltro(prev=>prev.filter(v=>(pq.data??[]).some(p=>String(p.id)===v&&(!values.length||values.includes(String(p.categoriaId))))))
 }
 function cambiaSubcategorias(values:string[]){
  setSubcategoriasFiltro(values)
  setPeticionesFiltro(prev=>prev.filter(v=>(pq.data??[]).some(p=>String(p.id)===v&&(!categoriasFiltro.length||categoriasFiltro.includes(String(p.categoriaId)))&&(!values.length||values.includes(String(p.subcategoriaId))))))
 }

 const categoriaOpts=(cq.data??[]).map(c=>({value:c.id,label:`${c.codigo?`${c.codigo} - `:''}${c.nombre}`}))
 const tipoOpts=(tq.data??[]).map(t=>({value:t.id,label:t.nombre}))
 const userOpts=(uq.data??[]).map(u=>({value:u.id,label:u.nombre}))

 const filters=<Stack direction="row" spacing={1} sx={{mb:1.5}} alignItems="center" flexWrap="wrap" useFlexGap>
  <FormControl size="small" sx={{minWidth:210}}><InputLabel>Categorías</InputLabel><Select multiple label="Categorías" value={categoriasFiltro} onChange={e=>cambiaCategorias(typeof e.target.value==='string'?e.target.value.split(','):e.target.value)}>{(cq.data??[]).map(c=><MultiSelectMenuItem key={c.id} value={String(c.id)} selected={categoriasFiltro.includes(String(c.id))}>{c.codigo?`${c.codigo} - `:''}{c.nombre}</MultiSelectMenuItem>)}</Select></FormControl>
  <FormControl size="small" sx={{minWidth:210}}><InputLabel>Subcategorías</InputLabel><Select multiple label="Subcategorías" value={subcategoriasFiltro} onChange={e=>cambiaSubcategorias(typeof e.target.value==='string'?e.target.value.split(','):e.target.value)}>{subcategoriasDisponibles.map(s=><MultiSelectMenuItem key={s.id} value={String(s.id)} selected={subcategoriasFiltro.includes(String(s.id))}>{s.codigo?`${s.codigo} - `:''}{s.nombre}</MultiSelectMenuItem>)}</Select></FormControl>
  <FormControl size="small" sx={{minWidth:260}}><InputLabel>Peticiones</InputLabel><Select multiple label="Peticiones" value={peticionesFiltro} onChange={e=>setPeticionesFiltro(typeof e.target.value==='string'?e.target.value.split(','):e.target.value)}>{peticionesDisponibles.map(p=><MultiSelectMenuItem key={p.id} value={String(p.id)} selected={peticionesFiltro.includes(String(p.id))}>{p.codigo} - {p.asunto}</MultiSelectMenuItem>)}</Select></FormControl>
 </Stack>

 return <MasterCrudPage<Documento>
  title="Documentos" subtitle="Referencias a ficheros asociados a peticiones" singular="documento"
  rows={rows} loading={q.isLoading} error={q.error} columns={columns} url="/documentos" queryKey="documentos"
  searchFields={['nombre','ruta','descripcion','peticionCodigo']} filters={filters}
  fields={[
   {name:'categoriaId',label:'Categoría',type:'select',required:true,options:categoriaOpts,onChange:()=>({subcategoriaId:'',peticionId:''})},
   {name:'subcategoriaId',label:'Subcategoría',type:'select',required:true,disabled:form=>!form.categoriaId,options:form=>(sq.data??[]).filter(s=>String(s.categoriaId)===String(form.categoriaId??'')).map(s=>({value:s.id,label:`${s.codigo?`${s.codigo} - `:''}${s.nombre}`})),onChange:()=>({peticionId:''})},
   {name:'peticionId',label:'Petición',type:'select',required:true,disabled:form=>!form.subcategoriaId,options:form=>(pq.data??[]).filter(p=>String(p.categoriaId)===String(form.categoriaId??'')&&String(p.subcategoriaId)===String(form.subcategoriaId??'')).map(p=>({value:p.id,label:`${p.codigo} - ${p.asunto}`}))},
   {name:'tipoDocumentoId',label:'Tipo documento',type:'select',required:true,options:tipoOpts},
   {name:'usuarioId',label:'Usuario',type:'select',required:true,options:userOpts},
   {name:'nombre',label:'Nombre',required:true},
   {name:'ruta',label:'Ruta',required:true},
   {name:'descripcion',label:'Descripción'}
  ]}
  toForm={r=>{
   const peticion=(pq.data??[]).find(p=>String(p.id)===String(r?.peticionId??''))
   return {categoriaId:peticion?.categoriaId??'',subcategoriaId:peticion?.subcategoriaId??'',peticionId:r?.peticionId??'',tipoDocumentoId:r?.tipoDocumentoId??'',usuarioId:r?.usuarioId??currentUserId,nombre:r?.nombre??'',ruta:r?.ruta??'',descripcion:r?.descripcion??''}
  }}
  toPayload={f=>({peticionId:Number(f.peticionId),tipoDocumentoId:Number(f.tipoDocumentoId),nombre:f.nombre,ruta:f.ruta,descripcion:f.descripcion,usuarioId:Number(f.usuarioId)})}
 />
}
