package es.luisev.tareas.service;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.TipoDocumentoRequest;
import es.luisev.tareas.dto.response.TipoDocumentoDto;
import es.luisev.tareas.entity.TipoDocumento;
import es.luisev.tareas.exception.ResourceNotFoundException;
import es.luisev.tareas.mapper.DtoMapper;
import es.luisev.tareas.repository.TipoDocumentoRepository;

@Service
@Transactional
public class TipoDocumentoService {
 private final TipoDocumentoRepository repository;
 private final DtoMapper mapper;
 
 public TipoDocumentoService(TipoDocumentoRepository repository,DtoMapper mapper){this.repository=repository;this.mapper=mapper;}
 @Transactional(readOnly=true) public List<TipoDocumentoDto> findAll(){return repository.findAll(Sort.by("id")).stream().map(mapper::tipoDocumento).toList();}
 @Transactional(readOnly=true) public TipoDocumentoDto findById(Long id){return mapper.tipoDocumento(entity(id));}
 public TipoDocumentoDto create(TipoDocumentoRequest r){TipoDocumento x=new TipoDocumento();apply(x,r);return mapper.tipoDocumento(repository.save(x));}
 public TipoDocumentoDto update(Long id,TipoDocumentoRequest r){TipoDocumento x=entity(id);apply(x,r);return mapper.tipoDocumento(repository.save(x));}
 public void delete(Long id){repository.delete(entity(id));}
 private TipoDocumento entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("TipoDocumento no encontrado"));}
 private void apply(TipoDocumento x,TipoDocumentoRequest r){x.setNombre(r.nombre().trim());x.setOrden(r.orden());x.setActivo(r.activo());}
}
