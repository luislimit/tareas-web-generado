package es.luisev.tareas.controller;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.CategoriaRequest;
import es.luisev.tareas.dto.response.CategoriaDto;
import es.luisev.tareas.service.CategoriaService;
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {
 private final CategoriaService service;
 public CategoriaController(CategoriaService service){this.service=service;}
 @GetMapping public List<CategoriaDto> all(){return service.findAll();}
 @GetMapping("/{id}") public CategoriaDto one(@PathVariable Long id){return service.findById(id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public CategoriaDto create(@Valid @RequestBody CategoriaRequest r){return service.create(r);}
 @PutMapping("/{id}") public CategoriaDto update(@PathVariable Long id,@Valid @RequestBody CategoriaRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
