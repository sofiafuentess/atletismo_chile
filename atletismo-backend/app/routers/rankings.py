from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.database import get_db
from app.models.marca import Marca
from app.models.atleta import Atleta
from app.models.prueba import Prueba
from app.utils.categoria import calcular_categoria
from pydantic import BaseModel
from datetime import date

router = APIRouter(prefix="/rankings", tags=["Rankings"])

class RankingEntry(BaseModel):
    posicion: int
    atleta_id: int
    nombre: str
    apellido: str
    categoria: str
    region: Optional[str]
    resultado: float
    viento: Optional[float]
    competencia_id: int
    fecha: date
    ronda: Optional[str]

    class Config:
        from_attributes = True

@router.get("/{prueba_id}")
def ranking_por_prueba(
    prueba_id: int,
    categoria: Optional[str] = None,
    genero: Optional[str] = None,
    anio: Optional[int] = None,
    db: Session = Depends(get_db)
):
    prueba = db.query(Prueba).filter(Prueba.id == prueba_id).first()
    if not prueba:
        raise HTTPException(status_code=404, detail="Prueba no encontrada")

    # obtener el mejor resultado de cada atleta en esta prueba
    subquery = db.query(
        Marca.atleta_id,
        func.min(Marca.resultado).label("mejor") if prueba.unidad == "s"
        else func.max(Marca.resultado).label("mejor")
    ).filter(
        Marca.prueba_id == prueba_id,
        Marca.homologada == True
    )

    if anio:
        subquery = subquery.filter(
            func.extract("year", Marca.fecha) == anio
        )

    subquery = subquery.group_by(Marca.atleta_id).subquery()

    # unir con atletas para filtrar por género
    resultados = db.query(
        Atleta,
        subquery.c.mejor,
        Marca
    ).join(
        subquery, Atleta.id == subquery.c.atleta_id
    ).join(
        Marca, (Marca.atleta_id == Atleta.id) &
               (Marca.prueba_id == prueba_id) &
               (Marca.resultado == subquery.c.mejor) &
               (Marca.homologada == True)
    )

    if genero:
        resultados = resultados.filter(Atleta.genero == genero)

    if prueba.unidad == "s":
        resultados = resultados.order_by(subquery.c.mejor.asc())
    else:
        resultados = resultados.order_by(subquery.c.mejor.desc())

    ranking = []
    for i, (atleta, mejor, marca) in enumerate(resultados.all(), start=1):
        cat = calcular_categoria(atleta.fecha_nacimiento)
        if categoria and cat != categoria:
            continue
        ranking.append({
            "posicion": i,
            "atleta_id": atleta.id,
            "nombre": atleta.nombre,
            "apellido": atleta.apellido,
            "categoria": cat,
            "region": atleta.region,
            "resultado": mejor,
            "viento": marca.viento,
            "competencia_id": marca.competencia_id,
            "fecha": marca.fecha,
            "ronda": marca.ronda
        })

    return {
        "prueba": prueba.nombre,
        "unidad": prueba.unidad,
        "genero": genero or "todos",
        "anio": anio or "todos",
        "total": len(ranking),
        "ranking": ranking
    }