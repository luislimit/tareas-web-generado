package es.luisev.tareas.dto.response;
import java.math.BigDecimal;
public record PeticionDto(Long id,String codigo,String asunto,String descripcion,Long categoriaId,String categoriaNombre,Long subcategoriaId,String subcategoriaNombre,Long usuarioId,String usuarioNombre,Long estadoId,String estadoNombre,String fechaAlta,String fechaInicioPrevista,String fechaFinPrevista,String fechaInicioReal,String fechaFinReal,BigDecimal horasPrevistas,BigDecimal horasReales,BigDecimal porcentaje,String rutaDocumentos,boolean activo) {}
