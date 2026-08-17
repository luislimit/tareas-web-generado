package es.luisev.tareas.dto.response;

public record TipoHoraDto(
        Long id,
        String codigo,
        String nombre,
        int orden,
        boolean activo,
        Long estadoPeticionId,
        String estadoPeticionNombre
) {}
