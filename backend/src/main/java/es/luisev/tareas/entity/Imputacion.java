package es.luisev.tareas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "imputacion")
@Getter
@Setter
@NoArgsConstructor
public class Imputacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "peticion_id", nullable = false)
    private Peticion peticion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private String fecha;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal horas;

    @Column(nullable = false)
    private boolean extra;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "estado_horas_id", nullable = false)
    private EstadoHoras estadoHoras;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tipo_hora_id", nullable = false)
    private TipoHora tipoHora;

    private String descripcion;

    @Column(name = "fecha_alta", nullable = false)
    private String fechaAlta;
}
