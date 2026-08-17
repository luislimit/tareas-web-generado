import { Box, Divider, Stack, Typography } from '@mui/material'
import { EntityDrawer } from '../../../components/common/EntityDrawer'
import { formatDate, formatHours } from '../../../utils/presentation'
import type { Imputacion } from '../types/imputacion'

export function ImputacionInfoDrawer({open,imputacion,onClose}:{open:boolean;imputacion:Imputacion|null;onClose:()=>void}){
 return <EntityDrawer open={open} title={imputacion?`Imputación · ${imputacion.peticionCodigo??imputacion.peticionId}`:'Imputación'} saveLabel="Cerrar" onClose={onClose} onSave={onClose}>
  {!imputacion?<Typography color="text.secondary">No se ha encontrado la imputación vinculada.</Typography>:<Stack spacing={1.25}>
   <Box><Typography variant="caption" color="text.secondary">Fecha</Typography><Typography>{formatDate(imputacion.fecha)}</Typography></Box>
   <Box><Typography variant="caption" color="text.secondary">Horas</Typography><Typography fontWeight={700}>{formatHours(imputacion.horas)}{imputacion.extra?' · Extra':''}</Typography></Box>
   <Divider/>
   <Box><Typography variant="caption" color="text.secondary">Tipo de horas</Typography><Typography>{imputacion.tipoHoraNombre||'—'}</Typography></Box>
   <Box><Typography variant="caption" color="text.secondary">Estado horas</Typography><Typography>{imputacion.estadoHorasNombre||'—'}</Typography></Box>
   <Box><Typography variant="caption" color="text.secondary">Usuario</Typography><Typography>{imputacion.usuarioNombre||'—'}</Typography></Box>
   <Box><Typography variant="caption" color="text.secondary">Descripción</Typography><Typography sx={{whiteSpace:'pre-wrap'}}>{imputacion.descripcion||'—'}</Typography></Box>
  </Stack>}
 </EntityDrawer>
}
