from sqlalchemy import Column, Integer, String, Date
from app.database import Base

class Competencia(Base):
    __tablename__ = "competencias"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(200), nullable=False)
    fecha_inicio = Column(Date, nullable=False)
    fecha_fin = Column(Date, nullable=False)
    lugar = Column(String(200))
    pais = Column(String(100), default="Chile")
    tipo = Column(String(20))
    organizacion = Column(String(20))
    subtipo = Column(String(30))
    nivel = Column(String(20))
    escenario = Column(String(20))