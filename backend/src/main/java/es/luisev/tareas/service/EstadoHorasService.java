package es.luisev.tareas.service;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.EstadoHorasRequest;
import es.luisev.tareas.dto.response.EstadoHorasDto;
import es.luisev.tareas.entity.EstadoHoras;
import es.luisev.tareas.exception.ResourceNotFoundException;
import es.luisev.tareas.mapper.DtoMapper;
import es.luisev.tareas.repository.EstadoHorasRepository;

@Service
@Transactional
public class EstadoHorasService {
 private final EstadoHorasRepository repository;
 private final DtoMapper mapper;
 
 public EstadoHorasService(EstadoHorasRepository repository,DtoMapper mapper){this.repository=repository;this.mapper=mapper;}
 @Transactional(readOnly=true) public List<EstadoHorasDto> findAll(){return repository.findAll(Sort.by("id")).stream().map(mapper::estadoHoras).toList();}
 @Transactional(readOnly=true) public EstadoHorasDto findById(Long id){return mapper.estadoHoras(entity(id));}
 public EstadoHorasDto create(EstadoHorasRequest r){EstadoHoras x=new EstadoHoras();apply(x,r);return mapper.estadoHoras(repository.save(x));}
 public EstadoHorasDto update(Long id,EstadoHorasRequest r){EstadoHoras x=entity(id);apply(x,r);return mapper.estadoHoras(repository.save(x));}
 public void delete(Long id){repository.delete(entity(id));}
 private EstadoHoras entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("EstadoHoras no encontrado"));}
 private void apply(EstadoHoras x,EstadoHorasRequest r){x.setCodigo(r.codigo().trim());x.setNombre(r.nombre().trim());x.setColor(r.color());x.setOrden(r.orden());x.setActivo(r.activo());x.setEstadoFinal(r.estadoFinal());}
}
