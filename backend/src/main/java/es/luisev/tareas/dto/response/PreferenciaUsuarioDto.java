package es.luisev.tareas.dto.response;
import java.math.BigDecimal;
public record PreferenciaUsuarioDto(Long id,Long usuarioId,String ultimaRutaDocumentos,String filtrosPeticiones,String columnasVisibles,String ordenColumnas,String anchoColumnas,String densidad,Long ultimoUsuarioId,Long ultimaPeticionId,String pestanaActiva,String tema) {}
