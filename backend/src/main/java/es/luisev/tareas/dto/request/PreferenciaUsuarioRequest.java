package es.luisev.tareas.dto.request;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record PreferenciaUsuarioRequest(String ultimaRutaDocumentos,String filtrosPeticiones,String columnasVisibles,String ordenColumnas,String anchoColumnas,String densidad,Long ultimoUsuarioId,Long ultimaPeticionId,String pestanaActiva,String tema) {}
