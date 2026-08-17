import type { GridColDef } from '@mui/x-data-grid'
import { MasterCrudPage } from '../../../components/forms/MasterCrudPage'
import { formatDate } from '../../../utils/presentation'
import type { Categoria } from '../types/categoria'
import { useCategorias } from '../hooks/useCategorias'
import { ActiveStatusChip } from '../../../components/common/ActiveStatusChip'

const columns: GridColDef<Categoria>[]=[{field:'codigo',headerName:'Código',width:140},{field:'nombre',headerName:'Nombre',flex:1,minWidth:220},{field:'fechaAlta',headerName:'Fecha alta',width:130,valueFormatter:value=>formatDate(value)},{field:'activo',headerName:'Estado',width:120,renderCell:p=><ActiveStatusChip active={Boolean(p.value)} activeLabel="Activa" inactiveLabel="Inactiva"/>}]
export function CategoriasPage(){const q=useCategorias();return <MasterCrudPage<Categoria> adminToolbar title="Categorías" subtitle="Clasificación principal de las peticiones" singular="categoría" rows={q.data??[]} loading={q.isLoading} error={q.error} columns={columns} url="/categorias" queryKey="categorias" searchFields={['codigo','nombre']} fields={[{name:'codigo',label:'Código',required:true},{name:'nombre',label:'Nombre',required:true},{name:'activo',label:'Activa',type:'checkbox'}]} toForm={row=>({codigo:row?.codigo??'',nombre:row?.nombre??'',activo:row?.activo??true})} toPayload={f=>({codigo:f.codigo,nombre:f.nombre,activo:f.activo})}/> }
