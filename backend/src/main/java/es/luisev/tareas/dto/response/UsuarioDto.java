package es.luisev.tareas.dto.response;
import java.math.BigDecimal;
public record UsuarioDto(Long id,String codigo,String nombre,String email,boolean activo) {}
