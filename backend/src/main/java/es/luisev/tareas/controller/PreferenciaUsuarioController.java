package es.luisev.tareas.controller;
import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.PreferenciaUsuarioRequest; import es.luisev.tareas.dto.response.PreferenciaUsuarioDto; import es.luisev.tareas.service.PreferenciaUsuarioService;
@RestController @RequestMapping("/api/usuarios/{usuarioId}/preferencias")
public class PreferenciaUsuarioController {
 private final PreferenciaUsuarioService service; public PreferenciaUsuarioController(PreferenciaUsuarioService service){this.service=service;}
 @GetMapping public PreferenciaUsuarioDto get(@PathVariable Long usuarioId){return service.get(usuarioId);}
 @PutMapping public PreferenciaUsuarioDto update(@PathVariable Long usuarioId,@RequestBody PreferenciaUsuarioRequest r){return service.update(usuarioId,r);}
}
