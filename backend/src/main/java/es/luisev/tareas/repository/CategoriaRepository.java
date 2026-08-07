package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.Categoria;
public interface CategoriaRepository extends JpaRepository<Categoria,Long> {
 boolean existsByCodigoIgnoreCase(String codigo); boolean existsByNombreIgnoreCase(String nombre);
}
