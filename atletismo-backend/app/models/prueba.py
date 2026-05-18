from sqlalchemy import Column, Integer, String
from app.database import Base

class Prueba(Base):
    __tablename__ = "pruebas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    tipo = Column(String(20))         # "pista", "campo", "ruta"
    unidad = Column(String(5))        # "s", "m"