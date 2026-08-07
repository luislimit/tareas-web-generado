package es.luisev.tareas.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="estado_horas") @Getter @Setter @NoArgsConstructor
public class EstadoHoras { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @Column(nullable=false) private String codigo; @Column(nullable=false) private String nombre; private String color; @Column(nullable=false) private int orden; @Column(nullable=false) private boolean activo; @Column(name="estado_final",nullable=false) private boolean estadoFinal; }
