package es.luisev.tareas.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="tipo_documento") @Getter @Setter @NoArgsConstructor
public class TipoDocumento { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String nombre; @Column(nullable=false) private int orden; @Column(nullable=false) private boolean activo; }
