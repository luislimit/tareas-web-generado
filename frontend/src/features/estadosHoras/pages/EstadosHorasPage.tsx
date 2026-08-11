import type { GridColDef } from '@mui/x-data-grid'
import { StateChip } from '../../../components/common/StateChip'
import { MasterCrudPage } from '../../../components/forms/MasterCrudPage'
import { boolLabel } from '../../../utils/presentation'
import type { EstadoHoras } from '../types/estadoHoras'
import { useEstadosHoras } from '../hooks/useEstadosHoras'

const columns:GridColDef<EstadoHoras>[]=[
 {field:'codigo',headerName:'Código',width:130},
 {field:'nombre',headerName:'Nombre',flex:1,minWidth:190},
 {field:'color',headerName:'Color',width:150,renderCell:({row})=><StateChip label={row.nombre} color={row.color}/>},
 {field:'orden',headerName:'Orden',width:85},
 {field:'estadoFinal',headerName:'Final',width:90,valueFormatter:v=>boolLabel(v)},
 {field:'activo',headerName:'Estado',width:110,valueFormatter:v=>boolLabel(v,'Activo','Inactivo')}
]

export function EstadosHorasPage(){
 const q=useEstadosHoras()
 return <MasterCrudPage<EstadoHoras>
  title="Estados horas" subtitle="Ciclo administrativo de las imputaciones" singular="estado de horas"
  rows={q.data??[]} loading={q.isLoading} error={q.error} columns={columns}
  url="/estados-horas" queryKey="estados-horas" searchFields={['codigo','nombre']}
  fields={[
   {name:'codigo',label:'Código',required:true},
   {name:'nombre',label:'Nombre',required:true},
   {name:'color',label:'Color',type:'color'},
   {name:'orden',label:'Orden',type:'number'},
   {name:'activo',label:'Activo',type:'checkbox'},
   {name:'estadoFinal',label:'Estado final',type:'checkbox'}
  ]}
  toForm={row=>({codigo:row?.codigo??'',nombre:row?.nombre??'',color:row?.color??'#64748b',orden:row?.orden??0,activo:row?.activo??true,estadoFinal:row?.estadoFinal??false})}
  toPayload={f=>({codigo:f.codigo,nombre:f.nombre,color:f.color,orden:f.orden,activo:f.activo,estadoFinal:f.estadoFinal})}
 />
}
