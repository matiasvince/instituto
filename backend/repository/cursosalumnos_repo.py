from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.cursosalumnos_modelos import CursosAlumnosApi, CursosAlumnosBd
from models.alumnos_modelos import AlumnosApi, AlumnosBd


class CursosAlumnosRepositorio():
    def get_all(self, session: Session):
        return session.execute(select(CursosAlumnosBd)).scalars().all()

    def cursosalumnos_por_idcurso(self, id_curso:int, session:Session):
        return session.execute(select(CursosAlumnosBd).where(CursosAlumnosBd.id_curso == id_curso)).scalars().all()
        
    def cursosalumnos_por_legajo(self, legajo:int, session:Session):
        return session.execute(select(CursosAlumnosBd).where(CursosAlumnosBd.legajo == legajo)).scalars().all()

    def agregar(self, datos: CursosAlumnosApi, session:Session):
        instancia_bd = CursosAlumnosBd(id_curso= datos.id_curso, legajo= datos.legajo)
        session.add(instancia_bd)
        session.commit()
        return instancia_bd

    def borrar(self, datos: CursosAlumnosApi, session:Session):
        instancia_bd = session.get(CursosAlumnosBd, {"id_curso": datos.id_curso, "legajo": datos.legajo})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o alumno no encontrado')
        try:
            session.delete(instancia_bd)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar el curso asignado al alumno.')
        
    def actualizar(self, id_curso:int, legajo:int, datos:CursosAlumnosApi, session:Session):
        instancia_bd = session.get(CursosAlumnosBd, {"id_curso": id_curso, "legajo": legajo})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o alumno no encontrado')
        
        try:
            instancia_bd.id_curso = datos.id_curso
            instancia_bd.legajo = datos.legajo

            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede modificar el curso asignado al alumno.')