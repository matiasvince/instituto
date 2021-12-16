from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, exc
from models.cursosprofesores_modelos import CursosProfesoresApi, CursosProfesoresBd

class CursosProfesoresRepositorio():
    def get_all(self, session: Session):
        return session.execute(select(CursosProfesoresBd)).scalars().all()

    def cursosprofesores_por_idcurso(self, id_curso:int, session:Session):
        return session.execute(select(CursosProfesoresBd).where(CursosProfesoresBd.id_curso == id_curso)).scalars().all()

    def cursosprofesores_por_idprofesor(self, id_profesor:int, session:Session):
        return session.execute(select(CursosProfesoresBd).where(CursosProfesoresBd.id_profesor == id_profesor)).scalars().all()
    
    def cursosprofesores_por_ids(self, id_curso:int, id_profesor:int, session:Session):
        return session.execute(select(CursosProfesoresBd).where(and_(CursosProfesoresBd.id_profesor == id_profesor, CursosProfesoresBd.id_curso == id_curso))).scalar()

    def agregar(self, datos: CursosProfesoresApi, session:Session):
        instancia_bd = CursosProfesoresBd(id_curso= datos.id_curso, id_profesor= datos.id_profesor, cargo= datos.cargo)
        if((session.execute('SELECT COUNT(*) FROM cursosprofesores cp WHERE cp.id_curso = :id_curso AND cp.cargo = :cargo', {"id_curso": datos.id_curso, "cargo": datos.cargo})).scalar() == 1):
            raise HTTPException(status_code=404, detail='Ya existe un profesor con ese cargo en ese curso')
        try:
           session.add(instancia_bd)
           session.commit()
           return instancia_bd
        except:
            raise HTTPException(status_code=400, detail='Hubo un error al agregar el profesor en el curso.')

    def borrar(self, datos: CursosProfesoresApi, session:Session):
        instancia_bd = session.get(CursosProfesoresBd, {"id_curso": datos.id_curso, "id_profesor": datos.id_profesor})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o profesor no encontrado')
        try:
            session.delete(instancia_bd)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar el curso asignado al profesor.')

    def borrar_curso(self, id_curso:int, session:Session):
        instancia_bd = session.execute('SELECT COUNT(*) FROM cursosprofesores cp WHERE cp.id_curso = :id_curso', {'id_curso': id_curso}).scalar()
        if instancia_bd == 0:
            raise HTTPException(status_code=404, detail='Curso no encontrado')
        try:
            session.query(CursosProfesoresBd).filter(CursosProfesoresBd.id_curso == id_curso).\
                delete()
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar el curso.')

    def borrar_profesor(self, id_profesor:int, session:Session):
        instancia_bd = session.execute('SELECT COUNT(*) FROM cursosprofesores cp WHERE cp.id_profesor = :id_profesor', {'id_profesor': id_profesor}).scalar()
        if instancia_bd == 0:
            raise HTTPException(status_code=404, detail='Profesor no encontrado')
        try:
            session.query(CursosProfesoresBd).filter(CursosProfesoresBd.id_profesor == id_profesor).\
                delete()
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar el profesor.')
        
    def actualizar(self, id_curso:int, id_profesor:int, datos:CursosProfesoresApi, session:Session):
        instancia_bd = session.get(CursosProfesoresBd, {"id_curso": id_curso, "id_profesor": id_profesor})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o profesor no encontrado')
        
        try:
            instancia_bd.id_profesor = datos.id_profesor
            instancia_bd.cargo = datos.cargo
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede modificar el curso asignado al profesor.')