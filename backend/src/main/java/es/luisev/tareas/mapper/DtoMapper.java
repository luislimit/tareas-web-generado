package es.luisev.tareas.mapper;
import org.springframework.stereotype.Component;
import es.luisev.tareas.entity.*;
import es.luisev.tareas.dto.response.*;

@Component
public class DtoMapper { 
 public CategoriaDto categoria(Categoria x)
 {return new CategoriaDto(x.getId(),x.getCodigo(),x.getNombre(),x.isActivo(),x.getFechaAlta());}
 public SubcategoriaDto subcategoria(Subcategoria x){return new SubcategoriaDto(x.getId(),x.getCategoria().getId(),x.getCategoria().getNombre(),x.getCodigo(),x.getNombre(),x.isActivo(),x.getFechaAlta());}
 public EstadoPeticionDto estadoPeticion(EstadoPeticion x){return new EstadoPeticionDto(x.getId(),x.getCodigo(),x.getNombre(),x.getColor(),x.getOrden(),x.isActivo(),x.isEstadoFinal());}
 public EstadoHorasDto estadoHoras(EstadoHoras x){return new EstadoHorasDto(x.getId(),x.getCodigo(),x.getNombre(),x.getColor(),x.getOrden(),x.isActivo(),x.isEstadoFinal());}
 public UsuarioDto usuario(Usuario x){return new UsuarioDto(x.getId(),x.getCodigo(),x.getNombre(),x.getEmail(),x.isActivo());}
 public TipoDocumentoDto tipoDocumento(TipoDocumento x){return new TipoDocumentoDto(x.getId(),x.getNombre(),x.getOrden(),x.isActivo());}
 public PeticionDto peticion(Peticion x){return new PeticionDto(x.getId(),x.getCodigo(),x.getAsunto(),x.getDescripcion(),x.getCategoria().getId(),x.getCategoria().getNombre(),x.getSubcategoria().getId(),x.getSubcategoria().getNombre(),x.getUsuario().getId(),x.getUsuario().getNombre(),x.getEstadoActual().getId(),x.getEstadoActual().getNombre(),x.getFechaAlta(),x.getFechaInicioPrevista(),x.getFechaFinPrevista(),x.getFechaInicioReal(),x.getFechaFinReal(),x.getHorasPrevistas(),x.getHorasReales(),x.getPorcentaje(),x.getRutaDocumentos(),x.isActivo());}
 public PeticionEstadoDto peticionEstado(PeticionEstado x){return new PeticionEstadoDto(x.getId(),x.getPeticion().getId(),x.getEstadoAnterior()==null?null:x.getEstadoAnterior().getId(),x.getEstadoAnterior()==null?null:x.getEstadoAnterior().getNombre(),x.getEstadoNuevo().getId(),x.getEstadoNuevo().getNombre(),x.getFechaCambio(),x.getUsuario().getId(),x.getUsuario().getNombre(),x.getObservaciones());}
 public ImputacionDto imputacion(Imputacion x){return new ImputacionDto(x.getId(),x.getPeticion().getId(),x.getPeticion().getCodigo(),x.getUsuario().getId(),x.getUsuario().getNombre(),x.getFecha(),x.getHoras(),x.isExtra(),x.getEstadoHoras().getId(),x.getEstadoHoras().getNombre(),x.getDescripcion(),x.getFechaAlta());}
 public DocumentoDto documento(Documento x){return new DocumentoDto(x.getId(),x.getPeticion().getId(),x.getPeticion().getCodigo(),x.getTipoDocumento().getId(),x.getTipoDocumento().getNombre(),x.getNombre(),x.getRuta(),x.getDescripcion(),x.getFechaAlta(),x.getUsuario().getId(),x.getUsuario().getNombre());}
 public PreferenciaUsuarioDto preferencia(PreferenciaUsuario x){return new PreferenciaUsuarioDto(x.getId(),x.getUsuario().getId(),x.getUltimaRutaDocumentos(),x.getFiltrosPeticiones(),x.getColumnasVisibles(),x.getOrdenColumnas(),x.getAnchoColumnas(),x.getDensidad(),x.getUltimoUsuario()==null?null:x.getUltimoUsuario().getId(),x.getUltimaPeticion()==null?null:x.getUltimaPeticion().getId(),x.getPestanaActiva(),x.getTema());}
}
