import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';

const AlumnoDetalle = () => {

    const [alumno, setAlumno] = useState([]);
    const [cursos, setCursos] = useState([]);
    const history = useHistory();
    const { legajo } = useParams();

    useEffect(() => {
        setAlumno([])
        setCursos([])
        obtenerAlumno();
        obtenerCursos();
    }, []);

    const obtenerCursos = () => {
        setCursos([]);
        axios.get(`http://localhost:8000/cursosalumnos/legajo/${legajo}`)
            .then((response) => {
                response.data.map(ca => {
                    axios.get(`http://localhost:8000/cursos/${ca.id_curso}`)
                        .then((curso) => {
                            const final = {
                                id: curso.data.id,
                                nombre: curso.data.nombre,
                                fecha_inicio: curso.data.fecha_inicio,
                                fecha_fin: curso.data.fecha_fin,
                                cantidad_alumnos: curso.data.cantidad_alumnos,
                                estado: ca.estado
                            }
                            setCursos(cursos => [...cursos, final]);
                        })
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const bajaCurso = (id_curso) => {
        axios.delete(`http://localhost:8000/asistencias/ids/${id_curso}/${legajo}`)
            .then(() => {
                axios.delete(`http://localhost:8000/cursosalumnos/ids/${id_curso}/${legajo}`)
                    .then(() => {
                        obtenerCursos();
                        alert('El alumno se elimino del curso');
                    })
                    .catch(() => alert('Hubo un error al eliminar el alumno.'));
            })
            .catch(() => {
                axios.delete(`http://localhost:8000/cursosalumnos/ids/${id_curso}/${legajo}`)
                    .then(() => {
                        obtenerCursos();
                        alert('El alumno se elimino del curso');
                    })
                    .catch(() => alert('Hubo un error al eliminar el alumno.'));
            })
    }

    const obtenerAlumno = () => {
        axios.get(`http://localhost:8000/alumnos/${legajo}`)
            .then((response) => {
                setAlumno(response.data);
            })
    }

    let icon_style = { fontSize: "1.1em" };

    return (
        <>
            <div className="d-flex bd-highlight mt-3">
                <h2 className="p-2 w-100 bd-highlight ms-4">{`${alumno.nombre} ${alumno.apellido}`}</h2>
            </div>


            <div className="container">
                <div className="justify-center mt-3">
                    <div className='mb-5'>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Legajo</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ listStyle: 'none' }}>
                                    <th>{alumno.legajo}</th>
                                    <td>{alumno.nombre}</td>
                                    <td>{alumno.apellido}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='mb-5'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-8'>
                                    <h2>Cursos</h2>
                                </div>
                            </div>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Fecha inicio</th>
                                    <th scope="col">Fecha fin</th>
                                    <th scope="col">Maximo alumnos</th>
                                    <th scope="col">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cursos.map((curso) => {
                                    return <>
                                        <tr style={{ listStyle: 'none' }}>
                                            <th>{curso.id}</th>
                                            <td>{curso.nombre}</td>
                                            <td>{curso.fecha_inicio}</td>
                                            <td>{curso.fecha_fin}</td>
                                            <td>{curso.cantidad_alumnos}</td>
                                            <td>{curso.estado}</td>
                                            <td>
                                                <button type="button" className="btn btn-danger ms-3" onClick={() => { bajaCurso(curso.id) }}> Darse de baja</button>
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


export default AlumnoDetalle;