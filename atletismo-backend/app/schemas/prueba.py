from pydantic import BaseModel
from typing import Literal

class PruebaOut(BaseModel):
    id: int
    nombre: str
    tipo: str
    unidad: str

    class Config:
        from_attributes = True