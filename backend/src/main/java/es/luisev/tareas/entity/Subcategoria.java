package es.luisev.tareas.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="subcategoria") @Getter @Setter @NoArgsConstructor
public class Subcategoria { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @ManyToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="categoria_id") private Categoria categoria; @Column(nullable=false) private String codigo; @Column(nullable=false) private String nombre; @Column(nullable=false) private boolean activo; @Column(name="fecha_alta",nullable=false) private String fechaAlta; }
