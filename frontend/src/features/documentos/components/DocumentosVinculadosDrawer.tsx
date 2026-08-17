import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { getHttpErrorMessage } from '../../../api/httpError'
import { useResourceMutations } from '../../../api/useResourceMutations'
import { useCurrentUser } from '../../../app/currentUser'
import { AppIcon } from '../../../components/common/AppIcon'
import { EntityDrawer } from '../../../components/common/EntityDrawer'
import { ExpandingTextField } from '../../../components/forms/ExpandingTextField'
import { useTiposDocumento } from '../../tiposDocumento/hooks/useTiposDocumento'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'
import { useDocumentos } from '../hooks/useDocumentos'
import type { Documento } from '../types/documento'

export interface DocumentosVinculadosTarget {
  peticionId: number | string
  peticionCodigo?: string
  usuarioId?: number | string
  imputacionId?: number | string | null
}

interface Props {
  open: boolean
  target: DocumentosVinculadosTarget | null
  onClose: () => void
}

export function DocumentosVinculadosDrawer({ open, target, onClose }: Props) {
  const dq = useDocumentos()
  const tdq = useTiposDocumento()
  const uq = useUsuarios()
  const { currentUserId } = useCurrentUser()
  const documentoMutations = useResourceMutations<Documento, Record<string, unknown>>('/documentos', 'documentos')
  const [nuevoDocOpen, setNuevoDocOpen] = useState(false)
  const [nuevoDoc, setNuevoDoc] = useState({ tipoDocumentoId: '', usuarioId: '', nombre: '', descripcion: '' })

  const esImputacion = target?.imputacionId != null
  const documentosPeticion = (dq.data ?? []).filter(d => target && String(d.peticionId) === String(target.peticionId))
  const documentosVinculados = esImputacion
    ? documentosPeticion.filter(d => String(d.imputacionId) === String(target?.imputacionId))
    : documentosPeticion
  const documentosSinVincular = esImputacion
    ? documentosPeticion.filter(d => !d.imputacionId)
    : []

  const error = documentoMutations.updateMutation.error || documentoMutations.deleteMutation.error || documentoMutations.createMutation.error

  const abrirNuevo = () => {
    if (!target) return
    setNuevoDoc({
      tipoDocumentoId: (tdq.data ?? []).find(t => t.activo)?.id?.toString() ?? '',
      usuarioId: currentUserId || String(target.usuarioId ?? ''),
      nombre: '',
      descripcion: '',
    })
    setNuevoDocOpen(true)
  }

  const guardarNuevo = async () => {
    if (!target) return
    await documentoMutations.createMutation.mutateAsync({
      peticionId: Number(target.peticionId),
      tipoDocumentoId: Number(nuevoDoc.tipoDocumentoId),
      nombre: nuevoDoc.nombre,
      descripcion: nuevoDoc.descripcion,
      usuarioId: Number(nuevoDoc.usuarioId),
      imputacionId: target.imputacionId == null ? null : Number(target.imputacionId),
    })
    setNuevoDocOpen(false)
  }

  const desvincular = async (d: Documento) => {
    await documentoMutations.updateMutation.mutateAsync({
      id: d.id,
      payload: {
        peticionId: Number(d.peticionId),
        tipoDocumentoId: Number(d.tipoDocumentoId),
        nombre: d.nombre,
        descripcion: d.descripcion ?? '',
        usuarioId: Number(d.usuarioId),
        imputacionId: null,
      },
    })
  }

  const vincular = async (d: Documento) => {
    if (!target?.imputacionId) return
    await documentoMutations.updateMutation.mutateAsync({
      id: d.id,
      payload: {
        peticionId: Number(d.peticionId),
        tipoDocumentoId: Number(d.tipoDocumentoId),
        nombre: d.nombre,
        descripcion: d.descripcion ?? '',
        usuarioId: Number(d.usuarioId),
        imputacionId: Number(target.imputacionId),
      },
    })
  }

  return <>
    <EntityDrawer
      open={open}
      title={`Documentos vinculados${target?.peticionCodigo ? ` · ${target.peticionCodigo}` : ''}`}
      saveLabel="Cerrar"
      onClose={onClose}
      onSave={onClose}
    >
      {error ? <Alert severity="error" sx={{ mb: 1.5 }}>{getHttpErrorMessage(error)}</Alert> : null}
      <Stack spacing={1.25}>
        <Button variant="outlined" startIcon={<AppIcon name="addDocument" />} onClick={abrirNuevo}>Añadir documento</Button>
        {documentosVinculados.length === 0
          ? <Typography color="text.secondary">{esImputacion ? 'Esta imputación no tiene documentos vinculados.' : 'Esta petición no tiene documentos vinculados.'}</Typography>
          : documentosVinculados.map(d => <Box key={d.id} sx={{ p: 1.25, border: '1px solid #e2e8f0', borderRadius: 1 }}>
            <Typography fontWeight={700}>{d.nombre}</Typography>
            <Typography variant="caption" color="text.secondary">{d.tipoDocumentoNombre || ''}{d.descripcion ? ` · ${d.descripcion}` : ''}</Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              {esImputacion && <Button size="small" onClick={() => desvincular(d)}>Desvincular</Button>}
              <Button size="small" color="error" onClick={() => documentoMutations.deleteMutation.mutateAsync(d.id)}>Eliminar</Button>
            </Stack>
          </Box>)}

        {esImputacion && documentosSinVincular.length > 0 && <Box sx={{ pt: .5 }}>
          <Typography variant="subtitle2" sx={{ mb: .75 }}>Documentos de la petición sin vincular</Typography>
          <Stack spacing={.75}>
            {documentosSinVincular.map(d => <Box key={d.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, border: '1px dashed #cbd5e1', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ flex: 1 }}>{d.nombre}</Typography>
              <Button size="small" onClick={() => vincular(d)}>Vincular</Button>
            </Box>)}
          </Stack>
        </Box>}
      </Stack>
    </EntityDrawer>

    <EntityDrawer
      open={nuevoDocOpen}
      title={esImputacion ? 'Añadir documento a la imputación' : 'Añadir documento a la petición'}
      saving={documentoMutations.createMutation.isPending}
      onClose={() => setNuevoDocOpen(false)}
      onSave={guardarNuevo}
    >
      <Stack spacing={2} sx={{flex:1,minHeight:0}}>
        <FormControl size="small" required>
          <InputLabel>Tipo documento</InputLabel>
          <Select label="Tipo documento" value={nuevoDoc.tipoDocumentoId} onChange={e => setNuevoDoc({ ...nuevoDoc, tipoDocumentoId: String(e.target.value) })}>
            {(tdq.data ?? []).filter(t => t.activo).map(t => <MenuItem key={t.id} value={String(t.id)}>{t.nombre}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" required>
          <InputLabel>Usuario</InputLabel>
          <Select label="Usuario" value={nuevoDoc.usuarioId} onChange={e => setNuevoDoc({ ...nuevoDoc, usuarioId: String(e.target.value) })}>
            {(uq.data ?? []).filter(u => u.activo).map(u => <MenuItem key={u.id} value={String(u.id)}>{u.nombre}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField size="small" required label="Fichero" helperText="Ruta completa y nombre del fichero" value={nuevoDoc.nombre} onChange={e => setNuevoDoc({ ...nuevoDoc, nombre: e.target.value })} />
        <ExpandingTextField label="Descripción" value={nuevoDoc.descripcion} onChange={value => setNuevoDoc(prev => ({ ...prev, descripcion: value }))} />
      </Stack>
    </EntityDrawer>
  </>
}
