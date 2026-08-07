package es.luisev.tareas.service;
import org.springframework.stereotype.Service; import org.springframework.transaction.annotation.Transactional;
import es.luisev.tareas.dto.request.PreferenciaUsuarioRequest; import es.luisev.tareas.dto.response.PreferenciaUsuarioDto; import es.luisev.tareas.entity.PreferenciaUsuario; import es.luisev.tareas.exception.ResourceNotFoundException; import es.luisev.tareas.mapper.DtoMapper; import es.luisev.tareas.repository.*;
@Service @Transactional
public class PreferenciaUsuarioService {
 private final PreferenciaUsuarioRepository repository; private final UsuarioRepository usuarioRepository; private final PeticionRepository peticionRepository; private final DtoMapper mapper;
 public PreferenciaUsuarioService(PreferenciaUsuarioRepository repository,UsuarioRepository usuarioRepository,PeticionRepository peticionRepository,DtoMapper mapper){this.repository=repository;this.usuarioRepository=usuarioRepository;this.peticionRepository=peticionRepository;this.mapper=mapper;}
 @Transactional(readOnly=true) public PreferenciaUsuarioDto get(Long usuarioId){return mapper.preferencia(entity(usuarioId));}
 public PreferenciaUsuarioDto update(Long usuarioId,PreferenciaUsuarioRequest r){PreferenciaUsuario x=entity(usuarioId);x.setUltimaRutaDocumentos(r.ultimaRutaDocumentos());x.setFiltrosPeticiones(r.filtrosPeticiones());x.setColumnasVisibles(r.columnasVisibles());x.setOrdenColumnas(r.ordenColumnas());x.setAnchoColumnas(r.anchoColumnas());x.setDensidad(r.densidad());x.setUltimoUsuario(r.ultimoUsuarioId()==null?null:usuarioRepository.findById(r.ultimoUsuarioId()).orElseThrow(()->new ResourceNotFoundException("Usuario no encontrado")));x.setUltimaPeticion(r.ultimaPeticionId()==null?null:peticionRepository.findById(r.ultimaPeticionId()).orElseThrow(()->new ResourceNotFoundException("Petición no encontrada")));x.setPestanaActiva(r.pestanaActiva());x.setTema(r.tema());return mapper.preferencia(repository.save(x));}
 private PreferenciaUsuario entity(Long usuarioId){return repository.findByUsuarioId(usuarioId).orElseThrow(()->new ResourceNotFoundException("Preferencias no encontradas"));}
}
