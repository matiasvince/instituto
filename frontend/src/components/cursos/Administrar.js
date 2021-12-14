import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import { MdAdd } from "react-icons/md"

const Administrar = () => {

    const [alumnos, setAlumnos] = useState([]);
    const [profesores, setProfesores] = useState([]);
    const history = useHistory();
    const { id_curso } = useParams();

    useEffect(() => {
        setAlumnos([])
        setProfesores([])
        obtenerProfesores();
        obtenerAlumnos();
    }, []);

    const obtenerAlumnos = () => {
        axios.get(`http://localhost:8000/cursosalumnos/id_curso/${id_curso}`)
            .then((response) => {
                const cursoalumnos = response.data;
                cursoalumnos.map((alumn) => {
                    axios.get(`http://localhost:8000/alumnos/${alumn.legajo}`)
                        .then((response) => {
                            setAlumnos(alumnos => [...alumnos, response.data]);
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


    return (
        <>
            <div className="d-flex bd-highlight mt-3">
                <h1 className="p-2 w-100 bd-highlight ms-4">CURSOS</h1>
            </div>
            <div className="container">
                <div className="justify-center mt-3">
                <div className='mb-5'>
                        <h2>Profesores</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                    <th scope="col">Cargo</th>
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
                                        </tr>
                                    </>
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h2>Alumnos</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Legajo</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Apellido</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alumnos.map((alumno) => {
                                    return <>
                                        <tr style={{ listStyle: 'none' }}>
                                            <th>{alumno.legajo}</th>
                                            <td>{alumno.nombre}</td>
                                            <td>{alumno.apellido}</td>
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