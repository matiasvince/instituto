import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';

const AlumnosFormulario = () => {
    // const idInputRef = useRef();
    const nombreInputRef = useRef();
    const apellidoInputRef = useRef();

    const history = useHistory();
    const { legajo } = useParams();

    useEffect(() => {
        if (legajo) {
            axios.get(`http://localhost:8000/alumnos/${legajo}`)
                .then((response) => {
                    const alumno = response.data;

                    // idInputRef.current.value = alumno.id;
                    nombreInputRef.current.value = alumno.nombre;
                    apellidoInputRef.current.value = alumno.apellido;
                })
        }
    }, [legajo]);


    const nuevo = () => {
        return {
            // id: idInputRef.current.value,
            nombre: nombreInputRef.current.value,
            apellido: apellidoInputRef.current.value,
        }
    }

    
    const edit = () => {
        return {
            id: legajo,
            nombre: nombreInputRef.current.value,
            apellido: apellidoInputRef.current.value,
        }
    }

    const agregarAlumno = () => {
        const alumno = nuevo();
        axios.post('http://localhost:8000/alumnos/', alumno)
            .then(() => {
                alert("Se agrego correctamente");
                history.push('/alumnos');
            })
            .catch(() => alert("Hubo un error al agregar la alumno."));
    }

    const editarAlumno = () => {
        const alumno = edit();
        axios.put(`http://localhost:8000/alumnos/${alumno.id}`, alumno)
            .then(() => {
                alert('Se edito correctamente');
                history.push('/alumnos')
            })
            .catch(() => alert('Hubo un error al editar la alumno.'));
    }

    return (
        <>
            <div className="container">
                <div className="row vh-100 justify-content-center align-items-center">
                    <div className="col-auto bg-light pt-4 pb-5 ps-5 pe-5">
                        <h1 className="text-center mb-4">ALUMNO</h1>
                        {/* <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">ID</span>
                            <input ref={idInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div> */}
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Nombre</span>
                            <input ref={nombreInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Apellido</span>
                            <input ref={apellidoInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>
                        <button className="btn btn-success w-100 mt-4" onClick={legajo != null ? editarAlumno : agregarAlumno}>
                            {legajo != null ? 'Editar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AlumnosFormulario;