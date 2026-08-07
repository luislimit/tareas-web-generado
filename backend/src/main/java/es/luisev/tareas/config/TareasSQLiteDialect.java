package es.luisev.tareas.config;

import org.hibernate.community.dialect.SQLiteDialect;
import org.hibernate.type.SqlTypes;

/**
 * Dialecto SQLite adaptado al esquema físico de Tareas.
 *
 * SQLite utiliza INTEGER para claves, referencias y booleanos, y TEXT para
 * fechas ISO-8601. Estas equivalencias permiten que Hibernate valide el
 * esquema real sin exigir tipos inexistentes o poco apropiados para SQLite.
 */
public class TareasSQLiteDialect extends SQLiteDialect {

    @Override
    protected String columnType(int sqlTypeCode) {
        return switch (sqlTypeCode) {
            case SqlTypes.BIGINT, SqlTypes.BOOLEAN, SqlTypes.TINYINT, SqlTypes.SMALLINT -> "integer";
            case SqlTypes.DATE, SqlTypes.TIME, SqlTypes.TIMESTAMP,
                    SqlTypes.TIMESTAMP_WITH_TIMEZONE, SqlTypes.TIME_WITH_TIMEZONE -> "text";
            default -> super.columnType(sqlTypeCode);
        };
    }
}
