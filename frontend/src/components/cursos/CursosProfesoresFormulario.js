import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';

const CursosProfesoresFormulario = () => {
    const id_profesorInputRef = useRef();
    // const nombreInputRef = useRef();
    // const apellidoInputRef = useRef();
    const cargoInputRef = useRef();

    const history = useHistory();
    const { id_curso } = useParams();
    const { id_profesor } = useParams();
    const [profesores, setProfesores] = useState([]);

    useEffect(() => {
        // if (id_profesor) {
        //     axios.get(`http://localhost:8000/cursosprofesores/ids/${id_curso}/${id_profesor}`)
        //         .then((response) => {
        //             const cursoprofesor = response.data;
        //             axios.get(`http://localhost:8000/profesores/${id_profesor}`)
        //                 .then((resp) => {
        //                     var s = document.getElementById('profesor_option');
        //                     var option = document.createElement('option');
        //                     option.value = cursoprofesor.id_profesor;
        //                     option.text = `${id_profesor} - ${resp.data.nombre} ${resp.data.apellido}`;
        //                     s.appendChild(option);
        //                     s.value = cursoprofesor.id_profesor;
        //                     // s.setAttribute('disabled', 'disabled');

        //                     document.getElementById('cargo_option').value = cursoprofesor.cargo;
        //                 })
        //         })
        // }
        setProfesores([]);
        obtenerProfesores();
    }, [id_curso]);


    const nuevo = () => {
        var selected_profesor = document.getElementById('profesor_option');
        var profesor_selected = selected_profesor.options[selected_profesor.selectedIndex].value;

        return {
            id_profesor: profesor_selected,
            id_curso: id_curso,
            cargo: 'Auxiliar',
        }
    }

    const agregarCursoProfesor = () => {
        const cursoprofesor = nuevo();
        axios.post('http://localhost:8000/cursosprofesores/', cursoprofesor)
            .then(() => {
                alert("Se agrego correctamente");
                history.push(`/administrar/${id_curso}`);
            })
            .catch(() => alert("Hubo un error al agregar la curso."));
    }

    //Arreglar para que se use con obtener con id_profesor y id_curso, directamente llamando por el back
    const obtenerProfesores = () => {
        axios.get('http://localhost:8000/profesores')
            .then((response) => {
                const profes = response.data;
                // const final = [];
                profes.map((profe) => {
                    axios.get(`http://localhost:8000/cursosprofesores/id_profesor/${profe.id}`)
                        .then((resp) => {
                            const cursosprofesor = resp.data;
                            if (cursosprofesor.length > 0 && !cursosprofesor.some((a) => a.id_curso == id_curso)) {
                                cursosprofesor.map((ca) => {
                                    if (ca.id_curso != id_curso) {
                                        setProfesores(profesores => [...profesores, profe]);
                                    }
                                })
                            }
                            else if (cursosprofesor.length == 0) {
                                setProfesores(profesores => [...profesores, profe]);
                            }
                        })
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return (
        <>
            <div className="container">
                <div className="row vh-100 justify-content-center align-items-center">
                    <div className="col-auto bg-light pt-4 pb-5 ps-5 pe-5">
                        <h1 className="text-center mb-4">PROFESOR CURSO</h1>
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="profesor_option">Profesor</label>
                            <select class="form-select" id="profesor_option">
                                <option selected>Seleccione un profesor</option>
                                {profesores.map((profesor) => {
                                    return <>
                                        <option ref={id_profesorInputRef} value={profesor.id}>{profesor.id} - {profesor.nombre} {profesor.apellido}</option>
                                    </>
                                })}
                            </select>
                        </div>
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="cargo_option">Cargo</label>
                            <select class="form-select" id="cargo_option" disabled>
                                <option selected >Seleccione un cargo</option>
                                <option ref={cargoInputRef} value="Auxiliar" selected>Auxiliar</option>
                            </select>
                        </div>

                        <button className="btn btn-success w-100 mt-4" onClick={agregarCursoProfesor}>Agregar</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CursosProfesoresFormulario;