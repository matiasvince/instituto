from pydantic import BaseModel
from sqlalchemy.sql.schema import ForeignKey
from db import Base
from sqlalchemy import Column, Integer, String

class AsistenciasBd(Base):
    __tablename__ = 'asistencias'

    # id = Column(Integer, primary_key=True, autoincrement=True)
    id_curso = Column(ForeignKey('cursos.id'), primary_key=True)
    legajo = Column(ForeignKey('alumnos.legajo'), primary_key=True)
    fecha = Column(String(20), primary_key=True)

class AsistenciasApi(BaseModel):
    id_curso: int
    legajo: int
    fecha: str
    
    class Config:
        orm_mode = True

# class AsistenciasApi(AsistenciasSinId):
#     id: int