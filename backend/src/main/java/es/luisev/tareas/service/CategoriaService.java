package es.luisev.tareas.service;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.CategoriaRequest;
import es.luisev.tareas.dto.response.CategoriaDto;
import es.luisev.tareas.entity.Categoria;
import es.luisev.tareas.exception.ResourceNotFoundException;
import es.luisev.tareas.mapper.DtoMapper;
import es.luisev.tareas.repository.CategoriaRepository;
import es.luisev.tareas.repository.SubcategoriaRepository;

@Service
@Transactional
public class CategoriaService {
 private final CategoriaRepository repository;
 private final DtoMapper mapper;
 private final SubcategoriaRepository subcategoriaRepository;
 
 public CategoriaService(CategoriaRepository repository,DtoMapper mapper,SubcategoriaRepository subcategoriaRepository){this.repository=repository;this.mapper=mapper;this.subcategoriaRepository=subcategoriaRepository;}
 @Transactional(readOnly=true) public List<CategoriaDto> findAll(){return repository.findAll(Sort.by("id")).stream().map(mapper::categoria).toList();}
 @Transactional(readOnly=true) public CategoriaDto findById(Long id){return mapper.categoria(entity(id));}
 public CategoriaDto create(CategoriaRequest r){Categoria x=new Categoria();apply(x,r);return mapper.categoria(repository.save(x));}
 public CategoriaDto update(Long id,CategoriaRequest r){Categoria x=entity(id);boolean estabaActiva=x.isActivo();apply(x,r);Categoria guardada=repository.save(x);if(estabaActiva&&!guardada.isActivo()){var subcategorias=subcategoriaRepository.findByCategoriaIdOrderByNombre(id);subcategorias.forEach(s->s.setActivo(false));subcategoriaRepository.saveAll(subcategorias);}return mapper.categoria(guardada);}
 public void delete(Long id){repository.delete(entity(id));}
 private Categoria entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Categoria no encontrado"));}
 private void apply(Categoria x,CategoriaRequest r){x.setCodigo(r.codigo().trim()); x.setNombre(r.nombre().trim()); x.setActivo(r.activo()); if(x.getFechaAlta()==null)x.setFechaAlta(java.time.LocalDateTime.now().toString());}
}
