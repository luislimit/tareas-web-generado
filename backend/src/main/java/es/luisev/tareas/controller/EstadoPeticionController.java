package es.luisev.tareas.controller;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.EstadoPeticionRequest;
import es.luisev.tareas.dto.response.EstadoPeticionDto;
import es.luisev.tareas.service.EstadoPeticionService;
@RestController
@RequestMapping("/api/estados")
public class EstadoPeticionController {
 private final EstadoPeticionService service;
 public EstadoPeticionController(EstadoPeticionService service){this.service=service;}
 @GetMapping public List<EstadoPeticionDto> all(){return service.findAll();}
 @GetMapping("/{id}") public EstadoPeticionDto one(@PathVariable Long id){return service.findById(id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public EstadoPeticionDto create(@Valid @RequestBody EstadoPeticionRequest r){return service.create(r);}
 @PutMapping("/{id}") public EstadoPeticionDto update(@PathVariable Long id,@Valid @RequestBody EstadoPeticionRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
