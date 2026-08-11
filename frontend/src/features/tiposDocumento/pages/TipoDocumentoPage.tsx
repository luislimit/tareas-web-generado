import type { GridColDef } from '@mui/x-data-grid'
import { MasterCrudPage } from '../../../components/forms/MasterCrudPage'
import { boolLabel, textOf } from '../../../utils/presentation'
import type { TipoDocumento } from '../types/tipoDocumento'
import { useTiposDocumento } from '../hooks/useTiposDocumento'

const columns: GridColDef<TipoDocumento>[]=[{field:'nombre',headerName:'Nombre',flex:1,minWidth:220},{field:'orden',headerName:'Orden',width:90},{field:'activo',headerName:'Estado',width:110,valueFormatter:v=>boolLabel(v,'Activo','Inactivo')}]
export function TipoDocumentoPage(){const q=useTiposDocumento();return <MasterCrudPage<TipoDocumento> title="Tipos de documento" subtitle="Clasificación de los documentos asociados" singular="tipo de documento" rows={q.data??[]} loading={q.isLoading} error={q.error} columns={columns} url="/tipos-documento" queryKey="tipos-documento" searchFields={['nombre']} fields={[{name:'nombre',label:'Nombre',required:true},{name:'orden',label:'Orden',type:'number'},{name:'activo',label:'Activo',type:'checkbox'}]} toForm={row=>({nombre:row?.nombre??'',orden:row?.orden??0,activo:row?.activo??true})} toPayload={f=>({nombre:f.nombre,orden:f.orden,activo:f.activo})}/> }
