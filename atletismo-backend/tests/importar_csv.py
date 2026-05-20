import csv
import sys
import os
from datetime import datetime, date

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models.atleta import Atleta
from app.models.marca import Marca
from app.models.prueba import Prueba
from app.models.competencia import Competencia
from app.utils.pb import calcular_pb, actualizar_pb

def parsear_fecha(texto: str) -> date:
    for fmt in ["%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"]:
        try:
            return datetime.strptime(texto.strip(), fmt).date()
        except:
            continue
    raise ValueError(f"Fecha no reconocida: {texto}")

def importar_atletas(ruta_csv: str):
    db = SessionLocal()
    creados = 0
    errores = 0
    try:
        with open(ruta_csv, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader, start=2):
                try:
                    # verificar si ya existe
                    existente = db.query(Atleta).filter(
                        Atleta.nombre == row["nombre"].strip(),
                        Atleta.apellido == row["apellido"].strip()
                    ).first()
                    if existente:
                        print(f"  Fila {i}: {row['nombre']} {row['apellido']} ya existe, omitiendo")
                        continue

                    atleta = Atleta(
                        nombre=row["nombre"].strip(),
                        apellido=row["apellido"].strip(),
                        fecha_nacimiento=parsear_fecha(row["fecha_nacimiento"]),
                        genero=row["genero"].strip().upper(),
                        region=row.get("region", "").strip() or None,
                        colegio=row.get("colegio", "").strip() or None,
                    )
                    db.add(atleta)
                    db.flush()
                    creados += 1
                    print(f"  ✓ {atleta.nombre} {atleta.apellido} — {atleta.categoria}")
                except Exception as e:
                    errores += 1
                    print(f"  ✗ Fila {i}: {e}")

        db.commit()
        print(f"\nAtletas importados: {creados} | Errores: {errores}")
    finally:
        db.close()

def importar_marcas(ruta_csv: str):
    db = SessionLocal()
    creadas = 0
    errores = 0
    try:
        with open(ruta_csv, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for i, row in enumerate(reader, start=2):
                try:
                    # buscar atleta
                    atleta = db.query(Atleta).filter(
                        Atleta.nombre == row["nombre_atleta"].strip(),
                        Atleta.apellido == row["apellido_atleta"].strip()
                    ).first()
                    if not atleta:
                        print(f"  ✗ Fila {i}: Atleta '{row['nombre_atleta']} {row['apellido_atleta']}' no encontrado")
                        errores += 1
                        continue

                    # buscar prueba
                    prueba = db.query(Prueba).filter(
                        Prueba.nombre == row["prueba"].strip().lower()
                    ).first()
                    if not prueba:
                        print(f"  ✗ Fila {i}: Prueba '{row['prueba']}' no encontrada")
                        errores += 1
                        continue

                    # buscar competencia
                    competencia = db.query(Competencia).filter(
                        Competencia.nombre == row["competencia"].strip()
                    ).first()
                    if not competencia:
                        print(f"  ✗ Fila {i}: Competencia '{row['competencia']}' no encontrada")
                        errores += 1
                        continue

                    resultado = float(row["resultado"])
                    ronda = row.get("ronda", "final").strip() or "final"
                    fecha = parsear_fecha(row["fecha"])

                    # calcular PB
                    es_pb = calcular_pb(db, atleta.id, prueba.id, resultado)
                    if es_pb:
                        actualizar_pb(db, atleta.id, prueba.id)

                    marca = Marca(
                        atleta_id=atleta.id,
                        prueba_id=prueba.id,
                        competencia_id=competencia.id,
                        resultado=resultado,
                        ronda=ronda,
                        posicion=int(row["posicion"]) if row.get("posicion") else None,
                        viento=float(row["viento"]) if row.get("viento") else None,
                        homologada=row.get("homologada", "true").lower() == "true",
                        fecha=fecha,
                        es_pb=es_pb
                    )
                    db.add(marca)
                    db.flush()
                    creadas += 1
                    print(f"  ✓ {atleta.nombre} {atleta.apellido} — {prueba.nombre} {resultado} {'★ PB' if es_pb else ''}")

                except Exception as e:
                    errores += 1
                    print(f"  ✗ Fila {i}: {e}")

        db.commit()
        print(f"\nMarcas importadas: {creadas} | Errores: {errores}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Uso:")
        print("  python -m tests.importar_csv atletas archivo.csv")
        print("  python -m tests.importar_csv marcas archivo.csv")
        sys.exit(1)

    tipo = sys.argv[1]
    ruta = sys.argv[2]

    if tipo == "atletas":
        print(f"Importando atletas desde {ruta}...")
        importar_atletas(ruta)
    elif tipo == "marcas":
        print(f"Importando marcas desde {ruta}...")
        importar_marcas(ruta)
    else:
        print("Tipo debe ser 'atletas' o 'marcas'")