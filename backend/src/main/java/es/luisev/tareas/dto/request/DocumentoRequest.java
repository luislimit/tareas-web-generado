package es.luisev.tareas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DocumentoRequest(
        @NotNull Long peticionId,
        @NotNull Long tipoDocumentoId,
        @NotBlank String nombre,
        String descripcion,
        @NotNull Long usuarioId,
        Long imputacionId
) {
    /**
     * Compatibilidad de compilación con DocumentoService antiguo.
     * La ruta ya no existe como dato independiente: nombre contiene la ruta completa.
     */
    @Deprecated
    public String ruta() {
        return null;
    }
}
