export interface Peticion {
  id: number | string
  codigo: string
  asunto: string
  descripcion?: string
  categoriaId: number | string
  categoriaNombre?: string
  subcategoriaId: number | string
  subcategoriaNombre?: string
  usuarioId: number | string
  usuarioNombre?: string
  estadoId: number | string
  estadoNombre?: string
  fechaAlta?: string
  fechaInicioPrevista?: string
  fechaFinPrevista?: string
  fechaInicioReal?: string
  fechaFinReal?: string
  horasPrevistas?: number
  horasReales?: number
  porcentaje?: number
  rutaDocumentos?: string
  activo: boolean
}

export interface PeticionRequest {
  codigo: string
  asunto: string
  descripcion?: string
  categoriaId: number | string
  subcategoriaId: number | string
  usuarioId: number | string
  estadoId: number | string
  fechaInicioPrevista?: string
  fechaFinPrevista?: string
  fechaInicioReal?: string
  fechaFinReal?: string
  horasPrevistas?: number
  porcentaje?: number
  rutaDocumentos?: string
  activo: boolean
}

export interface CambioEstadoRequest {
  estadoNuevoId: number | string
  usuarioId: number | string
  fechaCambio?: string
  observaciones: string
}

export interface PeticionEstado {
  id: number | string
  peticionId: number | string
  estadoAnteriorId?: number | string
  estadoAnteriorNombre?: string
  estadoNuevoId: number | string
  estadoNuevoNombre?: string
  fechaCambio?: string
  usuarioId: number | string
  usuarioNombre?: string
  observaciones?: string
}
