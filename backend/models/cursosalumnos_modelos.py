from pydantic import BaseModel
from sqlalchemy.sql.schema import ForeignKey
from db import Base
from sqlalchemy import Column

class CursosAlumnosBd(Base):
    __tablename__ = 'cursosalumnos'

    id_curso = Column(ForeignKey('cursos.id'), primary_key=True)
    legajo = Column(ForeignKey('alumnos.legajo'), primary_key=True)

# class CursosAlumnosSinId(BaseModel):
#     nombre: str
#     apellido: str
    
#     class Config:
#         orm_mode = True

class CursosAlumnosApi(BaseModel):
    id_curso: int
    legajo: int

    class Config:
        orm_mode = True