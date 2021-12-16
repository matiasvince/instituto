import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { BiSearchAlt } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { MdOutlineDelete, MdAdd } from "react-icons/md"
import { AiOutlineEdit } from "react-icons/ai"

const CursosListado = () => {

    const [cursos, setCursos] = useState([]);
    const nombreInputRef = useRef();

    const history = useHistory();

    useEffect(() => {
        obtenerCursos();
    }, []);

    const eliminarCurso = (id) => {
        axios.delete(`http://localhost:8000/cursosprofesores/curso/${id}`)
            .then(() => {
                axios.delete(`http://localhost:8000/cursosalumnos/curso/${id}`)
                    .then(() => {
                        axios.delete(`http://localhost:8000/cursos/${id}`)
                            .then(() => {
                                alert('La curso se elimino');
                                obtenerCursos();
                            })
                            .catch(() => alert('Hubo un error al eliminar el curso.'));
                    })
                    .catch(() => {
                        axios.delete(`http://localhost:8000/cursos/${id}`)
                            .then(() => {
                                alert('La curso se elimino');
                                obtenerCursos();
                            })
                            .catch(() => alert('Hubo un error al eliminar el curso.'));
                    })
            })
    }

    const obtenerCursos = () => {
        axios.get('http://localhost:8000/cursos')
            .then((response) => {
                setCursos(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
        nombreInputRef.current.value = "";
    }

    const buscarCursos = () => {
        var nombre = nombreInputRef.current.value;
        axios.get(`http://127.0.0.1:8000/cursos/buscar/${nombre}`)
            .then((response) => {
                setCursos(response.data);
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
                <h1 className="p-2 w-100 bd-highlight ms-4">CURSOS</h1>
                <input ref={nombreInputRef} className="align-self-center form-control w-25 me-2" type="text" placeholder='Buscar por nombre'
                    aria-describedby="inputGroup-sizing-default" />
                <button type="button" className="align-self-center btn btn-success me-1" onClick={() => buscarCursos()}><BiSearchAlt style={icon_style} /></button>
                <button type="button" className="align-self-center btn btn-danger me-4" onClick={() => obtenerCursos()}><FiDelete style={icon_style} /></button>
            </div>
            <div className="container">
                <div className="justify-center mt-3">
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
                            {cursos.map((curso) => {
                                return <>
                                    <tr style={{ listStyle: 'none' }}>
                                        <th>{curso.id}</th>
                                        <td>{curso.nombre}</td>
                                        <td>{curso.fecha_inicio}</td>
                                        <td>{curso.fecha_fin}</td>
                                        <td>{curso.cantidad_alumnos}</td>
                                        <td>
                                            <button type="button" className="btn btn-primary" onClick={() => history.push(`/administrar/${curso.id}`)}>Administrar</button>
                                            <button type="button" className="btn btn-warning ms-3" onClick={() => history.push(`/cursos/${curso.id}`)}><AiOutlineEdit style={icon_style} /></button>
                                            <button type="button" className="btn btn-danger ms-3" onClick={() => eliminarCurso(curso.id)}><MdOutlineDelete style={icon_style} /></button>
                                        </td>
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <button className='btn btn-primary' style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={() => history.push(`/cursos/nuevo`)}>Agregar<MdAdd className='ms-2' style={icon_style} type="button" /></button>
        </>
    );
}


export default CursosListado;