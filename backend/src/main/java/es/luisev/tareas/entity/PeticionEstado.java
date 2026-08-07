package es.luisev.tareas.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="peticion_estado") @Getter @Setter @NoArgsConstructor
public class PeticionEstado { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="peticion_id") private Peticion peticion; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="estado_anterior_id") private EstadoPeticion estadoAnterior; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="estado_nuevo_id") private EstadoPeticion estadoNuevo; @Column(name="fecha_cambio",nullable=false) private String fechaCambio; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="usuario_id") private Usuario usuario; @Column(nullable=false) private String observaciones; }
