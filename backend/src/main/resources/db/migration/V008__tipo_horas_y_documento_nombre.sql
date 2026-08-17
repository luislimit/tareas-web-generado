-- Tareas Web - Tipo de horas + unificación de nombre/ruta de documento
-- Ejecutar sobre la BD de la versión web (tablas: tipo_hora, imputacion, documento).
-- Realizar copia de seguridad antes de ejecutar.
PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

CREATE TABLE tipo_hora (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    nombre TEXT NOT NULL UNIQUE,
    orden INTEGER NOT NULL DEFAULT 0,
    activo INTEGER NOT NULL DEFAULT 1
);

INSERT INTO tipo_hora (codigo, nombre, orden, activo) VALUES
('DESARROLLO', 'Desarrollo', 10, 1),
('ESTIMACION',  'Estimación', 20, 1),
('PRUEBAS',     'Pruebas', 30, 1),
('REUNION',     'Reunión', 40, 1),
('INSTALACION', 'Instalación', 50, 1);

ALTER TABLE imputacion ADD COLUMN tipo_hora_id INTEGER;
UPDATE imputacion
SET tipo_hora_id = (SELECT id FROM tipo_hora WHERE codigo = 'DESARROLLO')
WHERE tipo_hora_id IS NULL;

-- SQLite no permite convertir con ALTER COLUMN a NOT NULL ni eliminar una columna
-- de forma portable. Se recrea documento y se concatena ruta + nombre.
CREATE TABLE documento_nuevo (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    peticion_id INTEGER NOT NULL,
    tipo_documento_id INTEGER NOT NULL,
    usuario_id INTEGER NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    fecha_alta TEXT NOT NULL,
    FOREIGN KEY (peticion_id) REFERENCES peticion(id),
    FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documento(id),
    FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

INSERT INTO documento_nuevo (id, peticion_id, tipo_documento_id, usuario_id, nombre, descripcion, fecha_alta)
SELECT id,
       peticion_id,
       tipo_documento_id,
       usuario_id,
       CASE
           WHEN ruta IS NULL OR TRIM(ruta) = '' THEN nombre
           WHEN nombre IS NULL OR TRIM(nombre) = '' THEN ruta
           WHEN substr(ruta, -1, 1) IN ('/', '\\') THEN ruta || nombre
           ELSE ruta || '\\' || nombre
       END,
       descripcion,
       fecha_alta
FROM documento;

DROP TABLE documento;
ALTER TABLE documento_nuevo RENAME TO documento;

CREATE INDEX idx_imputacion_tipo_hora ON imputacion(tipo_hora_id);
CREATE INDEX idx_documento_peticion ON documento(peticion_id);

COMMIT;
PRAGMA foreign_keys = ON;
