package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.Documento;
public interface DocumentoRepository extends JpaRepository<Documento,Long> {
 java.util.List<Documento> findByPeticionIdOrderByFechaAltaDesc(Long peticionId);
}
