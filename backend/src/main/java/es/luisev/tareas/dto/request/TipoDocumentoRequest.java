package es.luisev.tareas.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record TipoDocumentoRequest(@NotBlank String nombre,int orden,boolean activo) {}
