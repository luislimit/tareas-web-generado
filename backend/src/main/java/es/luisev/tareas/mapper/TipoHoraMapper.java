package es.luisev.tareas.mapper;

import es.luisev.tareas.dto.request.TipoHoraRequest;
import es.luisev.tareas.dto.response.TipoHoraDto;
import es.luisev.tareas.entity.EstadoPeticion;
import es.luisev.tareas.entity.TipoHora;
import org.springframework.stereotype.Component;

@Component
public class TipoHoraMapper {
    public TipoHoraDto toDto(TipoHora entity) {
        EstadoPeticion estado = entity.getEstadoPeticion();
        return new TipoHoraDto(
                entity.getId(),
                entity.getCodigo(),
                entity.getNombre(),
                entity.getOrden(),
                entity.isActivo(),
                estado == null ? null : estado.getId(),
                estado == null ? null : estado.getNombre()
        );
    }

    public void updateEntity(TipoHoraRequest request, TipoHora entity, EstadoPeticion estadoPeticion) {
        entity.setCodigo(request.codigo().trim().toUpperCase());
        entity.setNombre(request.nombre().trim());
        entity.setOrden(request.orden());
        entity.setActivo(request.activo());
        entity.setEstadoPeticion(estadoPeticion);
    }
}
