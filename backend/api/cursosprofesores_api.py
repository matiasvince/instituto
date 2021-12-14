from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repository.cursosprofesores_repo import CursosProfesoresRepositorio
from models.cursosprofesores_modelos import CursosProfesoresApi
from db import get_session
from typing import List

cursosprofesores_router = APIRouter(prefix='/cursosprofesores', tags=['CursosProfesores'])
repo = CursosProfesoresRepositorio()

@cursosprofesores_router.get('/', response_model=List[CursosProfesoresApi])
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@cursosprofesores_router.get('/id_curso/{id_curso}')
def get_by_idcurso(id_curso: int, s:Session = Depends(get_session)):
    cat = repo.cursosprofesores_por_idcurso(id_curso, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Curso no encontrado')
    return cat

@cursosprofesores_router.get('/id_profesor/{id_profesor}')
def get_by_id_profesor(id_profesor: int, s:Session = Depends(get_session)):
    cat = repo.cursosprofesores_por_idprofesor(id_profesor, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Profesor no encontrado')
    return cat

@cursosprofesores_router.post('/', response_model=CursosProfesoresApi)
def agregar(datos: CursosProfesoresApi, s:Session = Depends(get_session)):
    curso = repo.agregar(datos, s)
    return curso

@cursosprofesores_router.delete('/{id_curso}/{id_profesor}')
def borrar(id_curso:int, id_profesor:int, s:Session = Depends(get_session)):
    datos = CursosProfesoresApi
    datos.id_curso = id_curso
    datos.id_profesor = id_profesor
    repo.borrar(datos, s)
    return "Se eliminó correctamente"

@cursosprofesores_router.put('/{id_curso}/{id_profesor}', response_model=CursosProfesoresApi)
def actualizar(id_curso:int, id_profesor:int, datos:CursosProfesoresApi, s:Session = Depends(get_session)):
    curso = repo.actualizar(id_curso, id_profesor, datos, s)
    return curso