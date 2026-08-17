package es.luisev.tareas.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ImputacionRequest(
        @NotNull Long peticionId,
        @NotNull Long usuarioId,
        @NotNull String fecha,
        @NotNull @DecimalMin(value = "0.01") BigDecimal horas,
        boolean extra,
        @NotNull Long estadoHorasId,
        Long tipoHoraId,
        String descripcion
) {}
