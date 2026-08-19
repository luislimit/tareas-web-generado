import { Alert, Box, Button, Divider, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import { getHttpErrorMessage } from '../../../api/httpError'
import { useResourceMutations } from '../../../api/useResourceMutations'
import { useCurrentUser } from '../../../app/currentUser'
import { formatDate } from '../../../utils/presentation'
import { AppIcon } from '../../../components/common/AppIcon'
import { EntityDrawer } from '../../../components/common/EntityDrawer'
import { ExpandingTextField } from '../../../components/forms/ExpandingTextField'
import { FileDropTextField } from '../../../components/forms/FileDropTextField'
import { useTiposDocumento } from '../../tiposDocumento/hooks/useTiposDocumento'
import { useImputaciones } from '../../imputaciones/hooks/useImputaciones'
import { useUsuarios } from '../../usuarios/hooks/useUsuarios'
import { abrirDocumento } from '../api/documentoApi'
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

type DocumentoForm = { tipoDocumentoId: string; usuarioId: string; nombre: string; descripcion: string }

const emptyDocumento: DocumentoForm = { tipoDocumentoId: '', usuarioId: '', nombre: '', descripcion: '' }

export function DocumentosVinculadosDrawer({ open, target, onClose }: Props) {
  const dq = useDocumentos()
  const tdq = useTiposDocumento()
  const uq = useUsuarios()
  const iq = useImputaciones()
  const { currentUserId } = useCurrentUser()
  const documentoMutations = useResourceMutations<Documento, Record<string, unknown>>('/documentos', 'documentos')
  const [editorOpen, setEditorOpen] = useState(false)
  const [documentoEditando, setDocumentoEditando] = useState<Documento | null>(null)
  const [documentoForm, setDocumentoForm] = useState<DocumentoForm>(emptyDocumento)
  const [busqueda, setBusqueda] = useState('')

  const esImputacion = target?.imputacionId != null
  const documentosPeticion = useMemo(
    () => (dq.data ?? []).filter(d => target && String(d.peticionId) === String(target.peticionId)),
    [dq.data, target],
  )
  const documentosVinculados = esImputacion
    ? documentosPeticion.filter(d => String(d.imputacionId) === String(target?.imputacionId))
    : documentosPeticion
  const documentosDisponibles = esImputacion
    ? documentosPeticion.filter(d => String(d.imputacionId ?? '') !== String(target?.imputacionId ?? ''))
    : []

  const filtrar = (docs: Documento[]) => {
    const texto = busqueda.trim().toLocaleLowerCase()
    if (!texto) return docs
    return docs.filter(d => `${d.nombre} ${d.tipoDocumentoNombre ?? ''} ${d.descripcion ?? ''}`.toLocaleLowerCase().includes(texto))
  }

  const vinculadosVisibles = filtrar(documentosVinculados)
  const disponiblesVisibles = filtrar(documentosDisponibles)
  const error = documentoMutations.updateMutation.error || documentoMutations.deleteMutation.error || documentoMutations.createMutation.error
  const saving = documentoMutations.updateMutation.isPending || documentoMutations.createMutation.isPending

  const abrirNuevo = () => {
    if (!target) return
    setDocumentoEditando(null)
    setDocumentoForm({
      tipoDocumentoId: (tdq.data ?? []).find(t => t.activo)?.id?.toString() ?? '',
      usuarioId: currentUserId || String(target.usuarioId ?? ''),
      nombre: '',
      descripcion: '',
    })
    setEditorOpen(true)
  }

  const abrirEditar = (d: Documento) => {
    setDocumentoEditando(d)
    setDocumentoForm({
      tipoDocumentoId: String(d.tipoDocumentoId ?? ''),
      usuarioId: String(d.usuarioId ?? ''),
      nombre: d.nombre ?? '',
      descripcion: d.descripcion ?? '',
    })
    setEditorOpen(true)
  }

  const guardarDocumento = async () => {
    if (!target) return
    const payload = {
      peticionId: Number(target.peticionId),
      tipoDocumentoId: Number(documentoForm.tipoDocumentoId),
      nombre: documentoForm.nombre,
      descripcion: documentoForm.descripcion,
      usuarioId: Number(documentoForm.usuarioId),
      imputacionId: documentoEditando
        ? (documentoEditando.imputacionId == null ? null : Number(documentoEditando.imputacionId))
        : (target.imputacionId == null ? null : Number(target.imputacionId)),
    }
    if (documentoEditando) {
      await documentoMutations.updateMutation.mutateAsync({ id: documentoEditando.id, payload })
    } else {
      await documentoMutations.createMutation.mutateAsync(payload)
    }
    setEditorOpen(false)
  }

  const desvincular = async (d: Documento) => {
    if (!window.confirm(`¿Desvincular "${d.nombre}" de esta imputación?\n\nEl documento seguirá vinculado a la petición ${target?.peticionCodigo ?? ''}.`)) return
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
    if (d.imputacionId != null) {
      const imputacionAnterior = (iq.data ?? []).find(i => String(i.id) === String(d.imputacionId))
      const fecha = imputacionAnterior?.fecha ? formatDate(imputacionAnterior.fecha) : 'fecha desconocida'
      const texto = imputacionAnterior?.descripcion?.trim() || 'Sin descripción'
      const confirmar = window.confirm(
        `El documento "${d.nombre}" ya está vinculado a otra imputación.\n\n` +
        `Fecha: ${fecha}\n` +
        `Texto: ${texto}\n\n` +
        '¿Desea desvincularlo de esa imputación y vincularlo a la imputación actual?',
      )
      if (!confirmar) return
    }
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

  const verDocumento = async (d: Documento) => {
    try {
      await abrirDocumento(d.id)
    } catch (err) {
      window.alert(getHttpErrorMessage(err))
    }
  }

  return <>
    <EntityDrawer
      open={open}
      title={`${esImputacion ? 'Documentos de la imputación' : 'Documentos vinculados'}${target?.peticionCodigo ? ` · ${target.peticionCodigo}` : ''}`}
      saveLabel="Cerrar"
      onClose={onClose}
      onSave={onClose}
    >
      {error ? <Alert severity="error" sx={{ mb: 1.5 }}>{getHttpErrorMessage(error)}</Alert> : null}
      <Stack spacing={1.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" startIcon={<AppIcon name="addDocument" />} onClick={abrirNuevo}>Nuevo documento</Button>
          {esImputacion && <TextField
            size="small"
            placeholder="Buscar documentos"
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            sx={{ flex: 1 }}
          />}
        </Stack>

        <Box>
          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: .75 }}>
            {esImputacion ? `Vinculados a esta imputación (${documentosVinculados.length})` : `Documentos (${documentosVinculados.length})`}
          </Typography>
          {vinculadosVisibles.length === 0
            ? <Typography color="text.secondary">{busqueda ? 'No hay documentos vinculados que coincidan con la búsqueda.' : esImputacion ? 'Esta imputación no tiene documentos vinculados.' : 'Esta petición no tiene documentos vinculados.'}</Typography>
            : <Stack spacing={.75}>{vinculadosVisibles.map(d => <Box key={d.id} sx={{ p: 1.25, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography fontWeight={700}>{d.nombre}</Typography>
              <Typography variant="caption" color="text.secondary">{d.tipoDocumentoNombre || ''}{d.descripcion ? ` · ${d.descripcion}` : ''}</Typography>
              <Stack direction="row" spacing={.5} sx={{ mt: .75, flexWrap: 'wrap' }}>
                <Button size="small" startIcon={<AppIcon name="open" fontSize="small" />} onClick={() => verDocumento(d)}>Ver</Button>
                <Button size="small" startIcon={<AppIcon name="edit" fontSize="small" />} onClick={() => abrirEditar(d)}>Editar</Button>
                {esImputacion && <Button size="small" onClick={() => desvincular(d)}>Desvincular</Button>}
              </Stack>
            </Box>)}</Stack>}
        </Box>

        {esImputacion && <>
          <Divider />
          <Box>
            <Typography variant="subtitle2" fontWeight={800} sx={{ mb: .75 }}>
              {`Disponibles en la petición (${documentosDisponibles.length})`}
            </Typography>
            {disponiblesVisibles.length === 0
              ? <Typography color="text.secondary">{busqueda ? 'No hay documentos disponibles que coincidan con la búsqueda.' : 'No hay otros documentos de la petición disponibles para vincular.'}</Typography>
              : <Stack spacing={.75}>{disponiblesVisibles.map(d => <Box key={d.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, border: '1px dashed', borderColor: 'divider', borderRadius: 1 }}>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography variant="body2" fontWeight={700} noWrap title={d.nombre}>{d.nombre}</Typography>
                  <Typography variant="caption" color="text.secondary">{d.tipoDocumentoNombre || ''}{d.descripcion ? ` · ${d.descripcion}` : ''}</Typography>
                  {d.imputacionId != null && (() => {
                    const otra = (iq.data ?? []).find(i => String(i.id) === String(d.imputacionId))
                    return <Typography variant="caption" color="warning.main" display="block">
                      Vinculado a otra imputación{otra?.fecha ? ` · ${formatDate(otra.fecha)}` : ''}{otra?.descripcion ? ` · ${otra.descripcion}` : ''}
                    </Typography>
                  })()}
                </Box>
                <Button size="small" startIcon={<AppIcon name="open" fontSize="small" />} onClick={() => verDocumento(d)}>Ver</Button>
                <Button size="small" variant="outlined" onClick={() => vincular(d)}>Vincular</Button>
              </Box>)}</Stack>}
          </Box>
        </>}
      </Stack>
    </EntityDrawer>

    <EntityDrawer
      open={editorOpen}
      title={documentoEditando ? 'Editar documento' : esImputacion ? 'Nuevo documento vinculado a la imputación' : 'Nuevo documento vinculado a la petición'}
      saving={saving}
      saveDisabled={!documentoForm.tipoDocumentoId || !documentoForm.usuarioId || !documentoForm.nombre.trim()}
      onClose={() => setEditorOpen(false)}
      onSave={guardarDocumento}
    >
      <Stack spacing={2} sx={{ height: '100%', minHeight: 0 }}>
        <FormControl size="small" required>
          <InputLabel>Tipo documento</InputLabel>
          <Select label="Tipo documento" value={documentoForm.tipoDocumentoId} onChange={e => setDocumentoForm({ ...documentoForm, tipoDocumentoId: String(e.target.value) })}>
            {(tdq.data ?? []).filter(t => t.activo || String(t.id) === documentoForm.tipoDocumentoId).map(t => <MenuItem key={t.id} value={String(t.id)}>{t.nombre}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl size="small" required>
          <InputLabel>Usuario</InputLabel>
          <Select label="Usuario" value={documentoForm.usuarioId} onChange={e => setDocumentoForm({ ...documentoForm, usuarioId: String(e.target.value) })}>
            {(uq.data ?? []).filter(u => u.activo || String(u.id) === documentoForm.usuarioId).map(u => <MenuItem key={u.id} value={String(u.id)}>{u.nombre}</MenuItem>)}
          </Select>
        </FormControl>
        <FileDropTextField
          size="small"
          required
          label="Fichero"
          value={documentoForm.nombre}
          onValueChange={nombre => setDocumentoForm({ ...documentoForm, nombre })}
        />
        <ExpandingTextField
          label="Descripción"
          value={documentoForm.descripcion}
          onChange={descripcion => setDocumentoForm({ ...documentoForm, descripcion })}
        />
      </Stack>
    </EntityDrawer>
  </>
}
