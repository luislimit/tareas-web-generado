package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.Usuario;
public interface UsuarioRepository extends JpaRepository<Usuario,Long> {
}
