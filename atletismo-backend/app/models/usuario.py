from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(200), unique=True, nullable=False)
    nombre = Column(String(100))
    hashed_password = Column(String, nullable=False)
    rol = Column(String(20), default="publico")  # admin, entrenador, publico
    activo = Column(Boolean, default=True)