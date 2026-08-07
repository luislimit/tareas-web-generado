package es.luisev.tareas.dto.response;
import java.math.BigDecimal;
public record CategoriaDto(Long id,String codigo,String nombre,boolean activo,String fechaAlta) {}
