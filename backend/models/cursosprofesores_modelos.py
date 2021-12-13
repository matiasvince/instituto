from pydantic import BaseModel
from sqlalchemy.sql.schema import ForeignKey
from db import Base
from sqlalchemy import Column

class CursosProfesoresBd(Base):
    __tablename__ = 'cursosprofesores'

    id_curso = Column(ForeignKey('cursos.id'), primary_key=True)
    id_profesor = Column(ForeignKey('profesores.id'), primary_key=True)

# class CursosAlumnosSinId(BaseModel):
#     nombre: str
#     apellido: str
    
#     class Config:
#         orm_mode = True

class CursosProfesoresApi(BaseModel):
    id_curso: int
    id_profesor: int

    class Config:
        orm_mode = True