from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.database import Base

class Entrenador(Base):
    __tablename__ = "entrenadores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=True)
    region = Column(String(100), nullable=True)
    activo = Column(Boolean, default=False)