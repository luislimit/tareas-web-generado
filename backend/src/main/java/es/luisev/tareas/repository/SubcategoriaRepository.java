package es.luisev.tareas.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import es.luisev.tareas.entity.Subcategoria;
public interface SubcategoriaRepository extends JpaRepository<Subcategoria,Long> {
 java.util.List<Subcategoria> findByCategoriaIdOrderByNombre(Long categoriaId);
}
