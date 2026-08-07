# Informe de migración

La base `tareas.db` se transformó en `data/tareas-dev.db`.

## Validaciones

- Integridad SQLite: `ok`.
- Incidencias de claves foráneas: `0`.
- Tablas `tt_*`: eliminadas.
- Fechas: convertidas de `yyyyMMdd` a ISO-8601.
- Booleanos: convertidos de `S/N` a `0/1`.
- Imputaciones: eliminados estado de petición y estado previo; se asignó `PENDIENTE` como estado administrativo inicial.
- Historial: creado un estado inicial por cada petición.
- Documentos: separados `nombre` y `ruta`.

## Recuentos

```json
{
  "categoria": 5,
  "subcategoria": 12,
  "estado_peticion": 6,
  "estado_horas": 5,
  "usuario": 1,
  "tipo_documento": 6,
  "peticion": 63,
  "peticion_estado": 63,
  "imputacion": 274,
  "documento": 3,
  "preferencia_usuario": 1
}
```
