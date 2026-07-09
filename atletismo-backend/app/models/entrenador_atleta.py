from sqlalchemy import Column, Integer, ForeignKey
from app.database import Base

class EntrenadorAtleta(Base):
    __tablename__ = "entrenador_atleta"

    id = Column(Integer, primary_key=True, index=True)
    entrenador_id = Column(Integer, ForeignKey("entrenadores.id"), nullable=False)
    atleta_id = Column(Integer, ForeignKey("atletas.id"), nullable=False)