package es.luisev.tareas.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record UsuarioRequest(@NotBlank String codigo,@NotBlank String nombre,@Email String email,boolean activo) {}
