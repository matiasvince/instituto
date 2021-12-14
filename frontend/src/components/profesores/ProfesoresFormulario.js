import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';

const ProfesoresFormulario = () => {
    // const idInputRef = useRef();
    const nombreInputRef = useRef();
    const apellidoInputRef = useRef();

    const history = useHistory();
    const { id_profesor } = useParams();

    useEffect(() => {
        if (id_profesor) {
            axios.get(`http://localhost:8000/profesores/${id_profesor}`)
                .then((response) => {
                    const profesor = response.data;

                    // idInputRef.current.value = profesor.id;
                    nombreInputRef.current.value = profesor.nombre;
                    apellidoInputRef.current.value = profesor.apellido;
                })
        }
    }, [id_profesor]);


    const nuevo = () => {
        return {
            // id: idInputRef.current.value,
            nombre: nombreInputRef.current.value,
            apellido: apellidoInputRef.current.value,
        }
    }

    
    const edit = () => {
        return {
            id: id_profesor,
            nombre: nombreInputRef.current.value,
            apellido: apellidoInputRef.current.value,
        }
    }

    const agregarProfesor = () => {
        const profesor = nuevo();
        axios.post('http://localhost:8000/profesores/', profesor)
            .then(() => {
                alert("Se agrego correctamente");
                history.push('/profesores');
            })
            .catch(() => alert("Hubo un error al agregar la profesor."));
    }

    const editarProfesor = () => {
        const profesor = edit();
        axios.put(`http://localhost:8000/profesores/${profesor.id}`, profesor)
            .then(() => {
                alert('Se edito correctamente');
                history.push('/profesores')
            })
            .catch(() => alert('Hubo un error al editar la profesor.'));
    }

    return (
        <>
            <div className="container">
                <div className="row vh-100 justify-content-center align-items-center">
                    <div className="col-auto bg-light pt-4 pb-5 ps-5 pe-5">
                        <h1 className="text-center mb-4">PROFESOR</h1>
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

                        <button className="btn btn-success w-100 mt-4" onClick={id_profesor != null ? editarProfesor : agregarProfesor}>
                            {id_profesor != null ? 'Editar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfesoresFormulario;