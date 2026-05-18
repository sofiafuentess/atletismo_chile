from pydantic import BaseModel, model_validator
from datetime import date
from typing import Optional, Literal

class CompetenciaCreate(BaseModel):
    nombre: str
    fecha_inicio: date
    fecha_fin: date
    lugar: Optional[str] = None
    pais: str = "Chile"
    tipo: Literal["nacional", "internacional"]
    organizacion: Literal["escolar", "federada", "universitaria", "master"]
    subtipo: Literal["campeonato_nacional", "grand_prix", "regional", "fenaude", "ldes", "internacional", "otro"]
    nivel: Literal["u8", "u10", "u12", "u14", "u16", "u18", "u20", "u23", "adulto", "master", "todo_competidor"]
    escenario: Literal["pista_aire_libre", "pista_cubierta", "ruta", "campo"]

    @model_validator(mode="after")
    def validar_fechas(self):
        if self.fecha_fin < self.fecha_inicio:
            raise ValueError("fecha_fin no puede ser anterior a fecha_inicio")
        return self

class CompetenciaOut(CompetenciaCreate):
    id: int

    class Config:
        from_attributes = True