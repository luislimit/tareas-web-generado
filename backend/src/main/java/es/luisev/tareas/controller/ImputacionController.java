package es.luisev.tareas.controller;
import java.util.List; import jakarta.validation.Valid; import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.ImputacionRequest; import es.luisev.tareas.dto.response.ImputacionDto; import es.luisev.tareas.service.ImputacionService;
@RestController @RequestMapping("/api/imputaciones")
public class ImputacionController {
 private final ImputacionService service; public ImputacionController(ImputacionService service){this.service=service;}
 @GetMapping public List<ImputacionDto> all(){return service.all();}
 @GetMapping(params="peticionId") public List<ImputacionDto> byPeticion(@RequestParam Long peticionId){return service.byPeticion(peticionId);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public ImputacionDto create(@Valid @RequestBody ImputacionRequest r){return service.create(r);}
 @PutMapping("/{id}") public ImputacionDto update(@PathVariable Long id,@Valid @RequestBody ImputacionRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
