package es.luisev.tareas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tipo_hora", uniqueConstraints = {
        @UniqueConstraint(name = "uk_tipo_hora_codigo", columnNames = "codigo"),
        @UniqueConstraint(name = "uk_tipo_hora_nombre", columnNames = "nombre")
})
@Getter
@Setter
@NoArgsConstructor
public class TipoHora {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String codigo;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private int orden;

    @Column(nullable = false)
    private boolean activo = true;

    /**
     * Estado al que debe pasar automáticamente la petición al guardar una
     * imputación de este tipo. Si es null, el tipo de hora no cambia el estado.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estado_peticion_id")
    private EstadoPeticion estadoPeticion;
}
