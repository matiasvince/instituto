from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repository.cursos_repo import CursosRepositorio
from models.cursos_modelos import CursosApi, CursoSinId
from db import get_session
from typing import List

cursos_router = APIRouter(prefix='/cursos', tags=['Cursos'])
repo = CursosRepositorio()

@cursos_router.get('/', response_model=List[CursosApi])
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@cursos_router.get('/{id}')
def get_by_id(id: int, s:Session = Depends(get_session)):
    cat = repo.curso_por_id(id, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Curso no encontrado')
    return cat

@cursos_router.get('/buscar/{nombre}')
def get_by_nombre(nombre:str, s:Session = Depends(get_session)):
    return repo.cursos_por_nombre(nombre, s)

@cursos_router.post('/', response_model=CursosApi)
def agregar(datos: CursoSinId, s:Session = Depends(get_session)):
    curso = repo.agregar(datos, s)
    return curso

@cursos_router.delete('/{id}')
def borrar(id: int, s:Session = Depends(get_session)):
    repo.borrar(id, s)
    return "Se eliminó correctamente"

@cursos_router.put('/{id}', response_model=CursosApi)
def actualizar(id:int, datos:CursoSinId, s:Session = Depends(get_session)):
    curso = repo.actualizar(id, datos, s)
    return curso