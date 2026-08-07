package es.luisev.tareas.service;
import java.util.List;
import org.springframework.data.domain.Sort; import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.DocumentoRequest; import es.luisev.tareas.dto.response.DocumentoDto; import es.luisev.tareas.entity.Documento; import es.luisev.tareas.exception.ResourceNotFoundException; import es.luisev.tareas.mapper.DtoMapper; import es.luisev.tareas.repository.*;
@Service @Transactional
public class DocumentoService {
 private final DocumentoRepository repository; private final PeticionRepository peticionRepository; private final TipoDocumentoRepository tipoRepository; private final UsuarioRepository usuarioRepository; private final DtoMapper mapper;
 public DocumentoService(DocumentoRepository repository,PeticionRepository peticionRepository,TipoDocumentoRepository tipoRepository,UsuarioRepository usuarioRepository,DtoMapper mapper){this.repository=repository;this.peticionRepository=peticionRepository;this.tipoRepository=tipoRepository;this.usuarioRepository=usuarioRepository;this.mapper=mapper;}
 @Transactional(readOnly=true) public List<DocumentoDto> all(){return repository.findAll(Sort.by(Sort.Direction.DESC,"fechaAlta")).stream().map(mapper::documento).toList();}
 @Transactional(readOnly=true) public List<DocumentoDto> byPeticion(Long id){return repository.findByPeticionIdOrderByFechaAltaDesc(id).stream().map(mapper::documento).toList();}
 public DocumentoDto create(DocumentoRequest r){Documento x=new Documento();apply(x,r);x.setFechaAlta(java.time.LocalDateTime.now().toString());return mapper.documento(repository.save(x));}
 public DocumentoDto update(Long id,DocumentoRequest r){Documento x=entity(id);apply(x,r);return mapper.documento(repository.save(x));}
 public void delete(Long id){repository.delete(entity(id));}
 private Documento entity(Long id){return repository.findById(id).orElseThrow(()->new ResourceNotFoundException("Documento no encontrado"));}
 private void apply(Documento x,DocumentoRequest r){x.setPeticion(peticionRepository.findById(r.peticionId()).orElseThrow(()->new ResourceNotFoundException("Petición no encontrada")));x.setTipoDocumento(tipoRepository.findById(r.tipoDocumentoId()).orElseThrow(()->new ResourceNotFoundException("Tipo de documento no encontrado")));x.setNombre(r.nombre().trim());x.setRuta(r.ruta().trim());x.setDescripcion(r.descripcion());x.setUsuario(usuarioRepository.findById(r.usuarioId()).orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado")));}
}
