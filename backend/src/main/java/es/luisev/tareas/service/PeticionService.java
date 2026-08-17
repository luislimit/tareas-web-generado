package es.luisev.tareas.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import es.luisev.tareas.dto.request.CambiarEstadoPeticionRequest;
import es.luisev.tareas.dto.request.PeticionRequest;
import es.luisev.tareas.dto.response.PeticionDto;
import es.luisev.tareas.dto.response.PeticionEstadoDto;
import es.luisev.tareas.entity.Categoria;
import es.luisev.tareas.entity.EstadoPeticion;
import es.luisev.tareas.entity.Imputacion;
import es.luisev.tareas.entity.Peticion;
import es.luisev.tareas.entity.PeticionEstado;
import es.luisev.tareas.entity.Subcategoria;
import es.luisev.tareas.entity.Usuario;
import es.luisev.tareas.exception.BusinessException;
import es.luisev.tareas.exception.ResourceNotFoundException;
import es.luisev.tareas.mapper.DtoMapper;
import es.luisev.tareas.repository.CategoriaRepository;
import es.luisev.tareas.repository.EstadoPeticionRepository;
import es.luisev.tareas.repository.ImputacionRepository;
import es.luisev.tareas.repository.PeticionEstadoRepository;
import es.luisev.tareas.repository.PeticionRepository;
import es.luisev.tareas.repository.SubcategoriaRepository;
import es.luisev.tareas.repository.UsuarioRepository;

@Service
@Transactional
public class PeticionService {
    private final PeticionRepository repository;
    private final CategoriaRepository categoriaRepository;
    private final SubcategoriaRepository subcategoriaRepository;
    private final UsuarioRepository usuarioRepository;
    private final EstadoPeticionRepository estadoRepository;
    private final PeticionEstadoRepository historialRepository;
    private final ImputacionRepository imputacionRepository;
    private final DtoMapper mapper;

    public PeticionService(PeticionRepository repository,
                           CategoriaRepository categoriaRepository,
                           SubcategoriaRepository subcategoriaRepository,
                           UsuarioRepository usuarioRepository,
                           EstadoPeticionRepository estadoRepository,
                           PeticionEstadoRepository historialRepository,
                           ImputacionRepository imputacionRepository,
                           DtoMapper mapper) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
        this.subcategoriaRepository = subcategoriaRepository;
        this.usuarioRepository = usuarioRepository;
        this.estadoRepository = estadoRepository;
        this.historialRepository = historialRepository;
        this.imputacionRepository = imputacionRepository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<PeticionDto> findAll() {
        return repository.findAll(Sort.by("codigo")).stream().map(mapper::peticion).toList();
    }

    @Transactional(readOnly = true)
    public PeticionDto findById(Long id) {
        return mapper.peticion(entity(id));
    }

    public PeticionDto create(PeticionRequest r) {
        Peticion x = new Peticion();
        apply(x, r);
        x.setFechaAlta(LocalDateTime.now().toString());
        x.setHorasReales(BigDecimal.ZERO);
        x = repository.save(x);

        PeticionEstado h = new PeticionEstado();
        h.setPeticion(x);
        h.setEstadoNuevo(x.getEstadoActual());
        h.setFechaCambio(LocalDateTime.now().toString());
        h.setUsuario(x.getUsuario());
        h.setObservaciones("Estado inicial de la petición");
        h.setImputacion(null);
        historialRepository.save(h);
        return mapper.peticion(x);
    }

    public PeticionDto update(Long id, PeticionRequest r) {
        Peticion x = entity(id);
        Long estadoActual = x.getEstadoActual().getId();
        apply(x, r);
        if (!estadoActual.equals(r.estadoId())) {
            throw new BusinessException("CAMBIO_ESTADO_NO_PERMITIDO", "Utilice /api/peticiones/{id}/cambio-estado");
        }
        return mapper.peticion(repository.save(x));
    }

    public void delete(Long id) {
        repository.delete(entity(id));
    }

    /** Cambio de estado solicitado explícitamente desde la API. */
    public PeticionDto cambiarEstado(Long id, CambiarEstadoPeticionRequest r) {
        Peticion x = entity(id);
        EstadoPeticion nuevo = estadoRepository.findById(r.estadoNuevoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado"));
        if (x.getEstadoActual().getId().equals(nuevo.getId())) {
            throw new BusinessException("ESTADO_SIN_CAMBIOS", "El nuevo estado debe ser distinto del estado actual");
        }

        Usuario usuario = usuarioRepository.findById(r.usuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        Imputacion imputacion = resolveImputacion(r.imputacionId(), id);

        registrarCambioEstado(
                x,
                nuevo,
                usuario,
                r.fechaCambio() == null ? LocalDateTime.now().toString() : r.fechaCambio(),
                r.observaciones().trim(),
                imputacion
        );
        return mapper.peticion(repository.save(x));
    }

    /**
     * Aplica, si corresponde, el estado configurado en el tipo de hora de una
     * imputación. Si el tipo no tiene estado asociado o la petición ya está en
     * ese estado, no se realiza ningún cambio.
     */
    public void cambiarEstadoPorImputacion(Imputacion imputacion) {
        if (imputacion == null || imputacion.getTipoHora() == null) return;

        EstadoPeticion nuevo = imputacion.getTipoHora().getEstadoPeticion();
        if (nuevo == null) return;

        Peticion peticion = imputacion.getPeticion();
        if (peticion.getEstadoActual() != null && peticion.getEstadoActual().getId().equals(nuevo.getId())) return;

        String observaciones = "Imputacion de horas " + imputacion.getTipoHora().getNombre();

        registrarCambioEstado(
                peticion,
                nuevo,
                imputacion.getUsuario(),
                LocalDateTime.now().toString(),
                observaciones,
                imputacion
        );
        repository.save(peticion);
    }

    @Transactional(readOnly = true)
    public List<PeticionEstadoDto> historial(Long id) {
        entity(id);
        return historialRepository.findByPeticionIdOrderByFechaCambioDesc(id)
                .stream().map(mapper::peticionEstado).toList();
    }

    private void registrarCambioEstado(Peticion peticion,
                                       EstadoPeticion nuevo,
                                       Usuario usuario,
                                       String fechaCambio,
                                       String observaciones,
                                       Imputacion imputacion) {
        PeticionEstado h = new PeticionEstado();
        h.setPeticion(peticion);
        h.setEstadoAnterior(peticion.getEstadoActual());
        h.setEstadoNuevo(nuevo);
        h.setFechaCambio(fechaCambio);
        h.setUsuario(usuario);
        h.setObservaciones(observaciones);
        h.setImputacion(imputacion);
        historialRepository.save(h);
        peticion.setEstadoActual(nuevo);
    }

    private Imputacion resolveImputacion(Long imputacionId, Long peticionId) {
        if (imputacionId == null) return null;
        Imputacion imputacion = imputacionRepository.findById(imputacionId)
                .orElseThrow(() -> new ResourceNotFoundException("Imputación no encontrada"));
        if (!imputacion.getPeticion().getId().equals(peticionId)) {
            throw new BusinessException("IMPUTACION_PETICION_INVALIDA", "La imputación no pertenece a la petición");
        }
        return imputacion;
    }

    private Peticion entity(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Petición no encontrada"));
    }

    private void apply(Peticion x, PeticionRequest r) {
        Categoria c = categoriaRepository.findById(r.categoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        Subcategoria s = subcategoriaRepository.findById(r.subcategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Subcategoría no encontrada"));
        if (!s.getCategoria().getId().equals(c.getId())) {
            throw new BusinessException("SUBCATEGORIA_INVALIDA", "La subcategoría no pertenece a la categoría");
        }

        x.setCodigo(r.codigo().trim());
        x.setAsunto(r.asunto().trim());
        x.setDescripcion(r.descripcion());
        x.setCategoria(c);
        x.setSubcategoria(s);
        x.setUsuario(usuarioRepository.findById(r.usuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado")));
        x.setEstadoActual(estadoRepository.findById(r.estadoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estado no encontrado")));
        x.setFechaInicioPrevista(r.fechaInicioPrevista());
        x.setFechaFinPrevista(r.fechaFinPrevista());
        x.setFechaInicioReal(r.fechaInicioReal());
        x.setFechaFinReal(r.fechaFinReal());
        x.setHorasPrevistas(r.horasPrevistas());
        x.setPorcentaje(r.porcentaje() == null ? BigDecimal.ZERO : r.porcentaje());
        x.setRutaDocumentos(r.rutaDocumentos());
        x.setActivo(r.activo());
    }
}
