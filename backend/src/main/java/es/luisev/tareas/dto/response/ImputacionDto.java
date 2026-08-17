package es.luisev.tareas.dto.response;

import java.math.BigDecimal;

public record ImputacionDto(
        Long id,
        Long peticionId,
        String peticionCodigo,
        Long usuarioId,
        String usuarioNombre,
        String fecha,
        BigDecimal horas,
        boolean extra,
        Long estadoHorasId,
        String estadoHorasNombre,
        Long tipoHoraId,
        String tipoHoraNombre,
        String descripcion,
        String fechaAlta
) {
    /**
     * Compatibilidad temporal con el DtoMapper anterior al maestro TipoHora.
     * Permite compilar llamadas antiguas mientras los nuevos servicios ya
     * devuelven tipoHoraId/tipoHoraNombre correctamente.
     */
    public ImputacionDto(
            Long id,
            Long peticionId,
            String peticionCodigo,
            Long usuarioId,
            String usuarioNombre,
            String fecha,
            BigDecimal horas,
            boolean extra,
            Long estadoHorasId,
            String estadoHorasNombre,
            String descripcion,
            String fechaAlta
    ) {
        this(id, peticionId, peticionCodigo, usuarioId, usuarioNombre, fecha, horas, extra,
                estadoHorasId, estadoHorasNombre, null, null, descripcion, fechaAlta);
    }
}
