from sqlalchemy import Column, Integer, String
from app.database import Base

class Club(Base):
    __tablename__ = "clubs"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    region = Column(String(100))
    nivel = Column(String(20))        # "escolar", "atletismo", "ambos"