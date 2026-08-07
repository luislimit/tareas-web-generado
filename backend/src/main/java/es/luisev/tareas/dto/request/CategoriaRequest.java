package es.luisev.tareas.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record CategoriaRequest(@NotBlank String codigo,@NotBlank String nombre,boolean activo) {}
