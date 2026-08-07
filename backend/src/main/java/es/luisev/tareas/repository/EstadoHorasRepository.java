package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.EstadoHoras;
public interface EstadoHorasRepository extends JpaRepository<EstadoHoras,Long> {
}
