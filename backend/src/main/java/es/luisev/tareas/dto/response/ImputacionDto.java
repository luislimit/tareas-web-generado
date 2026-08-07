package es.luisev.tareas.dto.response;
import java.math.BigDecimal;
public record ImputacionDto(Long id,Long peticionId,String peticionCodigo,Long usuarioId,String usuarioNombre,String fecha,BigDecimal horas,boolean extra,Long estadoHorasId,String estadoHorasNombre,String descripcion,String fechaAlta) {}
