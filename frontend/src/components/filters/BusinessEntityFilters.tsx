import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useMemo } from 'react'
import { MultiSelectMenuItem } from '../common/MultiSelectMenuItem'
import type { Categoria } from '../../features/categorias/types/categoria'
import type { Subcategoria } from '../../features/subcategorias/types/subcategoria'
import type { Estado } from '../../features/estados/types/estado'
import type { Peticion } from '../../features/peticiones/types/peticion'

export type EstadoActividadFiltro = 'activas'|'inactivas'|'todas'

export interface BusinessFilterValues {
  estado: EstadoActividadFiltro
  categorias: string[]
  subcategorias: string[]
  estadosPeticion: string[]
}

interface BaseProps extends BusinessFilterValues {
  categoriasData: Categoria[]
  subcategoriasData: Subcategoria[]
  estadosPeticionData: Estado[]
  onEstadoChange: (value:EstadoActividadFiltro)=>void
  onCategoriasChange: (values:string[])=>void
  onSubcategoriasChange: (values:string[])=>void
  onEstadosPeticionChange: (values:string[])=>void
}

function valuesOf(value:string|string[]):string[]{ return typeof value==='string'?value.split(','):value }

export function BusinessEntityFilters(props:BaseProps){
 const categoriasDisponibles=useMemo(()=>props.categoriasData.filter(c=>props.estado==='todas'||c.activo===(props.estado==='activas')),[props.categoriasData,props.estado])
 const subcategoriasDisponibles=useMemo(()=>props.subcategoriasData.filter(s=>(props.estado==='todas'||s.activo===(props.estado==='activas'))&&(!props.categorias.length||props.categorias.includes(String(s.categoriaId)))),[props.subcategoriasData,props.estado,props.categorias])
 return <>
  <FormControl size="small" sx={{minWidth:150}}><InputLabel>Estado</InputLabel><Select label="Estado" value={props.estado} onChange={e=>props.onEstadoChange(e.target.value as EstadoActividadFiltro)}><MenuItem value="activas">Activas</MenuItem><MenuItem value="inactivas">Inactivas</MenuItem><MenuItem value="todas">Todas</MenuItem></Select></FormControl>
  <FormControl size="small" sx={{minWidth:210}}><InputLabel>Categorías</InputLabel><Select multiple label="Categorías" value={props.categorias} onChange={e=>props.onCategoriasChange(valuesOf(e.target.value))}>{categoriasDisponibles.map(c=><MultiSelectMenuItem key={c.id} value={String(c.id)} selected={props.categorias.includes(String(c.id))}>{c.codigo?`${c.codigo} - `:''}{c.nombre}</MultiSelectMenuItem>)}</Select></FormControl>
  <FormControl size="small" sx={{minWidth:210}}><InputLabel>Subcategorías</InputLabel><Select multiple label="Subcategorías" value={props.subcategorias} onChange={e=>props.onSubcategoriasChange(valuesOf(e.target.value))}>{subcategoriasDisponibles.map(s=><MultiSelectMenuItem key={s.id} value={String(s.id)} selected={props.subcategorias.includes(String(s.id))}>{s.codigo?`${s.codigo} - `:''}{s.nombre}</MultiSelectMenuItem>)}</Select></FormControl>
  <FormControl size="small" sx={{minWidth:220}}><InputLabel>Estados Petición</InputLabel><Select multiple label="Estados Petición" value={props.estadosPeticion} onChange={e=>props.onEstadosPeticionChange(valuesOf(e.target.value))}>{props.estadosPeticionData.map(e=><MultiSelectMenuItem key={e.id} value={String(e.id)} selected={props.estadosPeticion.includes(String(e.id))}>{e.nombre}</MultiSelectMenuItem>)}</Select></FormControl>
 </>
}

interface WithPetitionsProps extends BaseProps {
  peticionesData: Peticion[]
  peticiones: string[]
  onPeticionesChange:(values:string[])=>void
}

export function BusinessEntityFiltersWithPetitions(props:WithPetitionsProps){
 const peticionesDisponibles=useMemo(()=>props.peticionesData.filter(p=>{
  const c=props.categoriasData.find(x=>String(x.id)===String(p.categoriaId))
  const s=props.subcategoriasData.find(x=>String(x.id)===String(p.subcategoriaId))
  if(props.estado!=='todas'&&((c?.activo??false)!==(props.estado==='activas')||(s?.activo??false)!==(props.estado==='activas'))) return false
  return (!props.categorias.length||props.categorias.includes(String(p.categoriaId)))&&(!props.subcategorias.length||props.subcategorias.includes(String(p.subcategoriaId)))&&(!props.estadosPeticion.length||props.estadosPeticion.includes(String(p.estadoId)))
 }),[props.peticionesData,props.categoriasData,props.subcategoriasData,props.estado,props.categorias,props.subcategorias,props.estadosPeticion])
 return <>
  <BusinessEntityFilters {...props}/>
  <FormControl size="small" sx={{minWidth:260}}><InputLabel>Peticiones</InputLabel><Select multiple label="Peticiones" value={props.peticiones} onChange={e=>props.onPeticionesChange(valuesOf(e.target.value))}>{peticionesDisponibles.map(p=><MultiSelectMenuItem key={p.id} value={String(p.id)} selected={props.peticiones.includes(String(p.id))}>{p.codigo} - {p.asunto}</MultiSelectMenuItem>)}</Select></FormControl>
 </>
}
