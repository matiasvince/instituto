from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, column
from models.alumnos_modelos import AlumnosBd, AlumnoSinId

class AlumnosRepositorio():
    def get_all(self, session: Session):
        return session.execute(select(AlumnosBd)).scalars().all()

    def alumno_por_legajo(self, legajo:int, session:Session):
        return session.execute(select(AlumnosBd).where(AlumnosBd.legajo == legajo)).scalar()

    def alumnos_por_apellido(self, apellido:str, session:Session):
        return session.execute(select(AlumnosBd).where(column('apellido').ilike(f'%{apellido}%'))).scalars().all()

    def agregar(self, datos: AlumnoSinId, session:Session):
        instancia_bd = AlumnosBd(nombre= datos.nombre, apellido= datos.apellido)
        session.add(instancia_bd)
        session.commit()
        return instancia_bd

    def borrar(self, id: int, session:Session):
        instancia_bd = session.get(AlumnosBd, id)
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Alumno no encontrado')
        try:
            session.delete(instancia_bd)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar el alumno.')
        
    def actualizar(self, id:int, datos:AlumnoSinId, session:Session):
        instancia_bd = session.get(AlumnosBd, id)
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Alumno no encontrado')
        
        try:
            instancia_bd.nombre = datos.nombre
            instancia_bd.apellido = datos.apellido

            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede modificar el alumno.')