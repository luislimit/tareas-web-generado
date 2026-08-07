package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.TipoDocumento;
public interface TipoDocumentoRepository extends JpaRepository<TipoDocumento,Long> {
}
