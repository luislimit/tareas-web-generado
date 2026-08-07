package es.luisev.tareas.exception;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import es.luisev.tareas.dto.response.ApiError;
@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(ResourceNotFoundException.class)
 ResponseEntity<ApiError> notFound(ResourceNotFoundException ex){return ResponseEntity.status(404).body(new ApiError("RECURSO_NO_ENCONTRADO",ex.getMessage(),Map.of(),java.time.LocalDateTime.now().toString()));}
 @ExceptionHandler(BusinessException.class)
 ResponseEntity<ApiError> business(BusinessException ex){return ResponseEntity.badRequest().body(new ApiError(ex.getCode(),ex.getMessage(),Map.of(),java.time.LocalDateTime.now().toString()));}
 @ExceptionHandler(MethodArgumentNotValidException.class)
 ResponseEntity<ApiError> validation(MethodArgumentNotValidException ex){Map<String,String> f=new LinkedHashMap<>();ex.getBindingResult().getFieldErrors().forEach(e->f.put(e.getField(),e.getDefaultMessage()));return ResponseEntity.badRequest().body(new ApiError("VALIDACION", "Datos no válidos",f,java.time.LocalDateTime.now().toString()));}
}
