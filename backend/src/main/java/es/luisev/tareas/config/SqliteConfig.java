package es.luisev.tareas.config;
import javax.sql.DataSource;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
@Component
public class SqliteConfig implements ApplicationRunner {
 private final DataSource dataSource;
 public SqliteConfig(DataSource dataSource){this.dataSource=dataSource;}
 public void run(ApplicationArguments args) throws Exception {try(var c=dataSource.getConnection();var s=c.createStatement()){s.execute("PRAGMA foreign_keys=ON");s.execute("PRAGMA journal_mode=WAL");s.execute("PRAGMA busy_timeout=5000");}}
}
