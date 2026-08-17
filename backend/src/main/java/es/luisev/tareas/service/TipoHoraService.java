package es.luisev.tareas.service;

import es.luisev.tareas.dto.request.TipoHoraRequest;
import es.luisev.tareas.dto.response.TipoHoraDto;
import es.luisev.tareas.entity.EstadoPeticion;
import es.luisev.tareas.entity.TipoHora;
import es.luisev.tareas.mapper.TipoHoraMapper;
import es.luisev.tareas.repository.EstadoPeticionRepository;
import es.luisev.tareas.repository.TipoHoraRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TipoHoraService {
    private final TipoHoraRepository repository;
    private final EstadoPeticionRepository estadoPeticionRepository;
    private final TipoHoraMapper mapper;

    public List<TipoHoraDto> findAll() {
        return repository.findAll(Sort.by(Sort.Order.asc("orden"), Sort.Order.asc("nombre")))
                .stream().map(mapper::toDto).toList();
    }

    public TipoHoraDto findById(Long id) {
        return mapper.toDto(getEntity(id));
    }

    public TipoHora getEntity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("No existe el tipo de hora " + id));
    }

    public TipoHora getDesarrollo() {
        return repository.findByCodigoIgnoreCase("DESARROLLO")
                .orElseThrow(() -> new EntityNotFoundException("No existe el tipo de hora DESARROLLO"));
    }

    @Transactional
    public TipoHoraDto create(TipoHoraRequest request) {
        validateUnique(null, request);
        TipoHora entity = new TipoHora();
        mapper.updateEntity(request, entity, resolveEstadoPeticion(request.estadoPeticionId()));
        return mapper.toDto(repository.save(entity));
    }

    @Transactional
    public TipoHoraDto update(Long id, TipoHoraRequest request) {
        TipoHora entity = getEntity(id);
        validateUnique(id, request);
        mapper.updateEntity(request, entity, resolveEstadoPeticion(request.estadoPeticionId()));
        return mapper.toDto(repository.save(entity));
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("No existe el tipo de hora " + id);
        }
        repository.deleteById(id);
    }

    private EstadoPeticion resolveEstadoPeticion(Long estadoPeticionId) {
        if (estadoPeticionId == null) return null;
        return estadoPeticionRepository.findById(estadoPeticionId)
                .orElseThrow(() -> new EntityNotFoundException("No existe el estado de petición " + estadoPeticionId));
    }

    private void validateUnique(Long id, TipoHoraRequest request) {
        repository.findByCodigoIgnoreCase(request.codigo().trim()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) throw new IllegalArgumentException("Ya existe un tipo de hora con ese código");
        });
        repository.findAll().stream()
                .filter(x -> x.getNombre().equalsIgnoreCase(request.nombre().trim()))
                .filter(x -> !x.getId().equals(id))
                .findFirst()
                .ifPresent(x -> { throw new IllegalArgumentException("Ya existe un tipo de hora con ese nombre"); });
    }
}
