package es.luisev.tareas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "documento")
@Getter
@Setter
@NoArgsConstructor
public class Documento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "peticion_id", nullable = false)
    private Peticion peticion;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tipo_documento_id", nullable = false)
    private TipoDocumento tipoDocumento;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    /** Imputación de la que proviene el documento, si aplica. */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "imputacion_id")
    private Imputacion imputacion;

    /** Ruta completa + nombre de fichero en un único campo. */
    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(name = "fecha_alta", nullable = false)
    private String fechaAlta;

    /** Compatibilidad con código anterior. La ruta ya está integrada en nombre. */
    @Deprecated
    public String getRuta() {
        return null;
    }

    /** Compatibilidad con código anterior. No persiste ningún campo ruta separado. */
    @Deprecated
    public void setRuta(String ruta) {
        // Intencionadamente vacío: nombre ya contiene la ruta completa.
    }
}
