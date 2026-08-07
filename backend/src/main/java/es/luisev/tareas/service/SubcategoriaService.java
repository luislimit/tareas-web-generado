package es.luisev.tareas.service;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.SubcategoriaRequest;
import es.luisev.tareas.dto.response.SubcategoriaDto;
import es.luisev.tareas.entity.Subcategoria;
import es.luisev.tareas.exception.ResourceNotFoundException;
import es.luisev.tareas.mapper.DtoMapper;
import es.luisev.tareas.repository.SubcategoriaRepository;
import es.luisev.tareas.repository.CategoriaRepository;
@Service
@Transactional
public class SubcategoriaService {
 private final SubcategoriaRepository repository;
 private final DtoMapper mapper;
 private final CategoriaRepository categoriaRepository;
 public SubcategoriaService(SubcategoriaRepository repository,DtoMapper mapper,CategoriaRepository categoriaRepository){this.repository=repository;this.mapper=mapper;this.categoriaRepository=categoriaRepository;}
 @Transactional(readOnly=true) public List<SubcategoriaDto> findAll(){return repository.findAll(Sort.by("id")).stream().map(mapper::subcategoria).toList();}
 @Transactional(readOnly=true) public SubcategoriaDto findById(Long id){return mapper.subcategoria(entity(id));}
 public SubcategoriaDto create(SubcategoriaRequest r){Subcategoria x=new Subcategoria();apply(x,r);return mapper.subcategoria(repository.save(x));}
 public SubcategoriaDto update(Long id,SubcategoriaRequest r){Subcategoria x=entity(id);apply(x,r);return mapper.subcategoria(repository.save(x));}
 public void delete(Long id){repository.delete(entity(id));}
 private Subcategoria entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Subcategoria no encontrado"));}
 private void apply(Subcategoria x,SubcategoriaRequest r){x.setCategoria(categoriaRepository.findById(r.categoriaId()).orElseThrow(()->new ResourceNotFoundException("Categoría no encontrada"))); x.setCodigo(r.codigo().trim()); x.setNombre(r.nombre().trim()); x.setActivo(r.activo()); if(x.getFechaAlta()==null)x.setFechaAlta(java.time.LocalDateTime.now().toString());}
}
