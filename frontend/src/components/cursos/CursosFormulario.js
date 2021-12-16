import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
registerLocale('es', es);

const CursosFormulario = () => {
    // const idInputRef = useRef();
    const nombreInputRef = useRef();
    const fecha_inicioInputRef = useRef();
    const fecha_finInputRef = useRef();
    const cantidad_alumnosInputRef = useRef();
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());

    const [profesores, setProfesores] = useState([]);
    const history = useHistory();
    const { id_curso } = useParams();

    useEffect(() => {

        // axios.get(`http://localhost:8000/profesores/`)
        //     .then((resp) => {
        //         resp.data.map((prof) => {
        //             var s = document.getElementById('profesor_option');
        //             var option = document.createElement('option');
        //             option.value = prof.id;
        //             option.text = `${prof.id} - ${prof.nombre} ${prof.apellido}`;
        //             s.appendChild(option);
        //             s.value = prof.id;
        //         })
        //     })

        if (id_curso) {
            axios.get(`http://localhost:8000/cursos/${id_curso}`)
                .then((response) => {
                    axios.get(`http://localhost:8000/cursosprofesores/id_curso/${id_curso}`)
                        .then((resp) => {
                            const profes = resp.data;
                            profes.map(profe => {
                                if (profe.cargo == 'Titular') {
                                    document.getElementById('profesor_option').value = profe.id_profesor;
                                }
                            });
                            const curso = response.data;

                            var parts_fi = curso.fecha_inicio.split("/");
                            var fi = new Date(Number(parts_fi[2]), Number(parts_fi[1]) - 1, Number(parts_fi[0]));

                            var parts_ff = curso.fecha_fin.split("/");
                            var ff = new Date(Number(parts_ff[2]), Number(parts_ff[1]) - 1, Number(parts_ff[0]));

                            nombreInputRef.current.value = curso.nombre;
                            setFechaInicio(fi);
                            setFechaFin(ff);
                            cantidad_alumnosInputRef.current.value = curso.cantidad_alumnos;
                        });
                })

            // axios.get(`http://localhost:8000/profesores`)
            //     .then((resp) => {
            //         resp.data.map(profe => {
            //             var s = document.getElementById('profesor_option');
            //             var option = document.createElement('option');
            //             option.value = profe.id;
            //             option.text = `${profe.id} - ${profe.nombre} ${profe.apellido}`;
            //             s.appendChild(option);
            //             s.value = profe.id;
            //         })
            //     })
            // axios.get(`http://localhost:8000/cursosprofesores/id_curso/${id_curso}`)
            //     .then((response) => {
            //         const final = response.data.find(profe => profe.cargo == 'Titular');
            //         axios.get(`http://localhost:8000/profesores/${final.id_profesor}`)
            //             .then((profe) => {
            //                 var s = document.getElementById('profesor_option');
            //                 var option = document.createElement('option');
            //                 option.value = profe.id;
            //                 option.text = `${profe.data.id} - ${profe.data.nombre} ${profe.data.apellido}`;
            //                 s.appendChild(option);
            //                 s.value = profe.id;
            //                 s.setAttribute('disabled', 'disabled');
            //             })
            //     })
        }
        obtenerProfesores();
    }, [id_curso]);


    const nuevo = () => {
        return {
            // id: idInputRef.current.value,
            nombre: nombreInputRef.current.value,
            fecha_inicio: fechaInicio.getDate() + '/' + (fechaInicio.getMonth() + 1) + '/' + fechaInicio.getFullYear(),
            fecha_fin: fechaFin.getDate() + '/' + (fechaFin.getMonth() + 1) + '/' + fechaFin.getFullYear(),
            cantidad_alumnos: cantidad_alumnosInputRef.current.value,
        }
    }


    const edit = () => {
        var selected_profesor = document.getElementById('profesor_option');
        var profesor_selected = selected_profesor.options[selected_profesor.selectedIndex].value;

        return {
            id: id_curso,
            nombre: nombreInputRef.current.value,
            fecha_inicio: fechaInicio.getDate() + '/' + (fechaInicio.getMonth() + 1) + '/' + fechaInicio.getFullYear(),
            fecha_fin: fechaFin.getDate() + '/' + (fechaFin.getMonth() + 1) + '/' + fechaFin.getFullYear(),
            cantidad_alumnos: cantidad_alumnosInputRef.current.value,
            id_profesor: profesor_selected
        }
    }

    const agregarCurso = () => {
        const curso = nuevo();

        var selected_profesor = document.getElementById('profesor_option');
        var profesor_selected = selected_profesor.options[selected_profesor.selectedIndex].value;

        if (profesor_selected != 'null') {
            axios.post('http://localhost:8000/cursos/', curso)
                .then((response) => {
                    axios.post('http://localhost:8000/cursosprofesores/', { 'id_curso': response.data.id, 'id_profesor': profesor_selected, 'cargo': 'Titular' })
                        .then(() => {
                            alert("Se agrego correctamente");
                            history.push('/cursos');
                        })
                })
                .catch(() => alert("Hubo un error al agregar la curso."));
        }
        else {
            alert('Debe seleccionar un profesor titular');
        }
    }

    const editarCurso = () => {
        const curso = edit();

        axios.put(`http://localhost:8000/cursos/${curso.id}`, curso)
            .then(() => {
                axios.get(`http://localhost:8000/cursosprofesores/id_curso/${curso.id}`)
                    .then((resp) => {
                        const profes = resp.data;
                        profes.map(profe => {
                            if (profe.cargo == 'Titular') {
                                const final = { 'id_curso': curso.id, 'id_profesor': curso.id_profesor, 'cargo': 'Titular' }
                                axios.put(`http://localhost:8000/cursosprofesores/${curso.id}/${profe.id_profesor}`, final)
                                    .then(() => {
                                        alert('Se edito correctamente');
                                        history.push('/cursos')
                                    })
                                    .catch(() => alert('Hubo un error al editar la curso.'));
                            }
                        })
                    })
            })
            .catch(() => alert('Hubo un error al editar el curso.'));
    }

    const obtenerProfesores = () => {
        axios.get('http://localhost:8000/profesores')
            .then((response) => {
                const profes = response.data;
                setProfesores(profes);
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
                            <span className="input-group-text">Fecha inicio</span>
                            {/* <input ref={fecha_inicioInputRef} className="form-control"/> */}
                            <div>
                                <DatePicker dateFormat="dd/MM/yyyy" locale='es' className="form-control" selected={fechaInicio} onChange={(date) => setFechaInicio(date)} />
                            </div>
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Fecha fin</span>
                            <div>
                                <DatePicker dateFormat="dd/MM/yyyy" locale='es' className="form-control" selected={fechaFin} onChange={(date) => setFechaFin(date)} />
                            </div>
                            {/* <input ref={fecha_finInputRef} type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" /> */}
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text" id="inputGroup-sizing-default">Cantidad alumnos</span>
                            <input ref={cantidad_alumnosInputRef} type="number" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" />
                        </div>

                        <div class="input-group mb-3">
                            <label class="input-group-text" for="profesor_option">Profesor</label>
                            <select class="form-select" id="profesor_option">
                                <option selected value='null'>Seleccione un profesor</option>
                                {profesores.map((profesor) => {
                                    return <>
                                        <option value={profesor.id}>{profesor.id} - {profesor.nombre} {profesor.apellido}</option>
                                    </>
                                })}
                            </select>
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