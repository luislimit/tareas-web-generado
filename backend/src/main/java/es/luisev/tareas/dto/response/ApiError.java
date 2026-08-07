package es.luisev.tareas.dto.response;
import java.util.Map;
public record ApiError(String code,String message,Map<String,String> fields,String timestamp){}
