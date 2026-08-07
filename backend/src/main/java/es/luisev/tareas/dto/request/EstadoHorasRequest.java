package es.luisev.tareas.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record EstadoHorasRequest(@NotBlank String codigo,@NotBlank String nombre,String color,int orden,boolean activo,boolean estadoFinal) {}
