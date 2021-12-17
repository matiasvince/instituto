import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import { MdOutlineDelete } from "react-icons/md"
import { AiOutlineEdit } from "react-icons/ai"

const Administrar = () => {

    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const [curso, setCurso] = useState([]);
    const history = useHistory();
    const { id_curso } = useParams();

    useEffect(() => {
        setAlumnos([])
        setProfesores([])
        setCurso([])
        obtenerProfesores();
        obtenerAlumnos();
        obtenerCurso();
    }, []);

    const obtenerAlumnos = () => {
        setAlumnos([]);
        axios.get(`http://localhost:8000/cursosalumnos/id_curso/${id_curso}`)
            .then((response) => {
                const cursoalumnos = response.data;
                cursoalumnos.map((alumn) => {
                    axios.get(`http://localhost:8000/alumnos/${alumn.legajo}`)
                        .then((response) => {
                            const final = {
                                legajo: response.data.legajo,
                                nombre: response.data.nombre,
                                apellido: response.data.apellido,
                                estado: alumn.estado
                            }
                            setAlumnos(alumnos => [...alumnos, final]);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const obtenerProfesores = () => {
        setProfesores([]);
        axios.get(`http://localhost:8000/cursosprofesores/id_curso/${id_curso}`)
            .then((response) => {
                const cursoprofesores = response.data;
                cursoprofesores.map((prof) => {
                    axios.get(`http://localhost:8000/profesores/${prof.id_profesor}`)
                        .then((response) => {
                            const final = {
                                id: response.data.id,
                                nombre: response.data.nombre,
                                apellido: response.data.apellido,
                                cargo: prof.cargo
                            }
                            setProfesores(profesores => [...profesores, final]);
                        })
                        .catch((error) => {
                            console.log(error);
                        })
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const eliminarAlumno = (legajo) => {
        axios.delete(`http://localhost:8000/asistencias/ids/${id_curso}/${legajo}`)
            .then(() => {
                axios.delete(`http://localhost:8000/cursosalumnos/ids/${id_curso}/${legajo}`)
                    .then(() => {
                        obtenerAlumnos();
                        alert('El alumno se elimino del curso');
                    })
                    .catch(() => alert('Hubo un error al eliminar el alumno.'));
            })
            .catch(() => {
                axios.delete(`http://localhost:8000/cursosalumnos/ids/${id_curso}/${legajo}`)
                    .then(() => {
                        obtenerAlumnos();
                        alert('El alumno se elimino del curso');
                    })
                    .catch(() => alert('Hubo un error al eliminar el alumno.'));
            })
    }

    const eliminarProfesor = (id) => {
        axios.delete(`http://localhost:8000/cursosprofesores/ids/${id_curso}/${id}`)
            .then(() => {
                obtenerProfesores();
                alert('El profesor se elimino del curso');
            })
            .catch(() => alert('Hubo un error al eliminar el profesor.'));
    }

    const obtenerCurso = () => {
        axios.get(`http://localhost:8000/cursos/${id_curso}`)
            .then((response) => {
                setCurso(response.data);
            })
    }

    let icon_style = { fontSize: "1.1em" };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mt-3">
                <h2 className="p-2 ms-4">CURSO</h2>
                <div className='me-5'>
                    <button className='btn btn-warning' onClick={() => { history.push(`/asistencias/${id_curso}`) }}>Tomar asistencia</button>
                </div>
            </div>


            <div className="container">
                <div className="justify-center mt-3">
                    <div className='mb-5'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Fecha inicio</th>
                                    <th scope="col">Fecha fin</th>
                                    <th scope="col">Maximo alumnos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ listStyle: 'none' }}>
                                    <th>{curso.id}</th>
                                    <td>{curso.nombre}</td>
                                    <td>{curso.fecha_inicio}</td>
                                    <td>{curso.fecha_fin}</td>
                                    <td>{curso.cantidad_alumnos}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='mb-5'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-8'>
                                    <h2>Profesores</h2>
                                </div>
                                <div className='col-4 d-flex flex-row-reverse'>
                                    <button className='btn btn-primary' onClick={() => { history.push(`/administrarprofesor/nuevo/${id_curso}`) }}>Agregar</button>
                                </div>
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Cargo</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profesores.map((profesor) => {
                                    return <>
                                        <tr style={{ listStyle: 'none' }}>
                                            <th>{profesor.id}</th>
                                            <td>{profesor.nombre}</td>
                                            <td>{profesor.apellido}</td>
                                            <td>{profesor.cargo}</td>
                                            <td>
                                                <button id={profesor.cargo} type="button" className="btn btn-danger ms-3" onClick={() => eliminarProfesor(profesor.id)} disabled={profesor.cargo == 'Titular' ? true : false}><MdOutlineDelete style={icon_style} /></button>
                                            </td>
                                        </tr>
                                    </>
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='mb-5'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-8'>
                                    <h2>Alumnos</h2>
                                </div>
                                <div className='col-4 d-flex flex-row-reverse'>
                                    <button className='btn btn-primary' id='agregar_alumno' onClick={() => history.push(`/administraralumno/nuevo/${id_curso}`)}>Agregar</button>
                                </div>
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Legajo</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Estado</th>
                                    <th scope="col">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumnos.map((alumno) => {
                                    return <>
                                        <tr style={{ listStyle: 'none' }}>
                                            <th>{alumno.legajo}</th>
                                            <td>{alumno.nombre}</td>
                                            <td>{alumno.apellido}</td>
                                            <td>{alumno.estado}</td>
                                            <td>
                                                <button type="button" className="btn btn-warning ms-3" onClick={() => history.push(`/administraralumno/${id_curso}/${alumno.legajo}`)}><AiOutlineEdit style={icon_style} /></button>
                                                <button type="button" className="btn btn-danger ms-3" onClick={() => eliminarAlumno(alumno.legajo)}><MdOutlineDelete style={icon_style} /></button>
                                            </td>
                                        </tr>
                                    </>
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}


export default Administrar;