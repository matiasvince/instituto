import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';

const CursosFormulario = () => {
    // const idInputRef = useRef();
    const nombreInputRef = useRef();
    const fecha_inicioInputRef = useRef();
    const fecha_finInputRef = useRef();
    const cantidad_alumnosInputRef = useRef();

    const history = useHistory();
    const { id_curso } = useParams();

    useEffect(() => {
        if (id_curso) {
            axios.get(`http://localhost:8000/cursos/${id_curso}`)
                .then((response) => {
                    const curso = response.data;

                    // idInputRef.current.value = curso.id;
                    nombreInputRef.current.value = curso.nombre;
                    fecha_inicioInputRef.current.value = curso.fecha_inicio;
                    fecha_finInputRef.current.value = curso.fecha_fin;
                    cantidad_alumnosInputRef.current.value = curso.cantidad_alumnos;
                })
        }
    }, [id_curso]);


    const nuevo = () => {
        return {
            // id: idInputRef.current.value,
            nombre: nombreInputRef.current.value,
            fecha_inicio: fecha_inicioInputRef.current.value,
            fecha_fin: fecha_finInputRef.current.value,
            cantidad_alumnos: cantidad_alumnosInputRef.current.value,
        }
    }

    
    const edit = () => {
        return {
            id: id_curso,
            nombre: nombreInputRef.current.value,
            fecha_inicio: fecha_inicioInputRef.current.value,
            fecha_fin: fecha_finInputRef.current.value,
            cantidad_alumnos: cantidad_alumnosInputRef.current.value,
        }
    }

    const agregarCurso = () => {
        const curso = nuevo();
        axios.post('http://localhost:8000/cursos/', curso)
            .then(() => {
                alert("Se agrego correctamente");
                history.push('/cursos');
            })
            .catch(() => alert("Hubo un error al agregar la curso."));
    }

    const editarCurso = () => {
        const curso = edit();
        axios.put(`http://localhost:8000/cursos/${curso.id}`, curso)
            .then(() => {
                alert('Se edito correctamente');
                history.push('/cursos')
            })
            .catch(() => alert('Hubo un error al editar la curso.'));
    }

    return (
        <>
            <div className="container">
                <div className="row vh-100 justify-content-center align-items-center">
                    <div className="col-auto bg-light pt-4 pb-5 ps-5 pe-5">
                        <h1 className="text-center mb-4">CURSO</h1>
                        {/* <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">ID</span>
                            <input ref={idInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div> */}
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Nombre</span>
                            <input ref={nombreInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Fecha inicio</span>
                            <input ref={fecha_inicioInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Fecha fin</span>
                            <input ref={fecha_finInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Cantidad alumnos</span>
                            <input ref={cantidad_alumnosInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>
                        <button className="btn btn-success w-100 mt-4" onClick={id_curso != null ? editarCurso : agregarCurso}>
                            {id_curso != null ? 'Editar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CursosFormulario;