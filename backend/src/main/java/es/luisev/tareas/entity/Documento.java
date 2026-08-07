package es.luisev.tareas.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="documento") @Getter @Setter @NoArgsConstructor
public class Documento { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="peticion_id") private Peticion peticion; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="tipo_documento_id") private TipoDocumento tipoDocumento; @Column(nullable=false) private String nombre; @Column(nullable=false) private String ruta; private String descripcion; @Column(name="fecha_alta",nullable=false) private String fechaAlta; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="usuario_id") private Usuario usuario; }
