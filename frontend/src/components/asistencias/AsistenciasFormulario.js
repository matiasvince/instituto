import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router';
import DatePicker, { registerLocale } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import es from "date-fns/locale/es";
import subDays from "date-fns/subDays";
registerLocale('es', es);

const AsistenciasFormulario = () => {

    const [curso, setCurso] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [fecha, setFecha] = useState(new Date());
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaFin, setFechaFin] = useState(new Date());
    const [fechaString, setFechaString] = useState('');
    const [alumnos, setAlumnos] = useState([]);
    const [asistencias, setAsistencias] = useState([]);
    const { id_curso } = useParams();

    useEffect(() => {
        obtenerCurso();
        obtenerAlumnos();
        obtenerFechas();
        const date = new Date();
        setFechaString(date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear())
    }, [fecha]);


    const obtenerRangoFechas = (fecha_inicio, fecha_fin) => {
        var parts_fecha = fecha_inicio.split("-");
        var date = new Date(Number(parts_fecha[2]), Number(parts_fecha[1]) - 1, Number(parts_fecha[0]));
        var final = subDays(date, 0);
        setFechaInicio(final);

        var parts_fecha2 = fecha_fin.split("-");
        var date2 = new Date(Number(parts_fecha2[2]), Number(parts_fecha2[1]) - 1, Number(parts_fecha2[0]));
        var final2 = subDays(date2, 0);
        setFechaFin(final2);
    }

    const obtenerCurso = () => {
        setCurso([]);
        axios.get(`http://localhost:8000/cursos/${id_curso}`)
            .then((response) => {
                setCurso(response.data);
                obtenerRangoFechas(response.data.fecha_inicio, response.data.fecha_fin)
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const obtenerAlumnos = () => {
        setAlumnos([]);
        axios.get(`http://localhost:8000/cursosalumnos/id_curso/${id_curso}`)
            .then((response) => {
                response.data.map(alumno => {
                    axios.get(`http://localhost:8000/alumnos/${alumno.legajo}`)
                        .then((resp) => {
                            setAlumnos(alumn => [...alumn, resp.data]);
                        })
                })
                setAsistencias([]);
                obtenerAsistencias();
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const obtenerAsistencias = () => {
        setAsistencias([]);
        alumnos.map((alumno) => {
            axios.get(`http://localhost:8000/asistencias/todo/${id_curso}/${alumno.legajo}/${fechaString}`)
                .then((response) => {
                    const final = { 'id_curso': id_curso, 'legajo': alumno.legajo, 'alumno': `${alumno.legajo} - ${alumno.nombre} ${alumno.apellido}`, 'fecha': fechaString, 'asistencia': response.data[0].asistencia }
                    setAsistencias(asistencia => [...asistencia, final]);
                })
                .catch((error) => { //Aca maneja cuando no hay asistencia registrada en esa fecha
                    const final = { 'id_curso': id_curso, 'legajo': alumno.legajo, 'alumno': `${alumno.legajo} - ${alumno.nombre} ${alumno.apellido}`, 'fecha': fechaString, 'asistencia': 'null' }
                    setAsistencias(asistencia => [...asistencia, final]);
                    console.log(error);
                })
        })
    }

    const obtenerFechas = () => {
        axios.get(`http://localhost:8000/asistencias/id_curso/${id_curso}`)
            .then((response) => {
                response.data.map((asistencia) => {
                    var parts_fecha = asistencia.fecha.split("-");
                    var date = new Date(Number(parts_fecha[2]), Number(parts_fecha[1]) - 1, Number(parts_fecha[0]));
                    var final = subDays(date, 0);
                    setFechas(fecha => [...fecha, final]);

                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const agregarAsistencia = () => {
        var valid_selected = true;
        asistencias.map((asistencia) => {
            var selected_asistencia = document.getElementById(`asistencia_option_${asistencia.legajo}`);
            var asistencia_selected = selected_asistencia.options[selected_asistencia.selectedIndex].value;
            if (asistencia_selected == 'null') valid_selected = false;
        })

        if (valid_selected) {
            asistencias.map((asistencia) => {
                var selected_asistencia = document.getElementById(`asistencia_option_${asistencia.legajo}`);
                var asistencia_selected = selected_asistencia.options[selected_asistencia.selectedIndex].value;

                if (asistencia.asistencia == 'null') {
                    axios.post(`http://localhost:8000/asistencias`, { 'id_curso': asistencia.id_curso, 'legajo': asistencia.legajo, 'fecha': asistencia.fecha, 'asistencia': asistencia_selected })
                }
                else if (asistencia.asistencia != asistencia_selected) {
                    axios.put(`http://localhost:8000/asistencias/${asistencia.id_curso}/${asistencia.legajo}/${asistencia.fecha}`,
                        { 'id_curso': asistencia.id_curso, 'legajo': asistencia.legajo, 'fecha': asistencia.fecha, 'asistencia': asistencia_selected })
                }
            })
            alert('Se tomó asistencia correctamente.')
        }
        else {
            alert('Revise que todos los campos esten completados')
        }
    }


    return (
        <>
            <div className="d-flex bd-highlight mt-3">
                <h1 className="p-2 w-100 bd-highlight ms-4">ASISTENCIA</h1>
            </div>
            <div className='ms-5 d-flex flex-row bd-highlight mb-3'>
                <div class="input-group mb-3 w-50">
                    <label class="input-group-text" for="profesor_option">Profesor</label>
                    <select class="form-select" id="profesor_option" disabled>
                        <option value={curso.id} selected>{curso.id} - {curso.nombre}</option>
                    </select>
                </div>
                <div className="input-group mb-3 ms-5">
                    <span className="input-group-text" id="inputGroup-sizing-default">Fecha fin</span>
                    <div>
                        <DatePicker dateFormat="dd/MM/yyyy" locale='es' className="form-control" selected={fecha}
                            onChange={(date) => {
                                setFecha(date);
                                setFechaString(date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear());
                            }}
                            highlightDates={fechas}
                            onClick={() => obtenerFechas()} 
                            includeDateIntervals={[{start: fechaInicio, end: fechaFin}]}
                            />
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="justify-center mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Alumno</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Asistencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asistencias.map((asistencia) => {
                                return <>
                                    <tr style={{ listStyle: 'none' }}>
                                        <th>{asistencia.alumno}</th>
                                        <td>{asistencia.fecha}</td>
                                        <td>
                                            <select class="form-select" id={`asistencia_option_${asistencia.legajo}`}>
                                                <option value='null' selected={asistencia.asistencia == 'null' ? true : false}>Seleccione una opcion</option>
                                                <option value='Ausente' selected={asistencia.asistencia == 'Ausente' ? true : false}>Ausente</option>
                                                <option value='Ausente c/J' selected={asistencia.asistencia == 'Ausente c/J' ? true : false}>Ausente c/J</option>
                                                <option value='Presente' selected={asistencia.asistencia == 'Presente' ? true : false}>Presente</option>
                                            </select>
                                        </td>
                                    </tr>
                                </>
                            })}
                        </tbody>
                    </table>
                </div>
                <div class="d-flex flex-row-reverse bd-highlight">
                    <button className="btn btn-success px-5 me-2" onClick={() => agregarAsistencia()}>Aplicar</button>
                </div>
            </div>
        </>
    );
}


export default AsistenciasFormulario;