from sqlalchemy.orm import Session
from app.models.marca import Marca
from app.models.prueba import Prueba

def es_mejor_resultado(nuevo: float, anterior: float, unidad: str) -> bool:
    if unidad == "s":
        return nuevo < anterior  # en tiempo, menor es mejor
    else:
        return nuevo > anterior  # en metros, mayor es mejor

def calcular_pb(
    db: Session,
    atleta_id: int,
    prueba_id: int,
    nuevo_resultado: float
) -> bool:
    prueba = db.query(Prueba).filter(Prueba.id == prueba_id).first()
    if not prueba:
        return False

    pb_actual = db.query(Marca).filter(
        Marca.atleta_id == atleta_id,
        Marca.prueba_id == prueba_id,
        Marca.es_pb == True
    ).first()

    if not pb_actual:
        return True  # primera marca en esta prueba = automáticamente PB

    return es_mejor_resultado(nuevo_resultado, pb_actual.resultado, prueba.unidad)

def actualizar_pb(
    db: Session,
    atleta_id: int,
    prueba_id: int
):
    db.query(Marca).filter(
        Marca.atleta_id == atleta_id,
        Marca.prueba_id == prueba_id,
        Marca.es_pb == True
    ).update({"es_pb": False})
    db.flush()