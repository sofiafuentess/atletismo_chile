from pydantic import BaseModel, EmailStr
from typing import Literal

class UsuarioCreate(BaseModel):
    email: str
    nombre: str
    password: str
    rol: Literal["admin", "entrenador", "publico"] = "publico"

class UsuarioOut(BaseModel):
    id: int
    email: str
    nombre: str
    rol: str
    activo: bool

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    rol: str
    nombre: str