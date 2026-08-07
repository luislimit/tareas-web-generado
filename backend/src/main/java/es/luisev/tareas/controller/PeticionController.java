package es.luisev.tareas.controller;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.*;
import es.luisev.tareas.dto.response.*;
import es.luisev.tareas.service.PeticionService;
@RestController @RequestMapping("/api/peticiones")
public class PeticionController {
 private final PeticionService service; public PeticionController(PeticionService service){this.service=service;}
 @GetMapping public List<PeticionDto> all(){return service.findAll();}
 @GetMapping("/{id}") public PeticionDto one(@PathVariable Long id){return service.findById(id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public PeticionDto create(@Valid @RequestBody PeticionRequest r){return service.create(r);}
 @PutMapping("/{id}") public PeticionDto update(@PathVariable Long id,@Valid @RequestBody PeticionRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
 @PostMapping("/{id}/cambio-estado") public PeticionDto change(@PathVariable Long id,@Valid @RequestBody CambiarEstadoPeticionRequest r){return service.cambiarEstado(id,r);}
 @GetMapping("/{id}/historial") public List<PeticionEstadoDto> history(@PathVariable Long id){return service.historial(id);}
}
