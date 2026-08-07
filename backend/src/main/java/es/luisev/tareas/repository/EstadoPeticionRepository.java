package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.EstadoPeticion;
public interface EstadoPeticionRepository extends JpaRepository<EstadoPeticion,Long> {
}
