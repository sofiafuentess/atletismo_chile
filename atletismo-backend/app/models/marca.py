from sqlalchemy import Column, Integer, Float, Boolean, ForeignKey, Date, String
from app.database import Base

class Marca(Base):
    __tablename__ = "marcas"

    id = Column(Integer, primary_key=True, index=True)
    atleta_id = Column(Integer, ForeignKey("atletas.id"), nullable=False)
    prueba_id = Column(Integer, ForeignKey("pruebas.id"), nullable=False)
    competencia_id = Column(Integer, ForeignKey("competencias.id"), nullable=False)
    resultado = Column(Float, nullable=False)
    ronda = Column(String(20), default="final")  # serie, semifinal, final
    es_pb = Column(Boolean, default=False)
    posicion = Column(Integer, nullable=True)
    viento = Column(Float, nullable=True)
    homologada = Column(Boolean, default=True)
    fecha = Column(Date)