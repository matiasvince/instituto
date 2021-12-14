import enum
from pydantic import BaseModel
from sqlalchemy.sql.schema import ForeignKey
from db import Base
from sqlalchemy import Column, Enum

class CursosProfesoresBd(Base):
    __tablename__ = 'cursosprofesores'

    id_curso = Column(ForeignKey('cursos.id'), primary_key=True)
    id_profesor = Column(ForeignKey('profesores.id'), primary_key=True)
    cargo = Column(Enum('Jefe', 'Auxiliar', name='cargo_tipos'), nullable=False)

# class CursosAlumnosSinId(BaseModel):
#     nombre: str
#     apellido: str
    
#     class Config:
#         orm_mode = True

class CursosProfesoresApi(BaseModel):
    id_curso: int
    id_profesor: int
    cargo: str

    class Config:
        orm_mode = True