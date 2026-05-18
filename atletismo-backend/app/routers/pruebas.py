from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.prueba import Prueba
from app.schemas.prueba import PruebaOut

router = APIRouter(prefix="/pruebas", tags=["Pruebas"])

@router.get("/", response_model=List[PruebaOut])
def listar_pruebas(db: Session = Depends(get_db)):
    return db.query(Prueba).all()