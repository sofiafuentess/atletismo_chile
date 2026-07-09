from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.entrenador import Entrenador
from app.models.entrenador_atleta import EntrenadorAtleta
from app.models.atleta import Atleta
from app.schemas.entrenador import EntrenadorCreate, EntrenadorOut
import hashlib

router = APIRouter(prefix="/entrenadores", tags=["Entrenadores"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/", response_model=EntrenadorOut)
def crear_entrenador(datos: EntrenadorCreate, db: Session = Depends(get_db)):
    existente = db.query(Entrenador).filter(Entrenador.email == datos.email).first()
    if existente:
        raise HTTPException(status_code=400, detail="Email ya registrado")
    
    nuevo = Entrenador(
        nombre=datos.nombre,
        apellido=datos.apellido,
        email=datos.email,
        password_hash=hash_password(datos.password),
        club_id=datos.club_id,
        region=datos.region,
        activo=False  # admin debe aprobar
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[EntrenadorOut])
def listar_entrenadores(db: Session = Depends(get_db)):
    return db.query(Entrenador).all()

@router.get("/{id}", response_model=EntrenadorOut)
def obtener_entrenador(id: int, db: Session = Depends(get_db)):
    entrenador = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not entrenador:
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")
    return entrenador

@router.put("/{id}/aprobar")
def aprobar_entrenador(id: int, db: Session = Depends(get_db)):
    entrenador = db.query(Entrenador).filter(Entrenador.id == id).first()
    if not entrenador:
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")
    entrenador.activo = True
    db.commit()
    return {"mensaje": f"Entrenador {entrenador.nombre} aprobado"}

@router.post("/{id}/atletas/{atleta_id}")
def agregar_atleta(id: int, atleta_id: int, db: Session = Depends(get_db)):
    # verificar que existen
    if not db.query(Entrenador).filter(Entrenador.id == id).first():
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")
    if not db.query(Atleta).filter(Atleta.id == atleta_id).first():
        raise HTTPException(status_code=404, detail="Atleta no encontrado")
    
    # verificar que no existe ya la relación
    existente = db.query(EntrenadorAtleta).filter(
        EntrenadorAtleta.entrenador_id == id,
        EntrenadorAtleta.atleta_id == atleta_id
    ).first()
    if existente:
        raise HTTPException(status_code=400, detail="Atleta ya está en el grupo")
    
    relacion = EntrenadorAtleta(entrenador_id=id, atleta_id=atleta_id)
    db.add(relacion)
    db.commit()
    return {"mensaje": "Atleta agregado al grupo"}

@router.delete("/{id}/atletas/{atleta_id}")
def quitar_atleta(id: int, atleta_id: int, db: Session = Depends(get_db)):
    relacion = db.query(EntrenadorAtleta).filter(
        EntrenadorAtleta.entrenador_id == id,
        EntrenadorAtleta.atleta_id == atleta_id
    ).first()
    if not relacion:
        raise HTTPException(status_code=404, detail="Relación no encontrada")
    db.delete(relacion)
    db.commit()
    return {"mensaje": "Atleta removido del grupo"}

@router.get("/{id}/atletas")
def grupo_entrenador(id: int, db: Session = Depends(get_db)):
    if not db.query(Entrenador).filter(Entrenador.id == id).first():
        raise HTTPException(status_code=404, detail="Entrenador no encontrado")
    
    relaciones = db.query(EntrenadorAtleta).filter(
        EntrenadorAtleta.entrenador_id == id
    ).all()
    
    atletas = []
    for r in relaciones:
        atleta = db.query(Atleta).filter(Atleta.id == r.atleta_id).first()
        if atleta:
            atletas.append({
                "id": atleta.id,
                "nombre": atleta.nombre,
                "apellido": atleta.apellido,
                "categoria": atleta.categoria,
                "genero": atleta.genero,
                "region": atleta.region
            })
    
    return {"entrenador_id": id, "total": len(atletas), "atletas": atletas}