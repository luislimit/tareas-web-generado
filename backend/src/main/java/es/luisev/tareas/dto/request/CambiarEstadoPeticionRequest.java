package es.luisev.tareas.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record CambiarEstadoPeticionRequest(@NotNull Long estadoNuevoId,@NotNull Long usuarioId,String fechaCambio,@NotBlank String observaciones) {}
