from pydantic import BaseModel
from sqlalchemy.sql.schema import ForeignKey
from db import Base
from sqlalchemy import Column, Enum

class CursosAlumnosBd(Base):
    __tablename__ = 'cursosalumnos'

    id_curso = Column(ForeignKey('cursos.id'), primary_key=True)
    legajo = Column(ForeignKey('alumnos.legajo'), primary_key=True)
    estado = Column(Enum('Aprobado', 'Regular', 'Cursando', name='estado_tipos'), nullable=False)

# class CursosAlumnosSinId(BaseModel):
#     nombre: str
#     apellido: str
    
#     class Config:
#         orm_mode = True

class CursosAlumnosSinIds(BaseModel):
    estado: str

    class Config:
        orm_mode = True

class CursosAlumnosApi(CursosAlumnosSinIds):
    id_curso: int
    legajo: int