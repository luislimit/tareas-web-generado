package es.luisev.tareas.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
@Entity @Table(name="preferencia_usuario") @Getter @Setter @NoArgsConstructor
public class PreferenciaUsuario { @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id; @OneToOne(fetch=FetchType.LAZY,optional=false) @JoinColumn(name="usuario_id") private Usuario usuario; @Column(name="ultima_ruta_documentos") private String ultimaRutaDocumentos; @Column(name="filtros_peticiones") private String filtrosPeticiones; @Column(name="columnas_visibles") private String columnasVisibles; @Column(name="orden_columnas") private String ordenColumnas; @Column(name="ancho_columnas") private String anchoColumnas; private String densidad; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="ultimo_usuario_id") private Usuario ultimoUsuario; @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="ultima_peticion_id") private Peticion ultimaPeticion; @Column(name="pestana_activa") private String pestanaActiva; private String tema; }
