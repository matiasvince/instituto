import React from "react";
import { BrowserRouter, Switch, Route, Redirect, Link } from 'react-router-dom';
import ProfesoresListado from "./components/profesores/ProfesoresListado";
import ProfesoresFormulario from "./components/profesores/ProfesoresFormulario";
import AlumnosListado from "./components/alumnos/AlumnosListado";
import AlumnosFormulario from "./components/alumnos/AlumnosFormulario";
import CursosListado from "./components/cursos/CursosListado";
import CursosFormulario from "./components/cursos/CursosFormulario";
import Administrar from "./components/cursos/Administrar";
import CursosAlumnosFormulario from "./components/cursos/CursosAlumnosFormulario";
import CursosProfesoresFormulario from "./components/cursos/CursosProfesoresFormulario";

const RouterComponent = () => {
    return (
        <BrowserRouter>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link to='/' className="navbar-brand">INSTITUTO APP</Link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <Link to='/cursos' className="nav-link">Cursos</Link>
                            <Link to='/profesores' className="nav-link">Profesores</Link>
                            <Link to='/alumnos' className="nav-link">Alumnos</Link>
                        </ul>
                    </div>
                </div>
            </nav>

            <Switch>
                <Route path='/profesores' exact component={ProfesoresListado} />
                <Route path='/profesores/nuevo' component={ProfesoresFormulario} />
                <Route path='/profesores/:id_profesor' component={ProfesoresFormulario} />

                <Route path='/alumnos' exact component={AlumnosListado} />
                <Route path='/alumnos/nuevo' component={AlumnosFormulario} />
                <Route path='/alumnos/:legajo' component={AlumnosFormulario} />

                <Route path='/cursos' exact component={CursosListado} />
                <Route path='/cursos/nuevo' component={CursosFormulario} />
                <Route path='/cursos/:id_curso' component={CursosFormulario} />

                <Route path='/administrar/:id_curso' component={Administrar} />

                <Route path='/administraralumno/nuevo/:id_curso' component={CursosAlumnosFormulario} />
                <Route path='/administraralumno/:id_curso/:legajo' component={CursosAlumnosFormulario} />
                
                <Route path='/administrarprofesor/nuevo/:id_curso' component={CursosProfesoresFormulario} />

                <Route path='/'>
                    <Redirect to='/cursos' />
                </Route>
            </Switch>
        </BrowserRouter>
    );
}

export default RouterComponent;