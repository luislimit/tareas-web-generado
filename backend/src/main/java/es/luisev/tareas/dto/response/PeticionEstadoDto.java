package es.luisev.tareas.dto.response;
import java.math.BigDecimal;
public record PeticionEstadoDto(Long id,Long peticionId,Long estadoAnteriorId,String estadoAnteriorNombre,Long estadoNuevoId,String estadoNuevoNombre,String fechaCambio,Long usuarioId,String usuarioNombre,String observaciones) {}
