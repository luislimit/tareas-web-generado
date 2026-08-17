import type { GridColDef } from '@mui/x-data-grid'
import { ActiveStatusChip } from '../../../components/common/ActiveStatusChip'
import { MasterCrudPage } from '../../../components/forms/MasterCrudPage'
import { useEstados } from '../../estados/hooks/useEstados'
import { useTiposHora } from '../hooks/useTiposHora'
import type { TipoHora } from '../types/tipoHora'

const columns:GridColDef<TipoHora>[]=[
 {field:'codigo',headerName:'Código',width:130},
 {field:'nombre',headerName:'Nombre',flex:1,minWidth:210},
 {field:'estadoPeticionNombre',headerName:'Estado petición al imputar',minWidth:220,flex:1,valueFormatter:v=>v||'— Sin cambio —'},
 {field:'orden',headerName:'Orden',width:90},
 {field:'activo',headerName:'Estado',width:110,renderCell:p=><ActiveStatusChip active={Boolean(p.value)} activeLabel="Activo" inactiveLabel="Inactivo"/>}
]

export function TiposHoraPage(){
 const q=useTiposHora(),eq=useEstados()
 return <MasterCrudPage<TipoHora>
  adminToolbar title="Tipos de horas" subtitle="Clasificación de las horas y estado opcional que aplican a la petición" singular="tipo de hora"
  rows={q.data??[]} loading={q.isLoading} error={q.error} columns={columns}
  url="/tipos-hora" queryKey="tipos-hora" searchFields={['codigo','nombre','estadoPeticionNombre']}
  fields={[
   {name:'codigo',label:'Código',required:true},
   {name:'nombre',label:'Nombre',required:true},
   {name:'estadoPeticionId',label:'Estado petición al imputar',type:'select',options:form=>{
     const actual=String(form.estadoPeticionId??'');
     return [{value:'',label:'— No cambiar estado —'},...(eq.data??[]).filter(e=>e.activo||String(e.id)===actual).map(e=>({value:e.id,label:e.nombre}))]
   }},
   {name:'orden',label:'Orden',type:'number'},
   {name:'activo',label:'Activo',type:'checkbox'}
  ]}
  toForm={r=>({codigo:r?.codigo??'',nombre:r?.nombre??'',estadoPeticionId:r?.estadoPeticionId??'',orden:r?.orden??0,activo:r?.activo??true})}
  toPayload={f=>({codigo:f.codigo,nombre:f.nombre,estadoPeticionId:f.estadoPeticionId===''?null:Number(f.estadoPeticionId),orden:Number(f.orden),activo:Boolean(f.activo)})}
 />
}
