package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.Imputacion;
public interface ImputacionRepository extends JpaRepository<Imputacion,Long> {
 java.util.List<Imputacion> findByPeticionIdOrderByFechaDesc(Long peticionId);
}
