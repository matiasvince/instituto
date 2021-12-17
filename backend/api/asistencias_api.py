from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from repository.asistencias_repo import AsistenciasRepositorio
from models.asistencias_modelos import AsistenciasApi
from db import get_session
from typing import List

asistencias_router = APIRouter(prefix='/asistencias', tags=['Asistencias'])
repo = AsistenciasRepositorio()

@asistencias_router.get('/', response_model=List[AsistenciasApi])
def get_all(s: Session = Depends(get_session)):
    return repo.get_all(s)

@asistencias_router.get('/id_curso/{id_curso}')
def get_by_idcurso(id_curso: int, s:Session = Depends(get_session)):
    cat = repo.asistencias_por_idcurso(id_curso, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Curso no encontrado')
    return cat

@asistencias_router.get('/legajo/{legajo}')
def get_by_legajo(legajo: int, s:Session = Depends(get_session)):
    cat = repo.asistencias_por_legajo(legajo, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Alumno no encontrado')
    return cat

@asistencias_router.get('/fecha/{fecha}')
def get_by_fecha(fecha: str, s:Session = Depends(get_session)):
    cat = repo.asistencias_por_fecha(fecha, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Fecha no encontrada')
    return cat

@asistencias_router.get('/todo/{id_curso}/{legajo}/{fecha}')
def get_by_todo(id_curso: int, legajo: int, fecha:str, s:Session = Depends(get_session)):
    cat = repo.asistencias_por_todo(id_curso, legajo, fecha, s)
    if cat is None:
        raise HTTPException(status_code=404, detail='Fecha no encontrada')
    return cat

@asistencias_router.post('/', response_model=AsistenciasApi)
def agregar(datos: AsistenciasApi, s:Session = Depends(get_session)):
    curso = repo.agregar(datos, s)
    return curso

@asistencias_router.delete('/todo/{id_curso}/{legajo}/{fecha}')
def borrar(id_curso:int, legajo:int, fecha:str, s:Session = Depends(get_session)):
    datos = AsistenciasApi
    datos.id_curso = id_curso
    datos.legajo = legajo
    datos.fecha = fecha
    repo.borrar(datos, s)
    return "Se eliminó correctamente"

@asistencias_router.delete('/ids/{id_curso}/{legajo}')
def borrar_por_ids(id_curso:int, legajo:int, s:Session = Depends(get_session)):
    repo.borrar_por_ids(id_curso, legajo, s)
    return "Se eliminó correctamente"

@asistencias_router.delete('/alumno/{legajo}')
def borrar_por_legajo(legajo:int, s:Session = Depends(get_session)):
    repo.borrar_por_legajo(legajo, s)
    return "Se eliminó correctamente"

@asistencias_router.delete('/curso/{id_curso}')
def borrar_por_curso(id_curso:int, s:Session = Depends(get_session)):
    repo.borrar_por_curso(id_curso, s)
    return "Se eliminó correctamente"

@asistencias_router.put('/{id_curso}/{legajo}/{fecha}', response_model=AsistenciasApi)
def actualizar(id_curso:int, legajo:int, fecha:str, datos:AsistenciasApi, s:Session = Depends(get_session)):
    curso = repo.actualizar(id_curso, legajo, fecha, datos, s)
    return curso