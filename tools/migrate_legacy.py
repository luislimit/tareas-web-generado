#!/usr/bin/env python3
"""Migra la base SQLite legacy de Tareas al esquema web."""
from pathlib import Path
import argparse, sqlite3, re

def iso(value, timestamp=False):
    if value is None or str(value).strip()=="":
        return None
    value=str(value)
    if re.fullmatch(r"\d{8}",value):
        result=f"{value[:4]}-{value[4:6]}-{value[6:8]}"
        return result+"T00:00:00" if timestamp else result
    return value

def migrate(source: Path, target: Path, schema_file: Path):
    if target.exists():
        target.unlink()
    legacy=sqlite3.connect(source)
    db=sqlite3.connect(target)
    db.executescript(schema_file.read_text(encoding="utf-8"))
    with db:
        db.executemany("insert into categoria values(?,?,?,?,?)",
            [(i,c,n,1,iso(f,True)) for i,c,n,f in legacy.execute("select id,codigo,nombre,fec_alta from t_categoria")])
        db.executemany("insert into subcategoria values(?,?,?,?,?,?)",
            [(i,cat,c,n,1,iso(f,True)) for i,cat,c,n,f in legacy.execute("select id,id_categoria,codigo,nombre,fec_alta from t_subcategoria")])
        for i,n,color in legacy.execute("select id,nombre,color from t_estado order by id"):
            code=re.sub(r"[^A-Z0-9]+","_",n.upper().replace("Ó","O")).strip("_")
            db.execute("insert into estado_peticion values(?,?,?,?,?,?,?)",
                (i,code,n,color,i,1,1 if n.lower() in ("finalizada","cancelada") else 0))
        db.executemany("insert into estado_horas values(?,?,?,?,?,?,?)",[
            (1,"PENDIENTE","Pendiente","#64748B",1,1,0),
            (2,"APROBADA","Aprobada","#16A34A",2,1,0),
            (3,"FACTURADA","Facturada","#2563EB",3,1,1),
            (4,"RECHAZADA","Rechazada","#DC2626",4,1,1),
            (5,"NO_FACTURABLE","No facturable","#7C3AED",5,1,1)])
        db.executemany("insert into usuario values(?,?,?,?,?)",
            [(i,c,c,e,1) for i,c,e in legacy.execute("select id,codigo,email from t_usuario")])
        db.executemany("insert into tipo_documento values(?,?,?,?)",
            [(i,n,i,1) for i,n in legacy.execute("select id,nombre from t_tipodocumento")])
        query="""select id,codigo,asunto,descripcion,id_categoria,id_subcategoria,id_usuario,id_estado,
        fec_alta,fec_prevista_inicio,fec_prevista_fin,fec_real_inicio,fec_real_fin,
        horas_prevista,horas_real,porcentaje from t_peticion"""
        for r in legacy.execute(query):
            db.execute("insert into peticion values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                (r[0],r[1],r[2],r[3],r[4],r[5],r[6],r[7],iso(r[8],True),iso(r[9]),iso(r[10]),
                 iso(r[11]),iso(r[12]),r[13],r[14] or 0,r[15] or 0,None,1))
            db.execute("""insert into peticion_estado
                (peticion_id,estado_anterior_id,estado_nuevo_id,fecha_cambio,usuario_id,observaciones)
                values(?,?,?,?,?,?)""",
                (r[0],None,r[7],iso(r[8],True),r[6],"Estado inicial importado desde la aplicación anterior"))
        rows=legacy.execute("""select id,id_peticion,id_usuario,fecha,horas_real,extra,descripcion,fec_alta
            from t_imputacion where horas_real>0""")
        db.executemany("insert into imputacion values(?,?,?,?,?,?,?,?,?)",
            [(i,p,u,iso(f),h,1 if str(extra).upper()=="S" else 0,1,d,iso(fa,True))
             for i,p,u,f,h,extra,d,fa in rows])
        for i,p,t,path,desc,created,u in legacy.execute(
                "select id,id_peticion,id_tipodocumento,fichero,descripcion,fec_alta,id_usuario from t_documento"):
            name=re.split(r"[\\\\/]",path or "")[-1] or (path or "")
            db.execute("insert into documento values(?,?,?,?,?,?,?,?)",
                (i,p,t,name,path,desc,iso(created,True),u))
        db.executemany("insert into preferencia_usuario(usuario_id) values(?)",
            [(row[0],) for row in db.execute("select id from usuario")])
    integrity=db.execute("pragma integrity_check").fetchone()[0]
    fk=db.execute("pragma foreign_key_check").fetchall()
    legacy.close(); db.close()
    if integrity!="ok" or fk:
        raise RuntimeError(f"Migración inválida: integrity={integrity}, foreign_keys={fk}")
    print(f"Migración completada: {target}")

if __name__=="__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("source",type=Path)
    parser.add_argument("target",type=Path)
    parser.add_argument("--schema",type=Path,default=Path("backend/src/main/resources/db/migration/V001__esquema_base.sql"))
    args=parser.parse_args()
    migrate(args.source,args.target,args.schema)
