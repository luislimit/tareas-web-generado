import type { GridColDef } from '@mui/x-data-grid'
import { MasterCrudPage } from '../../../components/forms/MasterCrudPage'
import { boolLabel } from '../../../utils/presentation'
import type { Usuario } from '../types/usuario'
import { useUsuarios } from '../hooks/useUsuarios'
import { ActiveStatusChip } from '../../../components/common/ActiveStatusChip'
const columns:GridColDef<Usuario>[]=[{field:'codigo',headerName:'Código',width:150},{field:'nombre',headerName:'Nombre',flex:1,minWidth:190},{field:'email',headerName:'Email',width:250},{field:'activo',headerName:'Estado',width:110,renderCell:p=><ActiveStatusChip active={Boolean(p.value)} activeLabel="Activo" inactiveLabel="Inactivo"/>}]
export function UsuarioPage(){const q=useUsuarios();return <MasterCrudPage<Usuario> adminToolbar title="Usuarios" subtitle="Usuarios responsables de peticiones e imputaciones" singular="usuario" rows={q.data??[]} loading={q.isLoading} error={q.error} columns={columns} url="/usuarios" queryKey="usuarios" searchFields={['codigo','nombre','email']} fields={[{name:'codigo',label:'Código',required:true},{name:'nombre',label:'Nombre',required:true},{name:'email',label:'Email',type:'email'},{name:'activo',label:'Activo',type:'checkbox'}]} toForm={row=>({codigo:row?.codigo??'',nombre:row?.nombre??'',email:row?.email??'',activo:row?.activo??true})} toPayload={f=>({codigo:f.codigo,nombre:f.nombre,email:f.email,activo:f.activo})}/>}
