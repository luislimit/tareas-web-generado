package es.luisev.tareas.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="usuario") @Getter @Setter @NoArgsConstructor
public class Usuario { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String codigo; @Column(nullable=false) private String nombre; private String email; @Column(nullable=false) private boolean activo; }
