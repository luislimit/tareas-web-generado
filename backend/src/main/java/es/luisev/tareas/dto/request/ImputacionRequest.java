package es.luisev.tareas.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record ImputacionRequest(@NotNull Long peticionId,@NotNull Long usuarioId,@NotNull String fecha,@NotNull @DecimalMin(value="0.01") BigDecimal horas,boolean extra,@NotNull Long estadoHorasId,String descripcion) {}
