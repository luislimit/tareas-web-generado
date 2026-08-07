package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.PeticionEstado;
public interface PeticionEstadoRepository extends JpaRepository<PeticionEstado,Long> {
 java.util.List<PeticionEstado> findByPeticionIdOrderByFechaCambioDesc(Long peticionId);
}
