#!/usr/bin/env python3
from pathlib import Path
import sqlite3
import sys

EXPECTED = {
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
    "preferencia_usuario": 1,
}

def main(path: Path) -> int:
    db = sqlite3.connect(path)
    integrity = db.execute("PRAGMA integrity_check").fetchone()[0]
    foreign_keys = db.execute("PRAGMA foreign_key_check").fetchall()
    print(f"integrity_check: {integrity}")
    print(f"foreign_key_check: {len(foreign_keys)} incidencias")
    ok = integrity == "ok" and not foreign_keys
    for table, expected in EXPECTED.items():
        actual = db.execute(f"SELECT COUNT(*) FROM {table}").fetchone()[0]
        print(f"{table}: {actual}")
        ok = ok and actual == expected
    db.close()
    return 0 if ok else 1

if __name__ == "__main__":
    target = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("data/tareas-dev.db")
    raise SystemExit(main(target))
