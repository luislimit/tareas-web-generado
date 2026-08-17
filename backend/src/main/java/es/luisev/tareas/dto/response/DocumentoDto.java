package es.luisev.tareas.dto.response;

public record DocumentoDto(
        Long id,
        Long peticionId,
        String peticionCodigo,
        Long tipoDocumentoId,
        String tipoDocumentoNombre,
        String nombre,
        String descripcion,
        String fechaAlta,
        Long usuarioId,
        String usuarioNombre,
        Long imputacionId
) {}
