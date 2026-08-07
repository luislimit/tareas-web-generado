package es.luisev.tareas.dto.response;
import java.math.BigDecimal;
public record EstadoPeticionDto(Long id,String codigo,String nombre,String color,int orden,boolean activo,boolean estadoFinal) {}
