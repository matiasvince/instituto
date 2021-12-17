import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { BiSearchAlt } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { MdOutlineDelete, MdAdd } from "react-icons/md"
import { AiOutlineEdit } from "react-icons/ai"

const AlumnosListado = () => {

    const [alumnos, setAlumnos] = useState([]);
    const apellidoInputRef = useRef();

    const history = useHistory();

    useEffect(() => {
        obtenerAlumnos();
    }, []);

    const eliminarAlumno = (legajo) => {
        axios.delete(`http://localhost:8000/asistencias/alumno/${legajo}`)
            .then(() => {
                axios.delete(`http://localhost:8000/cursosalumnos/alumno/${legajo}`)
                    .then(() => {
                        axios.delete(`http://localhost:8000/alumnos/${legajo}`)
                            .then(() => {
                                alert('El alumno se elimino');
                                obtenerAlumnos();
                            })
                            .catch(() => alert('Hubo un error al eliminar el alumno.'));
                    })
                    .catch(() => {
                        axios.delete(`http://localhost:8000/alumnos/${legajo}`)
                            .then(() => {
                                alert('El alumno se elimino');
                                obtenerAlumnos();
                            })
                            .catch(() => alert('Hubo un error al eliminar el alumno.'));
                    })
            })
            .catch(() => {
                axios.delete(`http://localhost:8000/cursosalumnos/alumno/${legajo}`)
                    .then(() => {
                        axios.delete(`http://localhost:8000/alumnos/${legajo}`)
                            .then(() => {
                                alert('El alumno se elimino');
                                obtenerAlumnos();
                            })
                            .catch(() => alert('Hubo un error al eliminar el alumno.'));
                    })
                    .catch(() => {
                        axios.delete(`http://localhost:8000/alumnos/${legajo}`)
                            .then(() => {
                                alert('El alumno se elimino');
                                obtenerAlumnos();
                            })
                            .catch(() => alert('Hubo un error al eliminar el alumno.'));
                    })
            })
    }

    const obtenerAlumnos = () => {
        axios.get('http://localhost:8000/alumnos')
            .then((response) => {
                setAlumnos(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
        apellidoInputRef.current.value = "";
    }

    const buscarAlumnos = () => {
        var apellido = apellidoInputRef.current.value;
        axios.get(`http://127.0.0.1:8000/alumnos/buscar/${apellido}`)
            .then((response) => {
                setAlumnos(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    let icon_style = { fontSize: "1.1em" };
    return (
        <>
            <div className="d-flex bd-highlight mt-3">
                <h1 className="p-2 w-100 bd-highlight ms-4">ALUMNOS</h1>
                <input ref={apellidoInputRef} className="align-self-center form-control w-25 me-2" type="text" placeholder='Buscar por apellido'
                    aria-describedby="inputGroup-sizing-default" />
                <button type="button" className="align-self-center btn btn-success me-1" onClick={() => buscarAlumnos()}><BiSearchAlt style={icon_style} /></button>
                <button type="button" className="align-self-center btn btn-danger me-4" onClick={() => obtenerAlumnos()}><FiDelete style={icon_style} /></button>
            </div>
            <div className="container">
                <div className="justify-center mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Legajo</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Apellido</th>
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
                                        <td>
                                            {/* <button type="button" className="btn btn-info" onClick={() => { }}>Detalle</button> */}
                                            <button type="button" className="btn btn-primary ms-3" onClick={() => history.push(`/alumno/detalle/${alumno.legajo}`)}>Detalle</button>
                                            <button type="button" className="btn btn-warning ms-3" onClick={() => history.push(`/alumnos/${alumno.legajo}`)}><AiOutlineEdit style={icon_style} /></button>
                                            <button type="button" className="btn btn-danger ms-3" onClick={() => eliminarAlumno(alumno.legajo)}><MdOutlineDelete style={icon_style} /></button>
                                        </td>
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <button className='btn btn-primary' style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={() => history.push(`/alumnos/nuevo`)}>Agregar<MdAdd className='ms-2' style={icon_style} type="button" /></button>
        </>
    );
}


export default AlumnosListado;