from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repository.alumnos_repo import AlumnosRepositorio
from models.alumnos_modelos import AlumnosApi, AlumnoSinId
from db import get_session
from typing import List

alumnos_router = APIRouter(prefix='/alumnos', tags=['Alumnos'])
repo = AlumnosRepositorio()

@alumnos_router.get('/', response_model=List[AlumnosApi])
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@alumnos_router.get('/{legajo}')
def get_by_legajo(legajo: int, s:Session = Depends(get_session)):
    cat = repo.alumno_por_legajo(legajo, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Alumno no encontrado')
    return cat

@alumnos_router.get('/buscar/{nombre}')
def get_by_apellido(apellido:str, s:Session = Depends(get_session)):
    return repo.alumnos_por_apellido(apellido, s)

@alumnos_router.post('/', response_model=AlumnosApi)
def agregar(datos: AlumnoSinId, s:Session = Depends(get_session)):
    alumno = repo.agregar(datos, s)
    return alumno

@alumnos_router.delete('/{legajo}')
def borrar(legajo: int, s:Session = Depends(get_session)):
    repo.borrar(legajo, s)
    return "Se eliminó correctamente"

@alumnos_router.put('/{legajo}', response_model=AlumnosApi)
def actualizar(legajo:int, datos:AlumnoSinId, s:Session = Depends(get_session)):
    alumno = repo.actualizar(legajo, datos, s)
    return alumno