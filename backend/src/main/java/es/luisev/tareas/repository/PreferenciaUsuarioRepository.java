package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.PreferenciaUsuario;
public interface PreferenciaUsuarioRepository extends JpaRepository<PreferenciaUsuario,Long> {
 java.util.Optional<PreferenciaUsuario> findByUsuarioId(Long usuarioId);
}
