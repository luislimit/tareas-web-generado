package es.luisev.tareas.dto.response;
import java.math.BigDecimal;
public record DocumentoDto(Long id,Long peticionId,String peticionCodigo,Long tipoDocumentoId,String tipoDocumentoNombre,String nombre,String ruta,String descripcion,String fechaAlta,Long usuarioId,String usuarioNombre) {}
