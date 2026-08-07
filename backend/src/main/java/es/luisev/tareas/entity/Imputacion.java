package es.luisev.tareas.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="imputacion") @Getter @Setter @NoArgsConstructor
public class Imputacion { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="peticion_id") private Peticion peticion; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="usuario_id") private Usuario usuario; @Column(nullable=false) private String fecha; @Column(nullable=false) private BigDecimal horas; @Column(nullable=false) private boolean extra; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="estado_horas_id") private EstadoHoras estadoHoras; private String descripcion; @Column(name="fecha_alta",nullable=false) private String fechaAlta; }
