package es.luisev.tareas.service;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.*;
import es.luisev.tareas.dto.response.*;
import es.luisev.tareas.entity.*;
import es.luisev.tareas.exception.*;
import es.luisev.tareas.mapper.DtoMapper;
import es.luisev.tareas.repository.*;
@Service
@Transactional
public class PeticionService {
 private final PeticionRepository repository; private final CategoriaRepository categoriaRepository; private final SubcategoriaRepository subcategoriaRepository; private final UsuarioRepository usuarioRepository; private final EstadoPeticionRepository estadoRepository; private final PeticionEstadoRepository historialRepository; private final DtoMapper mapper;
 public PeticionService(PeticionRepository repository,CategoriaRepository categoriaRepository,SubcategoriaRepository subcategoriaRepository,UsuarioRepository usuarioRepository,EstadoPeticionRepository estadoRepository,PeticionEstadoRepository historialRepository,DtoMapper mapper){this.repository=repository;this.categoriaRepository=categoriaRepository;this.subcategoriaRepository=subcategoriaRepository;this.usuarioRepository=usuarioRepository;this.estadoRepository=estadoRepository;this.historialRepository=historialRepository;this.mapper=mapper;}
 @Transactional(readOnly=true) public List<PeticionDto> findAll(){return repository.findAll(Sort.by("codigo")).stream().map(mapper::peticion).toList();}
 @Transactional(readOnly=true) public PeticionDto findById(Long id){return mapper.peticion(entity(id));}
 public PeticionDto create(PeticionRequest r){Peticion x=new Peticion();apply(x,r);x.setFechaAlta(java.time.LocalDateTime.now().toString());x.setHorasReales(BigDecimal.ZERO);x=repository.save(x);PeticionEstado h=new PeticionEstado();h.setPeticion(x);h.setEstadoNuevo(x.getEstadoActual());h.setFechaCambio(java.time.LocalDateTime.now().toString());h.setUsuario(x.getUsuario());h.setObservaciones("Estado inicial de la petición");historialRepository.save(h);return mapper.peticion(x);}
 public PeticionDto update(Long id,PeticionRequest r){Peticion x=entity(id);Long estadoActual=x.getEstadoActual().getId();apply(x,r);if(!estadoActual.equals(r.estadoId()))throw new BusinessException("CAMBIO_ESTADO_NO_PERMITIDO","Utilice /api/peticiones/{id}/cambio-estado");return mapper.peticion(repository.save(x));}
 public void delete(Long id){repository.delete(entity(id));}
 public PeticionDto cambiarEstado(Long id,CambiarEstadoPeticionRequest r){Peticion x=entity(id);EstadoPeticion nuevo=estadoRepository.findById(r.estadoNuevoId()).orElseThrow(()->new ResourceNotFoundException("Estado no encontrado"));Usuario usuario=usuarioRepository.findById(r.usuarioId()).orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado"));PeticionEstado h=new PeticionEstado();h.setPeticion(x);h.setEstadoAnterior(x.getEstadoActual());h.setEstadoNuevo(nuevo);h.setFechaCambio(r.fechaCambio()==null?java.time.LocalDateTime.now().toString():r.fechaCambio());h.setUsuario(usuario);h.setObservaciones(r.observaciones().trim());historialRepository.save(h);x.setEstadoActual(nuevo);return mapper.peticion(repository.save(x));}
 @Transactional(readOnly=true) public List<PeticionEstadoDto> historial(Long id){entity(id);return historialRepository.findByPeticionIdOrderByFechaCambioDesc(id).stream().map(mapper::peticionEstado).toList();}
 private Peticion entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Petición no encontrada"));}
 private void apply(Peticion x,PeticionRequest r){Categoria c=categoriaRepository.findById(r.categoriaId()).orElseThrow(()->new ResourceNotFoundException("Categoría no encontrada"));Subcategoria s=subcategoriaRepository.findById(r.subcategoriaId()).orElseThrow(()->new ResourceNotFoundException("Subcategoría no encontrada"));if(!s.getCategoria().getId().equals(c.getId()))throw new BusinessException("SUBCATEGORIA_INVALIDA","La subcategoría no pertenece a la categoría");x.setCodigo(r.codigo().trim());x.setAsunto(r.asunto().trim());x.setDescripcion(r.descripcion());x.setCategoria(c);x.setSubcategoria(s);x.setUsuario(usuarioRepository.findById(r.usuarioId()).orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado")));x.setEstadoActual(estadoRepository.findById(r.estadoId()).orElseThrow(()->new ResourceNotFoundException("Estado no encontrado")));x.setFechaInicioPrevista(r.fechaInicioPrevista());x.setFechaFinPrevista(r.fechaFinPrevista());x.setFechaInicioReal(r.fechaInicioReal());x.setFechaFinReal(r.fechaFinReal());x.setHorasPrevistas(r.horasPrevistas());x.setPorcentaje(r.porcentaje()==null?BigDecimal.ZERO:r.porcentaje());x.setRutaDocumentos(r.rutaDocumentos());x.setActivo(r.activo());}
}
