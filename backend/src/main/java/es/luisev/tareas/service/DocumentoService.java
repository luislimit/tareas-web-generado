package es.luisev.tareas.service;

import es.luisev.tareas.dto.request.DocumentoRequest;
import es.luisev.tareas.dto.response.DocumentoDto;
import es.luisev.tareas.entity.Documento;
import es.luisev.tareas.entity.Imputacion;
import es.luisev.tareas.repository.DocumentoRepository;
import es.luisev.tareas.repository.ImputacionRepository;
import es.luisev.tareas.repository.PeticionRepository;
import es.luisev.tareas.repository.TipoDocumentoRepository;
import es.luisev.tareas.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class DocumentoService {
    private final DocumentoRepository repository;
    private final PeticionRepository peticionRepository;
    private final TipoDocumentoRepository tipoDocumentoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ImputacionRepository imputacionRepository;

    public DocumentoService(DocumentoRepository repository,
                            PeticionRepository peticionRepository,
                            TipoDocumentoRepository tipoDocumentoRepository,
                            UsuarioRepository usuarioRepository,
                            ImputacionRepository imputacionRepository) {
        this.repository = repository;
        this.peticionRepository = peticionRepository;
        this.tipoDocumentoRepository = tipoDocumentoRepository;
        this.usuarioRepository = usuarioRepository;
        this.imputacionRepository = imputacionRepository;
    }

    public List<DocumentoDto> all() {
        return repository.findAll().stream().map(this::toDto).toList();
    }

    public List<DocumentoDto> byPeticion(Long peticionId) {
        return repository.findAll().stream()
                .filter(x -> x.getPeticion() != null && peticionId.equals(x.getPeticion().getId()))
                .map(this::toDto)
                .toList();
    }

    @Transactional
    public DocumentoDto create(DocumentoRequest r) {
        Documento x = new Documento();
        apply(x, r);
        x.setFechaAlta(LocalDateTime.now().toString());
        return toDto(repository.save(x));
    }

    @Transactional
    public DocumentoDto update(Long id, DocumentoRequest r) {
        Documento x = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento no encontrado"));
        apply(x, r);
        return toDto(repository.save(x));
    }

    public void abrir(Long id) {
        Documento documento = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento no encontrado"));

        String nombre = documento.getNombre();
        if (nombre == null || nombre.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El documento no tiene fichero informado");
        }

        Path path = Path.of(nombre.trim());
        if (!path.isAbsolute()) {
            String rutaPeticion = documento.getPeticion().getRutaDocumentos();
            if (rutaPeticion == null || rutaPeticion.isBlank()) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El fichero no contiene una ruta absoluta y la petición no tiene ruta de documentos");
            }
            path = Path.of(rutaPeticion.trim()).resolve(path);
        }
        path = path.normalize();

        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No se encuentra el fichero: " + path);
        }

        try {
            File file = path.toFile();
            if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.OPEN)) {
                Desktop.getDesktop().open(file);
                return;
            }
            if (System.getProperty("os.name", "").toLowerCase().contains("win")) {
                new ProcessBuilder("explorer.exe", file.getAbsolutePath()).start();
                return;
            }
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "El servidor no dispone de una aplicación de escritorio para abrir el fichero");
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "No se ha podido abrir el fichero: " + path, e);
        }
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Documento no encontrado");
        }
        repository.deleteById(id);
    }

    private void apply(Documento x, DocumentoRequest r) {
        x.setPeticion(peticionRepository.findById(r.peticionId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Petición no encontrada")));
        x.setTipoDocumento(tipoDocumentoRepository.findById(r.tipoDocumentoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de documento no encontrado")));
        x.setUsuario(usuarioRepository.findById(r.usuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario no encontrado")));
        x.setImputacion(resolveImputacion(r.imputacionId(), r.peticionId()));
        x.setNombre(r.nombre().trim());
        x.setDescripcion(r.descripcion());
    }

    private Imputacion resolveImputacion(Long imputacionId, Long peticionId) {
        if (imputacionId == null) return null;
        Imputacion imputacion = imputacionRepository.findById(imputacionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Imputación no encontrada"));
        if (!imputacion.getPeticion().getId().equals(peticionId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "La imputación no pertenece a la petición del documento");
        }
        return imputacion;
    }

    private DocumentoDto toDto(Documento x) {
        return new DocumentoDto(
                x.getId(),
                x.getPeticion().getId(),
                x.getPeticion().getCodigo(),
                x.getTipoDocumento().getId(),
                x.getTipoDocumento().getNombre(),
                x.getNombre(),
                x.getDescripcion(),
                x.getFechaAlta(),
                x.getUsuario().getId(),
                x.getUsuario().getNombre(),
                x.getImputacion() == null ? null : x.getImputacion().getId()
        );
    }
}
