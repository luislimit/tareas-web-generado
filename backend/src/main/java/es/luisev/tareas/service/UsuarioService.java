package es.luisev.tareas.service;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.UsuarioRequest;
import es.luisev.tareas.dto.response.UsuarioDto;
import es.luisev.tareas.entity.Usuario;
import es.luisev.tareas.exception.ResourceNotFoundException;
import es.luisev.tareas.mapper.DtoMapper;
import es.luisev.tareas.repository.UsuarioRepository;

@Service
@Transactional
public class UsuarioService {
 private final UsuarioRepository repository;
 private final DtoMapper mapper;
 
 public UsuarioService(UsuarioRepository repository,DtoMapper mapper){this.repository=repository;this.mapper=mapper;}
 @Transactional(readOnly=true) public List<UsuarioDto> findAll(){return repository.findAll(Sort.by("id")).stream().map(mapper::usuario).toList();}
 @Transactional(readOnly=true) public UsuarioDto findById(Long id){return mapper.usuario(entity(id));}
 public UsuarioDto create(UsuarioRequest r){Usuario x=new Usuario();apply(x,r);return mapper.usuario(repository.save(x));}
 public UsuarioDto update(Long id,UsuarioRequest r){Usuario x=entity(id);apply(x,r);return mapper.usuario(repository.save(x));}
 public void delete(Long id){repository.delete(entity(id));}
 private Usuario entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado"));}
 private void apply(Usuario x,UsuarioRequest r){x.setCodigo(r.codigo().trim());x.setNombre(r.nombre().trim());x.setEmail(r.email());x.setActivo(r.activo());}
}
