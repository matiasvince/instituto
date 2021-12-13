from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.cursos_api import cursos_router
from api.profesores_api import profesores_router
from api.alumnos_api import alumnos_router
from api.cursosalumnos_api import cursosalumnos_router
from api.cursosprofesores_api import cursosprofesores_router
from api.asistencias_api import asistencias_router
import db

app = FastAPI()
app.include_router(cursos_router)
app.include_router(profesores_router)
app.include_router(alumnos_router)
app.include_router(cursosalumnos_router)
app.include_router(cursosprofesores_router)
app.include_router(asistencias_router)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# db.drop_all()
db.create_all()


if __name__ == '__main__':
    uvicorn.run("institutoapp:app", reload=True)