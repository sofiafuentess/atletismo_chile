from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.utils.categoria import calcular_categoria

class Atleta(Base):
    __tablename__ = "atletas"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    fecha_nacimiento = Column(Date, nullable=False)
    genero = Column(String(1))
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=True)
    colegio = Column(String(200), nullable=True)
    region = Column(String(100), nullable=True)
    foto_url = Column(String, nullable=True)
    activo = Column(Boolean, default=True)

    @property
    def categoria(self):
        return calcular_categoria(self.fecha_nacimiento)