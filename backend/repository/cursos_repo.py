from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select, column
from models.cursos_modelos import CursosBd, CursoSinId

class CursosRepositorio():
    def get_all(self, session: Session):
        return session.execute(select(CursosBd)).scalars().all()

    def curso_por_id(self, id:int, session:Session):
        return session.execute(select(CursosBd).where(CursosBd.id == id)).scalar()

    def cursos_por_nombre(self, nombre:str, session:Session):
        return session.execute(select(CursosBd).where(column('nombre').ilike(f'{nombre}%'))).scalars().all()

    def agregar(self, datos: CursoSinId, session:Session):
        instancia_bd = CursosBd(nombre= datos.nombre, fecha_inicio= datos.fecha_inicio, fecha_fin= datos.fecha_fin, cantidad_alumnos= datos.cantidad_alumnos)
        session.add(instancia_bd)
        session.commit()
        return instancia_bd

    def borrar(self, id: int, session:Session):
        instancia_bd = session.get(CursosBd, id)
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso no encontrado')
        try:
            session.delete(instancia_bd)
            session.commit()
        except:
            raise HTTPException(status_code=400, detail='No se puede borrar el curso.')
        
    def actualizar(self, id:int, datos:CursoSinId, session:Session):
        instancia_bd = session.get(CursosBd, id)
        if instancia_bd is None:
            raise HTTPException(status_code=404, detail='Curso no encontrado')
        
        try:
            if((session.execute('SELECT COUNT(*) FROM cursosalumnos ca WHERE ca.id_curso = :id_curso', {'id_curso': id})).scalar() <= (datos.cantidad_alumnos)):
                instancia_bd.nombre = datos.nombre
                instancia_bd.fecha_inicio = datos.fecha_inicio
                instancia_bd.fecha_fin = datos.fecha_fin
                instancia_bd.cantidad_alumnos = datos.cantidad_alumnos
                session.commit()
            else:
                raise HTTPException(status_code=400, detail='Hubo un error. Probablemente deba borrar algunos alumnos')
        except:
            raise HTTPException(status_code=400, detail='No se puede modificar el curso.')