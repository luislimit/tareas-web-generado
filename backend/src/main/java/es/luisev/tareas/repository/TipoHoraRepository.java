package es.luisev.tareas.repository;

import es.luisev.tareas.entity.TipoHora;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoHoraRepository extends JpaRepository<TipoHora, Long> {
    boolean existsByCodigoIgnoreCase(String codigo);
    boolean existsByNombreIgnoreCase(String nombre);
    Optional<TipoHora> findByCodigoIgnoreCase(String codigo);
}
