import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';

const CursosAlumnosFormulario = () => {
    const legajoInputRef = useRef();
    const estadoInputRef = useRef();

    const history = useHistory();
    const { id_curso } = useParams();
    const { legajo } = useParams();
    const [alumnos, setAlumnos] = useState([]);

    useEffect(() => {
        if (legajo) {
            axios.get(`http://localhost:8000/cursosalumnos/ids/${id_curso}/${legajo}`)
                .then((response) => {
                    const cursoalumno = response.data;
                    axios.get(`http://localhost:8000/alumnos/${legajo}`)
                        .then((resp) => {

                            var s = document.getElementById('alumno_option');
                            var option = document.createElement('option');
                            option.value = cursoalumno.legajo;
                            option.text = `${legajo} - ${resp.data.nombre} ${resp.data.apellido}`;
                            s.appendChild(option);
                            s.value = cursoalumno.legajo;
                            s.setAttribute('disabled', 'disabled');

                            document.getElementById('estado_option').value = cursoalumno.estado;
                        })


                    // idInputRef.current.value = cursoalumno.id;
                    // nombreInputRef.current.value = cursoalumno.nombre;
                    // apellidoInputRef.current.value = cursoalumno.apellido;
                    // estadoInputRef.current.value = cursoalumno.estado;
                    // cantidad_alumnosInputRef.current.value = cursoalumno.cantidad_alumnos;
                })
        }
        setAlumnos([]);
        obtenerAlumnos();
    }, [id_curso]);


    const nuevo = () => {
        var selected_alumno = document.getElementById('alumno_option');
        var alumno_selected = selected_alumno.options[selected_alumno.selectedIndex].value;

        var selected_estado = document.getElementById('estado_option');
        var estado_selected = selected_estado.options[selected_estado.selectedIndex].value;
        return {
            legajo: alumno_selected,
            id_curso: id_curso,
            estado: estado_selected,
        }
    }


    const edit = () => {
        var selected_estado = document.getElementById('estado_option');
        var estado_selected = selected_estado.options[selected_estado.selectedIndex].value;
        return {
            id_curso: id_curso,
            legajo: legajo,
            // nombre: nombreInputRef.current.value,
            // apellido: apellidoInputRef.current.value,
            estado: estado_selected,
        }
    }

    const agregarCursoAlumno = () => {
        const cursoalumno = nuevo();
        axios.post('http://localhost:8000/cursosalumnos/', cursoalumno)
            .then(() => {
                alert("Se agrego correctamente");
                history.push(`/administrar/${id_curso}`);
            })
            .catch(() => alert("No se pudo agregar el alumno. Probablemente los cupos estén llenos"));
    }

    const editarCursoAlumno = () => {
        const curso = edit();
        axios.put(`http://localhost:8000/cursosalumnos/${id_curso}/${legajo}`, curso)
            .then(() => {
                alert('Se edito correctamente');
                history.push(`/administrar/${id_curso}`);
            })
            .catch(() => alert('Hubo un error al editar la curso.'));
    }

    //Arreglar para que se use con obtener con legajo y id_curso, directamente llamando por el back
    const obtenerAlumnos = () => {
        setAlumnos([]);
        axios.get('http://localhost:8000/alumnos')
            .then((response) => {
                const alumns = response.data;
                // const final = [];
                alumns.map((alumn) => {
                    axios.get(`http://localhost:8000/cursosalumnos/legajo/${alumn.legajo}`)
                        .then((resp) => {
                            const cursosalumno = resp.data;
                            if (cursosalumno.length > 0 && !cursosalumno.some((a) => a.id_curso == id_curso)) {
                                cursosalumno.map((ca) => {
                                    if (ca.id_curso != id_curso) {
                                        setAlumnos(alumnos => [...alumnos, alumn]);
                                    }
                                })
                            }
                            else if (cursosalumno.length == 0) {
                                setAlumnos(alumnos => [...alumnos, alumn]);
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
                        <h1 className="text-center mb-4">ALUMNO CURSO</h1>
                        {/* <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">ID</span>
                            <input ref={idInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div> */}
                        {/* <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Nombre</span>
                            <input ref={nombreInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Apellido</span>
                            <input ref={apellidoInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div> */}
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="alumno_option">Alumno</label>
                            <select class="form-select" id="alumno_option">
                                <option selected>Seleccione un alumno</option>
                                {alumnos.map((alumno) => {
                                    return <>
                                        <option ref={legajoInputRef} value={alumno.legajo}>{alumno.legajo} - {alumno.nombre} {alumno.apellido}</option>
                                    </>
                                })}
                            </select>
                        </div>
                        <div class="input-group mb-3">
                            <label class="input-group-text" for="estado_option">Estado</label>
                            <select class="form-select" id="estado_option">
                                <option selected value='null'>Seleccione un estado</option>
                                <option ref={estadoInputRef} value="Cursando">Cursando</option>
                                <option ref={estadoInputRef} value="Regular">Regular</option>
                                <option ref={estadoInputRef} value="Aprobado">Aprobado</option>
                            </select>
                        </div>

                        <button className="btn btn-success w-100 mt-4" onClick={legajo != null ? editarCursoAlumno : agregarCursoAlumno}>
                            {legajo != null ? 'Editar' : 'Agregar'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CursosAlumnosFormulario;