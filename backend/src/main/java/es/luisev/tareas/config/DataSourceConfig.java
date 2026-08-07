package es.luisev.tareas.config;

import java.nio.file.Files;
import java.nio.file.Path;

import javax.sql.DataSource;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration
public class DataSourceConfig {

    @Bean
    public DataSource dataSource() {
        Path databasePath = Path.of(System.getProperty("user.dir"), "..", "data", "tareas-dev.db")
                .normalize()
                .toAbsolutePath();

        if (!Files.isRegularFile(databasePath)) {
            throw new IllegalStateException("No se encuentra la base de datos SQLite en: " + databasePath);
        }

        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.sqlite.JDBC");
        config.setJdbcUrl("jdbc:sqlite:" + databasePath.toString().replace('\\', '/'));
        config.setMinimumIdle(1);
        config.setMaximumPoolSize(2);
        config.setConnectionTimeout(5000);
        config.setPoolName("TareasSQLitePool");
        config.addDataSourceProperty("foreign_keys", "true");
        config.addDataSourceProperty("busy_timeout", "5000");

        return new HikariDataSource(config);
    }
}
