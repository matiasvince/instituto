from datetime import datetime
from pydantic import BaseModel
from db import Base
from sqlalchemy import Column, Integer, String, Date

class CursosBd(Base):
    __tablename__ = 'cursos'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(120), nullable=False)
    fecha_inicio = Column(String(20), nullable=False)
    fecha_fin = Column(String(20), nullable=False)
    cantidad_alumnos = Column(Integer, nullable=False)

class CursoSinId(BaseModel):
    nombre: str
    fecha_inicio: str
    fecha_fin: str
    cantidad_alumnos: int
    
    class Config:
        orm_mode = True

class CursosApi(CursoSinId):
    id: int