from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.competencia import Competencia
from app.schemas.competencia import CompetenciaCreate, CompetenciaOut

router = APIRouter(prefix="/competencias", tags=["Competencias"])

@router.post("/", response_model=CompetenciaOut)
def crear_competencia(comp: CompetenciaCreate, db: Session = Depends(get_db)):
    nueva = Competencia(**comp.dict())
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/", response_model=List[CompetenciaOut])
def listar_competencias(
    tipo: Optional[str] = None,
    nivel: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Competencia)
    if tipo:
        query = query.filter(Competencia.tipo == tipo)
    if nivel:
        query = query.filter(Competencia.nivel == nivel)
    return query.order_by(Competencia.fecha_inicio.desc()).all()

@router.get("/{id}", response_model=CompetenciaOut)
def obtener_competencia(id: int, db: Session = Depends(get_db)):
    comp = db.query(Competencia).filter(Competencia.id == id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competencia no encontrada")
    return comp