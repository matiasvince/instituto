from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, and_
from models.cursosalumnos_modelos import CursosAlumnosApi, CursosAlumnosBd, CursosAlumnosSinIds
from models.alumnos_modelos import AlumnosApi, AlumnosBd


class CursosAlumnosRepositorio():
    def get_all(self, session: Session):
        return session.execute(select(CursosAlumnosBd)).scalars().all()

    def cursosalumnos_por_idcurso(self, id_curso:int, session:Session):
        return session.execute(select(CursosAlumnosBd).where(CursosAlumnosBd.id_curso == id_curso)).scalars().all()
        
    def cursosalumnos_por_legajo(self, legajo:int, session:Session):
        return session.execute(select(CursosAlumnosBd).where(CursosAlumnosBd.legajo == legajo)).scalars().all()
    
    def cursoalumno_por_ids(self, legajo:int, id_curso:int, session:Session):
        return session.execute(select(CursosAlumnosBd).where(and_(CursosAlumnosBd.legajo == legajo, CursosAlumnosBd.id_curso == id_curso))).scalar()

    def agregar(self, datos: CursosAlumnosApi, session:Session):
        if((session.execute('SELECT COUNT(*) FROM cursosalumnos ca WHERE ca.id_curso = :id_curso', {'id_curso': datos.id_curso})).scalar() < (session.execute('SELECT c.cantidad_alumnos FROM cursos c WHERE c.id = :id_curso', {'id_curso': datos.id_curso})).scalar()):
            instancia_bd = CursosAlumnosBd(id_curso= datos.id_curso, legajo= datos.legajo, estado= datos.estado)
            session.add(instancia_bd)
            session.commit()
            return instancia_bd
        else:
            raise HTTPException(status_code=404, detail='No se pudo agregar el alumno')

    def borrar(self, datos: CursosAlumnosApi, session:Session):
        instancia_bd = session.get(CursosAlumnosBd, {"id_curso": datos.id_curso, "legajo": datos.legajo})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o alumno no encontrado')
        try:
            session.delete(instancia_bd)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar el curso asignado al alumno.')
        
    def actualizar(self, id_curso:int, legajo:int, datos:CursosAlumnosSinIds, session:Session):
        instancia_bd = session.get(CursosAlumnosBd, {"id_curso": id_curso, "legajo": legajo})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o alumno no encontrado')
        
        try:
            instancia_bd.estado = datos.estado

            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede modificar el curso asignado al alumno.')