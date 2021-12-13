from pydantic import BaseModel
from db import Base
from sqlalchemy import Column, Integer, String

class ProfesoresBd(Base):
    __tablename__ = 'profesores'

    id = Column(Integer, primary_key=True)
    nombre = Column(String(120), nullable=False)
    apellido = Column(String(120), nullable=False)

class ProfesorSinId(BaseModel):
    nombre: str
    apellido: str
    
    class Config:
        orm_mode = True

class ProfesoresApi(ProfesorSinId):
    id: int