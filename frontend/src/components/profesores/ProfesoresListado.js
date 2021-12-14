import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router';
import { BiSearchAlt } from "react-icons/bi";
import { FiDelete } from "react-icons/fi";
import { MdOutlineDelete, MdAdd } from "react-icons/md"
import { AiOutlineEdit } from "react-icons/ai"


const ProfesoresListado = () => {

    const [profesores, setProfesores] = useState([]);
    const apellidoInputRef = useRef();

    const history = useHistory();

    useEffect(() => {
        obtenerProfesores();
    }, []);

    const eliminarProfesor = (id) => {
        axios.delete(`http://localhost:8000/profesores/${id}`)
            .then(() => {
                alert('El profesor se elimino');
                obtenerProfesores();
            })
            .catch(() => alert('Hubo un error al eliminar el profesor.'));
    }

    const obtenerProfesores = () => {
        axios.get('http://localhost:8000/profesores')
            .then((response) => {
                setProfesores(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const buscarProfesores = () => {
        var apellido = apellidoInputRef.current.value;
        axios.get(`http://127.0.0.1:8000/profesores/buscar/${apellido}`)
            .then((response) => {
                setProfesores(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    let icon_style = {fontSize: "1.1em"};

    return (
        <>
            <div className="d-flex bd-highlight mt-3">
                <h1 className="p-2 w-100 bd-highlight ms-4">PROFESORES</h1>
                <input ref={apellidoInputRef} className="align-self-center form-control w-25 me-2" type="text" placeholder='Buscar por apellido'
                    aria-describedby="inputGroup-sizing-default" />
                <button type="button" className="align-self-center btn btn-success me-1" onClick={() => buscarProfesores()}><BiSearchAlt style={icon_style} /></button>
                <button type="button" className="align-self-center btn btn-danger me-4" onClick={() => obtenerProfesores()}><FiDelete style={icon_style} /></button>
            </div>
            <div className="container">
                <div className="justify-center mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Apellido</th>
                            </tr>
                        </thead>
                        <tbody>
                            {profesores.map((profesor) => {
                                return <>
                                    <tr style={{ listStyle: 'none' }}>
                                        <th>{profesor.id}</th>
                                        <td>{profesor.nombre}</td>
                                        <td>{profesor.apellido}</td>
                                        <td>
                                            {/* <button type="button" className="btn btn-info" onClick={() => {}}>Detalle</button> */}
                                            <button type="button" className="btn btn-warning ms-2" onClick={() => history.push(`/profesores/${profesor.id}`)}><AiOutlineEdit style={icon_style} /></button>
                                            <button type="button" className="btn btn-danger ms-2" onClick={() => eliminarProfesor(profesor.id)}><MdOutlineDelete style={icon_style} /></button>
                                        </td>
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <button className='btn btn-primary' style={{ position: 'fixed', bottom: 20, right: 20 }} onClick={() => history.push(`/profesores/nuevo`)}>Agregar<MdAdd className='ms-2' style={icon_style} type= "button"/></button>
        </>
    );
}


export default ProfesoresListado;