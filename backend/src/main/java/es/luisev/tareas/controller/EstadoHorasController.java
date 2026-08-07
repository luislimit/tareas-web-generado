package es.luisev.tareas.controller;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.EstadoHorasRequest;
import es.luisev.tareas.dto.response.EstadoHorasDto;
import es.luisev.tareas.service.EstadoHorasService;
@RestController
@RequestMapping("/api/estados-horas")
public class EstadoHorasController {
 private final EstadoHorasService service;
 public EstadoHorasController(EstadoHorasService service){this.service=service;}
 @GetMapping public List<EstadoHorasDto> all(){return service.findAll();}
 @GetMapping("/{id}") public EstadoHorasDto one(@PathVariable Long id){return service.findById(id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public EstadoHorasDto create(@Valid @RequestBody EstadoHorasRequest r){return service.create(r);}
 @PutMapping("/{id}") public EstadoHorasDto update(@PathVariable Long id,@Valid @RequestBody EstadoHorasRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
