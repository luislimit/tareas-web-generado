package es.luisev.tareas.dto.request;

import jakarta.validation.constraints.NotBlank;

public record TipoHoraRequest(
        @NotBlank String codigo,
        @NotBlank String nombre,
        int orden,
        boolean activo,
        Long estadoPeticionId
) {}
