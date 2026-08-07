package es.luisev.tareas.controller;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.request.TipoDocumentoRequest;
import es.luisev.tareas.dto.response.TipoDocumentoDto;
import es.luisev.tareas.service.TipoDocumentoService;
@RestController
@RequestMapping("/api/tipos-documento")
public class TipoDocumentoController {
 private final TipoDocumentoService service;
 public TipoDocumentoController(TipoDocumentoService service){this.service=service;}
 @GetMapping public List<TipoDocumentoDto> all(){return service.findAll();}
 @GetMapping("/{id}") public TipoDocumentoDto one(@PathVariable Long id){return service.findById(id);}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public TipoDocumentoDto create(@Valid @RequestBody TipoDocumentoRequest r){return service.create(r);}
 @PutMapping("/{id}") public TipoDocumentoDto update(@PathVariable Long id,@Valid @RequestBody TipoDocumentoRequest r){return service.update(id,r);}
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable Long id){service.delete(id);}
}
