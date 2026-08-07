package es.luisev.tareas.dto.response;
import java.math.BigDecimal;
public record SubcategoriaDto(Long id,Long categoriaId,String categoriaNombre,String codigo,String nombre,boolean activo,String fechaAlta) {}
