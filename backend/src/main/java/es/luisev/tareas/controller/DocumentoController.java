package es.luisev.tareas.controller;
import java.util.List; import jakarta.validation.Valid; import org.springframework.http.*; import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.DocumentoRequest; import es.luisev.tareas.dto.response.DocumentoDto; import es.luisev.tareas.service.DocumentoService;
@RestController @RequestMapping("/api/documentos")
public class DocumentoController {
 private final DocumentoService service; public DocumentoController(DocumentoService service){this.service=service;}
 @GetMapping public List<DocumentoDto> all(){return service.all();}
 @GetMapping(params="peticionId") public List<DocumentoDto> byPeticion(@RequestParam Long peticionId){return service.byPeticion(peticionId);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public DocumentoDto create(@Valid @RequestBody DocumentoRequest r){return service.create(r);}
 @PutMapping("/{id}") public DocumentoDto update(@PathVariable Long id,@Valid @RequestBody DocumentoRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
