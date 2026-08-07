package es.luisev.tareas.service;
import java.math.BigDecimal; import java.util.List;
import org.springframework.data.domain.Sort; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.ImputacionRequest; import es.luisev.tareas.dto.response.ImputacionDto; import es.luisev.tareas.entity.*; import es.luisev.tareas.exception.ResourceNotFoundException; import es.luisev.tareas.mapper.DtoMapper; import es.luisev.tareas.repository.*;
@Service @Transactional
public class ImputacionService {
 private final ImputacionRepository repository; private final PeticionRepository peticionRepository; private final UsuarioRepository usuarioRepository; private final EstadoHorasRepository estadoRepository; private final DtoMapper mapper;
 public ImputacionService(ImputacionRepository repository,PeticionRepository peticionRepository,UsuarioRepository usuarioRepository,EstadoHorasRepository estadoRepository,DtoMapper mapper){this.repository=repository;this.peticionRepository=peticionRepository;this.usuarioRepository=usuarioRepository;this.estadoRepository=estadoRepository;this.mapper=mapper;}
 @Transactional(readOnly=true) public List<ImputacionDto> all(){return repository.findAll(Sort.by(Sort.Direction.DESC,"fecha")).stream().map(mapper::imputacion).toList();}
 @Transactional(readOnly=true) public List<ImputacionDto> byPeticion(Long id){return repository.findByPeticionIdOrderByFechaDesc(id).stream().map(mapper::imputacion).toList();}
 public ImputacionDto create(ImputacionRequest r){Imputacion x=new Imputacion();apply(x,r);x.setFechaAlta(java.time.LocalDateTime.now().toString());x=repository.save(x);recalcular(x.getPeticion());return mapper.imputacion(x);}
 public ImputacionDto update(Long id,ImputacionRequest r){Imputacion x=entity(id);Peticion anterior=x.getPeticion();apply(x,r);x=repository.save(x);recalcular(anterior);if(!anterior.getId().equals(x.getPeticion().getId()))recalcular(x.getPeticion());return mapper.imputacion(x);}
 public void delete(Long id){Imputacion x=entity(id);Peticion p=x.getPeticion();repository.delete(x);repository.flush();recalcular(p);}
 private void recalcular(Peticion p){BigDecimal total=repository.findByPeticionIdOrderByFechaDesc(p.getId()).stream().map(Imputacion::getHoras).reduce(BigDecimal.ZERO,BigDecimal::add);p.setHorasReales(total);peticionRepository.save(p);}
 private Imputacion entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Imputación no encontrada"));}
 private void apply(Imputacion x,ImputacionRequest r){x.setPeticion(peticionRepository.findById(r.peticionId()).orElseThrow(()->new ResourceNotFoundException("Petición no encontrada")));x.setUsuario(usuarioRepository.findById(r.usuarioId()).orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado")));x.setFecha(r.fecha());x.setHoras(r.horas());x.setExtra(r.extra());x.setEstadoHoras(estadoRepository.findById(r.estadoHorasId()).orElseThrow(()->new ResourceNotFoundException("Estado de horas no encontrado")));x.setDescripcion(r.descripcion());}
}
