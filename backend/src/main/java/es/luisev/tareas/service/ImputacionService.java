package es.luisev.tareas.service;

import es.luisev.tareas.dto.request.ImputacionRequest;
import es.luisev.tareas.dto.response.ImputacionDto;
import es.luisev.tareas.entity.Imputacion;
import es.luisev.tareas.entity.TipoHora;
import es.luisev.tareas.repository.EstadoHorasRepository;
import es.luisev.tareas.repository.ImputacionRepository;
import es.luisev.tareas.repository.PeticionRepository;
import es.luisev.tareas.repository.TipoHoraRepository;
import es.luisev.tareas.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class ImputacionService {
    private static final String TIPO_HORA_DESARROLLO = "DESARROLLO";

    private final ImputacionRepository repository;
    private final PeticionRepository peticionRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstadoHorasRepository estadoHorasRepository;
    private final TipoHoraRepository tipoHoraRepository;
    private final PeticionService peticionService;

    public ImputacionService(ImputacionRepository repository,
                             PeticionRepository peticionRepository,
                             UsuarioRepository usuarioRepository,
                             EstadoHorasRepository estadoHorasRepository,
                             TipoHoraRepository tipoHoraRepository,
                             PeticionService peticionService) {
        this.repository = repository;
        this.peticionRepository = peticionRepository;
        this.usuarioRepository = usuarioRepository;
        this.estadoHorasRepository = estadoHorasRepository;
        this.tipoHoraRepository = tipoHoraRepository;
        this.peticionService = peticionService;
    }

    public List<ImputacionDto> all() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public List<ImputacionDto> byPeticion(Long peticionId) {
        return repository.findAll().stream()
                .filter(x -> x.getPeticion() != null && peticionId.equals(x.getPeticion().getId()))
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public ImputacionDto create(ImputacionRequest r) {
        Imputacion x = new Imputacion();
        apply(x, r);
        x.setFechaAlta(LocalDateTime.now().toString());
        x = repository.save(x);
        peticionService.cambiarEstadoPorImputacion(x);
        return toDto(x);
    }

    @Transactional
    public ImputacionDto update(Long id, ImputacionRequest r) {
        Imputacion x = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Imputación no encontrada"));
        apply(x, r);
        x = repository.save(x);
        peticionService.cambiarEstadoPorImputacion(x);
        return toDto(x);
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Imputación no encontrada");
        }
        repository.deleteById(id);
    }

    private void apply(Imputacion x, ImputacionRequest r) {
        x.setPeticion(peticionRepository.findById(r.peticionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Petición no encontrada")));
        x.setUsuario(usuarioRepository.findById(r.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario no encontrado")));
        x.setEstadoHoras(estadoHorasRepository.findById(r.estadoHorasId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado de horas no encontrado")));
        x.setTipoHora(resolveTipoHora(r.tipoHoraId()));
        x.setFecha(r.fecha());
        x.setHoras(r.horas());
        x.setExtra(r.extra());
        x.setDescripcion(r.descripcion());
    }

    private TipoHora resolveTipoHora(Long tipoHoraId) {
        if (tipoHoraId != null) {
            return tipoHoraRepository.findById(tipoHoraId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de hora no encontrado"));
        }
        return tipoHoraRepository.findByCodigoIgnoreCase(TIPO_HORA_DESARROLLO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "No existe el tipo de hora DESARROLLO"));
    }

    private ImputacionDto toDto(Imputacion x) {
        return new ImputacionDto(
                x.getId(),
                x.getPeticion().getId(),
                x.getPeticion().getCodigo(),
                x.getUsuario().getId(),
                x.getUsuario().getNombre(),
                x.getFecha(),
                x.getHoras(),
                x.isExtra(),
                x.getEstadoHoras().getId(),
                x.getEstadoHoras().getNombre(),
                x.getTipoHora().getId(),
                x.getTipoHora().getNombre(),
                x.getDescripcion(),
                x.getFechaAlta()
        );
    }
}
