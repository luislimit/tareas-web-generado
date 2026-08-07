package es.luisev.tareas.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="categoria") @Getter @Setter @NoArgsConstructor
public class Categoria { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String codigo; @Column(nullable=false) private String nombre; @Column(nullable=false) private boolean activo; @Column(name="fecha_alta",nullable=false) private String fechaAlta; }
