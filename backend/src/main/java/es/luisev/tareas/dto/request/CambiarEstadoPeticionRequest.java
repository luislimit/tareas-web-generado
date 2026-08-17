package es.luisev.tareas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CambiarEstadoPeticionRequest(
        @NotNull Long estadoNuevoId,
        @NotNull Long usuarioId,
        String fechaCambio,
        @NotBlank String observaciones,
        Long imputacionId
) {}
