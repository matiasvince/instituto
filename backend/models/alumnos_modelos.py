from pydantic import BaseModel
from db import Base
from sqlalchemy import Column, Integer, String

class AlumnosBd(Base):
    __tablename__ = 'alumnos'

    legajo = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(120), nullable=False)
    apellido = Column(String(120), nullable=False)

class AlumnoSinId(BaseModel):
    nombre: str
    apellido: str
    
    class Config:
        orm_mode = True

class AlumnosApi(AlumnoSinId):
    legajo: int