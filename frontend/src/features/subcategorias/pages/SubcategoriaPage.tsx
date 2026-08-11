import type { GridColDef } from '@mui/x-data-grid'
import { MasterCrudPage } from '../../../components/forms/MasterCrudPage'
import { boolLabel, textOf } from '../../../utils/presentation'
import type { Subcategoria } from '../types/subcategoria'
import { useSubcategorias } from '../hooks/useSubcategorias'
import { useCategorias } from '../../categorias/hooks/useCategorias'

const columns: GridColDef<Subcategoria>[]=[{field:'codigo',headerName:'Código',width:130},{field:'nombre',headerName:'Nombre',flex:1,minWidth:200},{field:'categoria',headerName:'Categoría',width:190,valueGetter:(_v,r)=>r.categoriaNombre||textOf(r.categoria)},{field:'activo',headerName:'Estado',width:110,valueFormatter:v=>boolLabel(v,'Activa','Inactiva')}]
export function SubcategoriaPage(){const q=useSubcategorias(),cq=useCategorias();const opts=(cq.data??[]).map(c=>({value:c.id,label:`${c.codigo} - ${c.nombre}`}));return <MasterCrudPage<Subcategoria> title="Subcategorías" subtitle="Clasificación dependiente de una categoría" singular="subcategoría" rows={q.data??[]} loading={q.isLoading} error={q.error} columns={columns} url="/subcategorias" queryKey="subcategorias" searchFields={['codigo','nombre']} fields={[{name:'categoriaId',label:'Categoría',type:'select',required:true,options:opts},{name:'codigo',label:'Código',required:true},{name:'nombre',label:'Nombre',required:true},{name:'activo',label:'Activa',type:'checkbox'}]} toForm={row=>({categoriaId:(row as any)?.categoriaId??(row?.categoria as any)?.id??'',codigo:row?.codigo??'',nombre:row?.nombre??'',activo:row?.activo??true})} toPayload={f=>({categoriaId:Number(f.categoriaId),codigo:f.codigo,nombre:f.nombre,activo:f.activo})}/> }
