from pydantic import BaseModel
from typing import Optional, Literal

class ClubCreate(BaseModel):
    nombre: str
    region: Optional[str] = None
    nivel: Literal["escolar", "atletismo", "ambos"]

class ClubOut(ClubCreate):
    id: int

    class Config:
        from_attributes = True