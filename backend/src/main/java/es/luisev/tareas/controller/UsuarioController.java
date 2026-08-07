package es.luisev.tareas.controller;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.UsuarioRequest;
import es.luisev.tareas.dto.response.UsuarioDto;
import es.luisev.tareas.service.UsuarioService;
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
 private final UsuarioService service;
 public UsuarioController(UsuarioService service){this.service=service;}
 @GetMapping public List<UsuarioDto> all(){return service.findAll();}
 @GetMapping("/{id}") public UsuarioDto one(@PathVariable Long id){return service.findById(id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public UsuarioDto create(@Valid @RequestBody UsuarioRequest r){return service.create(r);}
 @PutMapping("/{id}") public UsuarioDto update(@PathVariable Long id,@Valid @RequestBody UsuarioRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
