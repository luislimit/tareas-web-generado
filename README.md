# Tareas Web — backend REST y base migrada

Este paquete contiene un backend Spring Boot limpio y una base SQLite migrada desde la aplicación Swing.

## Estructura

```text
backend/                 API REST Spring Boot
data/tareas-original.db  copia de la base legacy
data/tareas-dev.db       base migrada utilizada por la API
tools/migrate_legacy.py  migración reproducible
tools/validate_database.py comprobación de integridad y recuentos
```

## Arranque

Desde `backend`:

```powershell
mvn clean test
mvn spring-boot:run
```

La aplicación resuelve de forma explícita la base situada en `../data/tareas-dev.db`.

- API: `http://localhost:8080/api/categorias`
- Swagger: `http://localhost:8080/swagger-ui.html`

## Correspondencia SQLite/JPA

El esquema físico es la fuente de verdad:

- `INTEGER` para identificadores, claves foráneas y booleanos 0/1.
- `TEXT` ISO-8601 para fechas y fechas-hora.
- `NUMERIC` para horas y porcentajes.

`TareasSQLiteDialect` declara estas equivalencias para que `ddl-auto=validate` compruebe el esquema sin exigir `BIGINT`, `BOOLEAN` o tipos de fecha ajenos al diseño SQLite.

## Validación de la base

Desde la raíz:

```powershell
python tools/validate_database.py
```

## Regenerar la base migrada

```powershell
python tools/migrate_legacy.py data/tareas-original.db data/tareas-dev.db
```

## Criterio temporal provisional

Para respetar exactamente el esquema SQLite actual, todas las columnas de fecha almacenadas como `TEXT` se manejan provisionalmente como `String` en entidades, requests y DTOs. La conversión a tipos temporales se incorporará posteriormente en la capa de salida, sin modificar la persistencia.
