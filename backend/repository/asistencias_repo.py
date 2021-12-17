from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from models.asistencias_modelos import AsistenciasApi, AsistenciasBd

class AsistenciasRepositorio():
    def get_all(self, session: Session):
        return session.execute(select(AsistenciasBd)).scalars().all()

    def asistencias_por_idcurso(self, id_curso:int, session:Session):
        return session.execute(select(AsistenciasBd).where(AsistenciasBd.id_curso == id_curso)).scalars().all()

    def asistencias_por_legajo(self, legajo:int, session:Session):
        return session.execute(select(AsistenciasBd).where(AsistenciasBd.legajo == legajo)).scalars().all()

    def asistencias_por_fecha(self, fecha:str, session:Session):
        return session.execute(select(AsistenciasBd).where(AsistenciasBd.fecha == fecha)).scalars().all()
    
    def asistencias_por_todo(self, id_curso:int, legajo:int, fecha:str, session:Session):
        return session.execute(select(AsistenciasBd).where(and_(AsistenciasBd.fecha == fecha, AsistenciasBd.legajo == legajo, AsistenciasBd.id_curso == id_curso))).scalars().all()

    def agregar(self, datos: AsistenciasApi, session:Session):
        instancia_bd = AsistenciasBd(id_curso= datos.id_curso, legajo= datos.legajo, fecha= datos.fecha, asistencia= datos.asistencia)
        session.add(instancia_bd)
        session.commit()
        return instancia_bd

    def borrar(self, datos: AsistenciasApi, session:Session):
        instancia_bd = session.get(AsistenciasBd, {"id_curso": datos.id_curso, "legajo": datos.legajo, "fecha": datos.fecha})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o alumno o fecha no encontrado')
        try:
            session.delete(instancia_bd)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar las asistencias asignadas al alumno.')
    
    def borrar_por_legajo(self, legajo:int, session:Session):
        instancia_bd = session.execute('SELECT COUNT(*) FROM asistencias asis WHERE asis.legajo = :legajo', {'legajo': legajo}).scalar()
        if instancia_bd == 0:
            raise HTTPException(status_code=404, detail='Asistencias de alumno no encontrados')
        try:
            session.query(AsistenciasBd).filter(AsistenciasBd.legajo == legajo).\
                delete()
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar las asistencias del alumno.')
    
    def borrar_por_curso(self, id_curso:int, session:Session):
        instancia_bd = session.execute('SELECT COUNT(*) FROM asistencias asis WHERE asis.id_curso = :id_curso', {'id_curso': id_curso}).scalar()
        if instancia_bd == 0:
            raise HTTPException(status_code=404, detail='Asistencias en el curso no encontrado')
        try:
            session.query(AsistenciasBd).filter(AsistenciasBd.id_curso == id_curso).\
                delete()
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar las asistencias del curso.')

    def borrar_por_ids(self, id_curso:int, legajo:int, session:Session):
        instancia_bd = session.execute('SELECT COUNT(*) FROM asistencias asis WHERE asis.legajo = :legajo AND asis.id_curso = :id_curso', {'legajo': legajo, 'id_curso': id_curso}).scalar()
        if instancia_bd == 0:
            raise HTTPException(status_code=404, detail='Asistencias de alumno en el curso no encontrados')
        try:
            session.query(AsistenciasBd).filter(and_(AsistenciasBd.legajo == legajo, AsistenciasBd.id_curso == id_curso)).\
                delete()
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar las asistencias del alumno en el curso.')
        
    def actualizar(self, id_curso:int, legajo:int, fecha:str, datos:AsistenciasApi, session:Session):
        instancia_bd = session.get(AsistenciasBd, {"id_curso": id_curso, "legajo": legajo, "fecha": fecha})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso, alumno, fecha no encontrado')
        
        try:
            instancia_bd.id_curso = datos.id_curso
            instancia_bd.legajo = datos.legajo
            instancia_bd.fecha = datos.fecha
            instancia_bd.asistencia = datos.asistencia

            session.commit()

            return instancia_bd
        except:
            raise HTTPException(status_code=400, detail='No se puede modificar el curso asignado al alumno.')