package es.luisev.tareas.controller;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.SubcategoriaRequest;
import es.luisev.tareas.dto.response.SubcategoriaDto;
import es.luisev.tareas.service.SubcategoriaService;
@RestController
@RequestMapping("/api/subcategorias")
public class SubcategoriaController {
 private final SubcategoriaService service;
 public SubcategoriaController(SubcategoriaService service){this.service=service;}
 @GetMapping public List<SubcategoriaDto> all(){return service.findAll();}
 @GetMapping("/{id}") public SubcategoriaDto one(@PathVariable Long id){return service.findById(id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public SubcategoriaDto create(@Valid @RequestBody SubcategoriaRequest r){return service.create(r);}
 @PutMapping("/{id}") public SubcategoriaDto update(@PathVariable Long id,@Valid @RequestBody SubcategoriaRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
