-- Tareas Web
-- Estado de petición automático por tipo de hora y trazabilidad desde imputación.
-- Requiere haber aplicado V008__tipo_horas_y_documento_nombre.sql.
-- Realizar copia de seguridad antes de ejecutar.

PRAGMA foreign_keys = ON;
BEGIN TRANSACTION;

-- Estado opcional al que debe pasar la petición al guardar una imputación
-- con este tipo de hora. NULL = no modificar el estado de la petición.
ALTER TABLE tipo_hora
    ADD COLUMN estado_peticion_id INTEGER REFERENCES estado_peticion(id);

-- Imputación de origen opcional de un documento.
-- Si se elimina la imputación, el documento se conserva y pierde únicamente el vínculo.
ALTER TABLE documento
    ADD COLUMN imputacion_id INTEGER REFERENCES imputacion(id) ON DELETE SET NULL;

-- Imputación de origen opcional de un cambio de estado.
-- Si se elimina la imputación, el histórico se conserva y pierde únicamente el vínculo.
ALTER TABLE peticion_estado
    ADD COLUMN imputacion_id INTEGER REFERENCES imputacion(id) ON DELETE SET NULL;

CREATE INDEX idx_tipo_hora_estado_peticion ON tipo_hora(estado_peticion_id);
CREATE INDEX idx_documento_imputacion ON documento(imputacion_id);
CREATE INDEX idx_peticion_estado_imputacion ON peticion_estado(imputacion_id);

COMMIT;
