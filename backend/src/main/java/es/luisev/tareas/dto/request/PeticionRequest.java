package es.luisev.tareas.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record PeticionRequest(@NotBlank String codigo,@NotBlank String asunto,String descripcion,@NotNull Long categoriaId,@NotNull Long subcategoriaId,@NotNull Long usuarioId,@NotNull Long estadoId,String fechaInicioPrevista,String fechaFinPrevista,String fechaInicioReal,String fechaFinReal,@DecimalMin("0.0") BigDecimal horasPrevistas,@DecimalMin("0.0") @DecimalMax("100.0") BigDecimal porcentaje,String rutaDocumentos,boolean activo) {}
