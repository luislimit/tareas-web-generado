package es.luisev.tareas.service;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.EstadoPeticionRequest;
import es.luisev.tareas.dto.response.EstadoPeticionDto;
import es.luisev.tareas.entity.EstadoPeticion;
import es.luisev.tareas.exception.ResourceNotFoundException;
import es.luisev.tareas.mapper.DtoMapper;
import es.luisev.tareas.repository.EstadoPeticionRepository;

@Service
@Transactional
public class EstadoPeticionService {
 private final EstadoPeticionRepository repository;
 private final DtoMapper mapper;
 
 public EstadoPeticionService(EstadoPeticionRepository repository,DtoMapper mapper){this.repository=repository;this.mapper=mapper;}
 @Transactional(readOnly=true) public List<EstadoPeticionDto> findAll(){return repository.findAll(Sort.by("id")).stream().map(mapper::estadoPeticion).toList();}
 @Transactional(readOnly=true) public EstadoPeticionDto findById(Long id){return mapper.estadoPeticion(entity(id));}
 public EstadoPeticionDto create(EstadoPeticionRequest r){EstadoPeticion x=new EstadoPeticion();apply(x,r);return mapper.estadoPeticion(repository.save(x));}
 public EstadoPeticionDto update(Long id,EstadoPeticionRequest r){EstadoPeticion x=entity(id);apply(x,r);return mapper.estadoPeticion(repository.save(x));}
 public void delete(Long id){repository.delete(entity(id));}
 private EstadoPeticion entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("EstadoPeticion no encontrado"));}
 private void apply(EstadoPeticion x,EstadoPeticionRequest r){x.setCodigo(r.codigo().trim());x.setNombre(r.nombre().trim());x.setColor(r.color());x.setOrden(r.orden());x.setActivo(r.activo());x.setEstadoFinal(r.estadoFinal());}
}
