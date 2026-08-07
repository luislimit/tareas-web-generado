package es.luisev.tareas.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record DocumentoRequest(@NotNull Long peticionId,@NotNull Long tipoDocumentoId,@NotBlank String nombre,@NotBlank String ruta,String descripcion,@NotNull Long usuarioId) {}
