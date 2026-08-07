package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.Peticion;
public interface PeticionRepository extends JpaRepository<Peticion,Long> {
}
