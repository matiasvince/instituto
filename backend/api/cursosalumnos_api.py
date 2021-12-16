from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repository.cursosalumnos_repo import CursosAlumnosRepositorio
from models.cursosalumnos_modelos import CursosAlumnosApi, CursosAlumnosSinIds
from db import get_session
from typing import List

cursosalumnos_router = APIRouter(prefix='/cursosalumnos', tags=['CursosAlumnos'])
repo = CursosAlumnosRepositorio()

@cursosalumnos_router.get('/', response_model=List[CursosAlumnosApi])
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@cursosalumnos_router.get('/id_curso/{id_curso}')
def get_by_idcurso(id_curso: int, s:Session = Depends(get_session)):
    cat = repo.cursosalumnos_por_idcurso(id_curso, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Curso no encontrado')
    return cat

@cursosalumnos_router.get('/legajo/{legajo}')
def get_by_legajo(legajo: int, s:Session = Depends(get_session)):
    cat = repo.cursosalumnos_por_legajo(legajo, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Alumno no encontrado')
    return cat

@cursosalumnos_router.get('/ids/{id_curso}/{legajo}')
def get_by_ids(legajo: int, id_curso: int, s:Session = Depends(get_session)):
    cat = repo.cursoalumno_por_ids(legajo, id_curso, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Alumno en el curso no encontrado')
    return cat

@cursosalumnos_router.post('/', response_model=CursosAlumnosApi)
def agregar(datos: CursosAlumnosApi, s:Session = Depends(get_session)):
    curso = repo.agregar(datos, s)
    return curso

@cursosalumnos_router.delete('/ids/{id_curso}/{legajo}')
def borrar(id_curso:int, legajo:int, s:Session = Depends(get_session)):
    datos = CursosAlumnosApi
    datos.id_curso = id_curso
    datos.legajo = legajo
    repo.borrar(datos, s)
    return "Se eliminó correctamente"

@cursosalumnos_router.delete('/curso/{id_curso}')
def borrar_curso(id_curso:int, s:Session = Depends(get_session)):
    repo.borrar_curso(id_curso, s)
    return "Se eliminó correctamente"

@cursosalumnos_router.delete('/alumno/{legajo}')
def borrar_profesor(legajo:int, s:Session = Depends(get_session)):
    repo.borrar_alumno(legajo, s)
    return "Se eliminó correctamente"

@cursosalumnos_router.put('/{id_curso}/{legajo}', response_model=CursosAlumnosSinIds)
def actualizar(id_curso:int, legajo:int, datos:CursosAlumnosApi, s:Session = Depends(get_session)):
    curso = repo.actualizar(id_curso, legajo, datos, s)
    return curso