from pydantic import BaseModel
from datetime import date
from typing import Optional, Literal

class AtletaCreate(BaseModel):
    nombre: str
    apellido: str
    fecha_nacimiento: date
    genero: Literal["M", "F"]
    club_id: Optional[int] = None
    colegio: Optional[str] = None
    region: Optional[str] = None

class AtletaOut(AtletaCreate):
    id: int
    activo: bool
    categoria: str

    class Config:
        from_attributes = True