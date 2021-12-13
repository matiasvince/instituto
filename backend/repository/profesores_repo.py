from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, column
from models.profesores_modelos import ProfesoresBd, ProfesorSinId

class ProfesoresRepositorio():
    def get_all(self, session: Session):
        return session.execute(select(ProfesoresBd)).scalars().all()

    def profesor_por_id(self, id:int, session:Session):
        return session.execute(select(ProfesoresBd).where(ProfesoresBd.id == id)).scalar()

    def profesores_por_apellido(self, apellido:str, session:Session):
        return session.execute(select(ProfesoresBd).where(column('apellido').ilike(f'{apellido}%'))).scalars().all()

    def agregar(self, datos: ProfesorSinId, session:Session):
        instancia_bd = ProfesoresBd(nombre= datos.nombre, apellido= datos.apellido)
        session.add(instancia_bd)
        session.commit()
        return instancia_bd

    def borrar(self, id: int, session:Session):
        instancia_bd = session.get(ProfesoresBd, id)
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Profesor no encontrado')
        try:
            session.delete(instancia_bd)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar el profesor.')
        
    def actualizar(self, id:int, datos:ProfesorSinId, session:Session):
        instancia_bd = session.get(ProfesoresBd, id)
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Profesor no encontrado')
        
        try:
            instancia_bd.nombre = datos.nombre
            instancia_bd.apellido = datos.apellido

            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede modificar el profesor.')