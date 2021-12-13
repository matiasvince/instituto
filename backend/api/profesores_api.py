from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repository.profesores_repo import ProfesoresRepositorio
from models.profesores_modelos import ProfesoresApi, ProfesorSinId
from db import get_session
from typing import List

profesores_router = APIRouter(prefix='/profesores', tags=['Profesores'])
repo = ProfesoresRepositorio()

@profesores_router.get('/', response_model=List[ProfesoresApi])
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@profesores_router.get('/{id}')
def get_by_id(id: int, s:Session = Depends(get_session)):
    cat = repo.profesor_por_id(id, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Profesor no encontrado')
    return cat

@profesores_router.get('/buscar/{apellido}')
def get_by_apellido(apellido:str, s:Session = Depends(get_session)):
    return repo.profesores_por_apellido(apellido, s)

@profesores_router.post('/', response_model=ProfesoresApi)
def agregar(datos: ProfesorSinId, s:Session = Depends(get_session)):
    profesor = repo.agregar(datos, s)
    return profesor

@profesores_router.delete('/{id}')
def borrar(id: int, s:Session = Depends(get_session)):
    repo.borrar(id, s)
    return "Se eliminó correctamente"

@profesores_router.put('/{id}', response_model=ProfesoresApi)
def actualizar(id:int, datos:ProfesorSinId, s:Session = Depends(get_session)):
    profesor = repo.actualizar(id, datos, s)
    return profesor