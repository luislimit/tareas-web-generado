package es.luisev.tareas.controller;

import es.luisev.tareas.dto.request.TipoHoraRequest;
import es.luisev.tareas.dto.response.TipoHoraDto;
import es.luisev.tareas.service.TipoHoraService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tipos-hora")
@RequiredArgsConstructor
public class TipoHoraController {
    private final TipoHoraService service;

    @GetMapping
    public List<TipoHoraDto> all() { return service.findAll(); }

    @GetMapping("/{id}")
    public TipoHoraDto one(@PathVariable Long id) { return service.findById(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TipoHoraDto create(@Valid @RequestBody TipoHoraRequest request) { return service.create(request); }

    @PutMapping("/{id}")
    public TipoHoraDto update(@PathVariable Long id, @Valid @RequestBody TipoHoraRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) { service.delete(id); }
}
