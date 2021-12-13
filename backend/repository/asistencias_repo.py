from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
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

    def agregar(self, datos: AsistenciasApi, session:Session):
        instancia_bd = AsistenciasBd(id_curso= datos.id_curso, legajo= datos.legajo, fecha= datos.fecha)
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
            raise HTTPException(status_code=400, detail='No se puede borrar el curso asignado al alumno.')
        
    def actualizar(self, id_curso:int, legajo:int, fecha:str, datos:AsistenciasApi, session:Session):
        instancia_bd = session.get(AsistenciasBd, {"id_curso": id_curso, "legajo": legajo, "fecha": fecha})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o alumno o fecha no encontrado')
        
        try:
            instancia_bd.id_curso = datos.id_curso
            instancia_bd.legajo = datos.legajo
            instancia_bd.fecha = datos.fecha

            session.commit()

            return instancia_bd
        except:
            raise HTTPException(status_code=400, detail='No se puede modificar el curso asignado al alumno.')