from pydantic import BaseModel
from datetime import date
from typing import Optional, Literal

class MarcaCreate(BaseModel):
    atleta_id: int
    prueba_id: int
    competencia_id: int
    resultado: float
    ronda: Literal["serie", "semifinal", "final", "unica"] = "final"
    posicion: Optional[int] = None
    viento: Optional[float] = None
    homologada: bool = True
    fecha: date

class MarcaOut(MarcaCreate):
    id: int
    es_pb: bool
    ronda: Optional[str] = None

    class Config:
        from_attributes = True