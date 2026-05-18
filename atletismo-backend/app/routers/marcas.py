from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.marca import Marca
from app.models.atleta import Atleta
from app.models.prueba import Prueba
from app.models.competencia import Competencia
from app.schemas.marca import MarcaCreate, MarcaOut
from app.utils.pb import calcular_pb, actualizar_pb

router = APIRouter(prefix="/marcas", tags=["Marcas"])

@router.post("/", response_model=MarcaOut)
def registrar_marca(marca: MarcaCreate, db: Session = Depends(get_db)):
    # verificar que existen atleta, prueba y competencia
    if not db.query(Atleta).filter(Atleta.id == marca.atleta_id).first():
        raise HTTPException(status_code=404, detail="Atleta no encontrado")
    if not db.query(Prueba).filter(Prueba.id == marca.prueba_id).first():
        raise HTTPException(status_code=404, detail="Prueba no encontrada")
    if not db.query(Competencia).filter(Competencia.id == marca.competencia_id).first():
        raise HTTPException(status_code=404, detail="Competencia no encontrada")

    # calcular si es PB
    es_pb = calcular_pb(db, marca.atleta_id, marca.prueba_id, marca.resultado)

    # si es PB, desmarcar el anterior
    if es_pb:
        actualizar_pb(db, marca.atleta_id, marca.prueba_id)

    # guardar la nueva marca
    nueva = Marca(**marca.dict(), es_pb=es_pb)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return nueva

@router.get("/atleta/{atleta_id}", response_model=List[MarcaOut])
def historial_atleta(
    atleta_id: int,
    prueba_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Marca).filter(Marca.atleta_id == atleta_id)
    if prueba_id:
        query = query.filter(Marca.prueba_id == prueba_id)
    return query.order_by(Marca.fecha.desc()).all()

@router.get("/atleta/{atleta_id}/pbs", response_model=List[MarcaOut])
def pbs_atleta(atleta_id: int, db: Session = Depends(get_db)):
    return db.query(Marca).filter(
        Marca.atleta_id == atleta_id,
        Marca.es_pb == True
    ).all()

@router.delete("/{id}")
def eliminar_marca(id: int, db: Session = Depends(get_db)):
    marca = db.query(Marca).filter(Marca.id == id).first()
    if not marca:
        raise HTTPException(status_code=404, detail="Marca no encontrada")
    
    # si era PB, recalcular el nuevo PB
    if marca.es_pb:
        db.delete(marca)
        db.flush()
        nueva_pb = db.query(Marca).filter(
            Marca.atleta_id == marca.atleta_id,
            Marca.prueba_id == marca.prueba_id
        ).order_by(Marca.resultado.asc()).first()
        if nueva_pb:
            nueva_pb.es_pb = True
    else:
        db.delete(marca)
    
    db.commit()
    return {"mensaje": f"Marca {id} eliminada"}