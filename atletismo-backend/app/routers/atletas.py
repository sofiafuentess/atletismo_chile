from fastapi import APIRouter, Depends, HTTPException,  UploadFile, File
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.atleta import Atleta
from app.schemas.atleta import AtletaCreate, AtletaOut
from app.models.marca import Marca
from app.models.prueba import Prueba
import shutil
import os

router = APIRouter(prefix="/atletas", tags=["Atletas"])




@router.post("/{id}/foto")
def subir_foto(id: int, foto: UploadFile = File(...), db: Session = Depends(get_db)):
    atleta = db.query(Atleta).filter(Atleta.id == id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail="Atleta no encontrado")
    
    # validar que es imagen
    if not foto.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="El archivo debe ser una imagen")
    
    # guardar archivo
    extension = foto.filename.split(".")[-1]
    nombre_archivo = f"atleta_{id}.{extension}"
    ruta = f"app/static/fotos/{nombre_archivo}"
    
    with open(ruta, "wb") as buffer:
        shutil.copyfileobj(foto.file, buffer)
    
    # actualizar foto_url en BD
    atleta.foto_url = f"/static/fotos/{nombre_archivo}"
    db.commit()
    
    return {"mensaje": "Foto subida correctamente", "foto_url": atleta.foto_url}
@router.post("/", response_model=AtletaOut)
def crear_atleta(atleta: AtletaCreate, db: Session = Depends(get_db)):
    nuevo = Atleta(**atleta.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

@router.get("/", response_model=List[AtletaOut])
def listar_atletas(
    categoria: Optional[str] = None,
    genero: Optional[str] = None,
    region: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Atleta).filter(Atleta.activo == True)
    if genero:
        query = query.filter(Atleta.genero == genero)
    if region:
        query = query.filter(Atleta.region == region)
    atletas = query.all()
    if categoria:
        atletas = [a for a in atletas if a.categoria == categoria]
    return atletas

@router.get("/{id}", response_model=AtletaOut)
def obtener_atleta(id: int, db: Session = Depends(get_db)):
    atleta = db.query(Atleta).filter(Atleta.id == id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail="Atleta no encontrado")
    return atleta

@router.put("/{id}", response_model=AtletaOut)
def actualizar_atleta(id: int, datos: AtletaCreate, db: Session = Depends(get_db)):
    atleta = db.query(Atleta).filter(Atleta.id == id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail="Atleta no encontrado")
    for campo, valor in datos.dict().items():
        setattr(atleta, campo, valor)
    db.commit()
    db.refresh(atleta)
    return atleta

@router.get("/{id}/perfil")
def perfil_atleta(id: int, db: Session = Depends(get_db)):
    atleta = db.query(Atleta).filter(Atleta.id == id).first()
    if not atleta:
        raise HTTPException(status_code=404, detail="Atleta no encontrado")

    # PBs por prueba
    pbs = db.query(Marca, Prueba).join(
        Prueba, Marca.prueba_id == Prueba.id
    ).filter(
        Marca.atleta_id == id,
        Marca.es_pb == True
    ).all()

    pbs_data = [
        {
            "prueba_id": prueba.id,
            "prueba": prueba.nombre,
            "tipo": prueba.tipo,
            "unidad": prueba.unidad,
            "resultado": marca.resultado,
            "viento": marca.viento,
            "fecha": marca.fecha,
            "ronda": marca.ronda,
            "competencia_id": marca.competencia_id
        }
        for marca, prueba in pbs
    ]

    # historial completo ordenado por fecha
    historial = db.query(Marca, Prueba).join(
        Prueba, Marca.prueba_id == Prueba.id
    ).filter(
        Marca.atleta_id == id
    ).order_by(Marca.fecha.desc()).all()

    historial_data = [
        {
            "marca_id": marca.id,
            "prueba": prueba.nombre,
            "resultado": marca.resultado,
            "unidad": prueba.unidad,
            "ronda": marca.ronda,
            "posicion": marca.posicion,
            "viento": marca.viento,
            "es_pb": marca.es_pb,
            "homologada": marca.homologada,
            "fecha": marca.fecha,
            "competencia_id": marca.competencia_id
        }
        for marca, prueba in historial
    ]

    return {
        "id": atleta.id,
        "nombre": atleta.nombre,
        "apellido": atleta.apellido,
        "fecha_nacimiento": str(atleta.fecha_nacimiento),
        "categoria": atleta.categoria,
        "genero": atleta.genero,
        "region": atleta.region,
        "colegio": atleta.colegio,
        "club_id": atleta.club_id,
        "total_marcas": len(historial_data),
        "total_pruebas": len(pbs_data),
        "pbs": pbs_data,
        "historial": historial_data
    }