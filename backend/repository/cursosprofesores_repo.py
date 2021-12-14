from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from models.cursosprofesores_modelos import CursosProfesoresApi, CursosProfesoresBd

class CursosProfesoresRepositorio():
    def get_all(self, session: Session):
        return session.execute(select(CursosProfesoresBd)).scalars().all()

    def cursosprofesores_por_idcurso(self, id_curso:int, session:Session):
        return session.execute(select(CursosProfesoresBd).where(CursosProfesoresBd.id_curso == id_curso)).scalars().all()

    def cursosprofesores_por_idprofesor(self, id_profesor:int, session:Session):
        return session.execute(select(CursosProfesoresBd).where(CursosProfesoresBd.id_profesor == id_profesor)).scalars().all()

    def agregar(self, datos: CursosProfesoresApi, session:Session):
        instancia_bd = CursosProfesoresBd(id_curso= datos.id_curso, id_profesor= datos.id_profesor, cargo= datos.cargo)
        session.add(instancia_bd)
        session.commit()
        return instancia_bd

    def borrar(self, datos: CursosProfesoresApi, session:Session):
        instancia_bd = session.get(CursosProfesoresBd, {"id_curso": datos.id_curso, "id_profesor": datos.id_profesor})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o profesor no encontrado')
        try:
            session.delete(instancia_bd)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar el curso asignado al profesor.')
        
    def actualizar(self, id_curso:int, id_profesor:int, datos:CursosProfesoresApi, session:Session):
        instancia_bd = session.get(CursosProfesoresBd, {"id_curso": id_curso, "id_profesor": id_profesor})
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso o profesor no encontrado')
        
        try:
            instancia_bd.id_curso = datos.id_curso
            instancia_bd.id_profesor = datos.id_profesor

            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede modificar el curso asignado al profesor.')