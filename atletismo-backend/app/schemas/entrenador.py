from pydantic import BaseModel, EmailStr
from typing import Optional

class EntrenadorCreate(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    password: str
    club_id: Optional[int] = None
    region: Optional[str] = None

class EntrenadorOut(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    club_id: Optional[int]
    region: Optional[str]
    activo: bool

    class Config:
        from_attributes = True

class EntrenadorLogin(BaseModel):
    email: str
    password: str