import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/server';
import { AuthContext } from '../context/AuthContext';

const PortalRegulares = () => {
    // Contexto de autenticación para saber quién está logueado
    const { user } = useContext(AuthContext);

    // Estados del componente
    const [seccionActiva, setSeccionActiva] = useState('resumen');
    const [estudiante, setEstudiante] = useState(null);
    const [notas, setNotas] = useState([]); 
    const [promedio, setPromedio] = useState('N/A'); // NUEVO: Estado para el promedio real calculado
    const [noticias, setNoticias] = useState([]); // NUEVO: Estado para el módulo de noticias
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Efecto para buscar los datos del estudiante y sus notas en Supabase al cargar el componente
    useEffect(() => {
        const obtenerDatos = async () => {
            if (!user || !user.cedula) {
                setLoading(false);
                return;
            }

            try {
                // 1. Consultamos a la tabla 'inscripciones' filtrando por la cédula del usuario activo
                const { data: estudianteData, error: supabaseError } = await supabase
                    .from('inscripciones')
                    .select('*')
                    .eq('cedula_alumno', user.cedula)
                    .order('fecha_inscripcion', { ascending: false }) 
                    .limit(1);

                if (supabaseError) throw supabaseError;

                if (estudianteData && estudianteData.length > 0) {
                    setEstudiante(estudianteData[0]);
                } else {
                    throw new Error("No se encontró un registro de estudiante asociado a este usuario.");
                }

                // 2. Consultamos las notas del estudiante
                const { data: notasData, error: notasError } = await supabase
                    .from('notas')
                    .select('*')
                    .eq('cedula_estudiante', user.cedula);

                if (notasError) throw notasError;

                if (notasData) {
                    let sumaNotas = 0;
                    let totalNotas = 0;

                    // Formateamos las notas y calculamos la definitiva si tiene todos los lapsos
                    const notasFormateadas = notasData.map((n) => {
                        const l1 = n.lapso1 !== null && n.lapso1 !== undefined ? parseFloat(n.lapso1) : null;
                        const l2 = n.lapso2 !== null && n.lapso2 !== undefined ? parseFloat(n.lapso2) : null;
                        const l3 = n.lapso3 !== null && n.lapso3 !== undefined ? parseFloat(n.lapso3) : null;

                        // Acumuladores para el promedio actual dinámico
                        if (l1 !== null) { sumaNotas += l1; totalNotas++; }
                        if (l2 !== null) { sumaNotas += l2; totalNotas++; }
                        if (l3 !== null) { sumaNotas += l3; totalNotas++; }

                        let definitiva = '-';
                        if (l1 !== null && l2 !== null && l3 !== null) {
                            definitiva = Math.round((l1 + l2 + l3) / 3).toString();
                        }

                        return {
                            materia: n.materia || 'Sin Asignar',
                            lapso1: l1 !== null ? l1 : '-',
                            lapso2: l2 !== null ? l2 : '-',
                            lapso3: l3 !== null ? l3 : '-',
                            definitiva: definitiva
                        };
                    });
                    
                    setNotas(notasFormateadas);

                    // Si existen notas cargadas en el sistema, calculamos el promedio con un decimal
                    if (totalNotas > 0) {
                        setPromedio((sumaNotas / totalNotas).toFixed(1));
                    }
                }

                // 3. Consultamos las publicaciones para el módulo de noticias desde la tabla de Información Portal
                const { data: portalNewsData } = await supabase
                    .from('noticias_portal')
                    .select('*')
                    .order('creado_en', { ascending: false });
                
                if (portalNewsData) {
                    setNoticias(portalNewsData);
                }

            } catch (err) {
                console.error("Error al obtener datos:", err.message);
                setError("No se pudieron cargar los datos del estudiante.");
            } finally {
                setLoading(false);
            }
        };

        obtenerDatos();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-rose-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">Cargando Portal...</p>
                </div>
            </div>
        );
    }

    if (error || !estudiante) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-rose-900 text-center max-w-md">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Datos no encontrados</h2>
                    <p className="text-slate-500 mb-6 text-sm">{error || "No se encontró un registro de estudiante asociado a este usuario."}</p>
                    <Link to="/" className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-800 transition">
                        Volver al inicio
                    </Link>
                </div>
            </div>
        );
    }

    // Variable auxiliar para obtener de manera segura la disciplina deportiva del alumno
    const disciplinaDeportiva = estudiante.deporte || estudiante.disciplina || user?.deporte || user?.disciplina || 'Boxeo';

    // Listado de noticias de respaldo en el frontend por si no hay registros guardados en la BD
    const noticiasFrontend = noticias.length > 0 ? noticias : [
        {
            id: 1,
            titulo: "Gran Final del Torneo Interno de Boxeo 2026",
            categoria: "COMPETENCIA",
            contenido: "Invitamos a toda la comunidad estudiantil a apoyar a nuestros destacados atletas de la disciplina de Boxeo este próximo viernes en el gimnasio central de la institución. ¡Asiste y apoya a tus compañeros!",
            creado_en: new Date().toISOString()
        },
        {
            id: 2,
            titulo: "Mantenimiento Preventivo de las Instalaciones",
            categoria: "AVISO",
            contenido: "Se informa a todos los alumnos regulares que el día de mañana se ejecutará una jornada de optimización en las áreas comunes. Las actividades matutinas operarán con total normalidad.",
            creado_en: new Date().toISOString()
        },
        {
            id: 3,
            titulo: "Cronograma de Evaluaciones para el Cierre de Lapso",
            categoria: "NOTICIA",
            contenido: "Ya se encuentra publicado el calendario oficial de asignaciones finales en las carteleras informativas. Recuerda revisar regularmente tu panel de calificaciones para monitorizar tus notas.",
            creado_en: new Date().toISOString()
        }
    ];

    // Función auxiliar para renderizar el contenido según la sección activa
    const renderizarContenido = () => {
        switch (seccionActiva) {
            case 'noticias':
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-rose-900 block"></span> Cartelera Informativa
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {noticiasFrontend.map((item, index) => (
                                <div key={item.id || index} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                    <div className="p-6 flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                                                item.categoria === 'AVISO' ? 'bg-amber-100 text-amber-800' :
                                                item.categoria === 'COMPETENCIA' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                {item.categoria || 'NOTICIA'}
                                            </span>
                                            <span className="text-xs text-slate-400 font-medium">
                                                {new Date(item.creado_en).toLocaleDateString('es-VE', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{item.titulo}</h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">{item.contenido}</p>
                                    </div>
                                    <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-right">
                                        <span className="text-xs font-bold text-rose-900 inline-flex items-center gap-1 cursor-pointer hover:underline">
                                            Leer noticia completa ➔
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'notas':
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-rose-900 block"></span> Calificaciones
                        </h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-900 text-white text-sm uppercase tracking-wider">
                                            <th className="p-4 font-bold">Materia / Asignatura</th>
                                            <th className="p-4 font-bold text-center">1er Lapso</th>
                                            <th className="p-4 font-bold text-center">2do Lapso</th>
                                            <th className="p-4 font-bold text-center">3er Lapso</th>
                                            <th className="p-4 font-bold text-center bg-rose-900">Definitiva</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-slate-700">
                                        {notas.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">
                                                    No hay calificaciones registradas para este periodo.
                                                </td>
                                            </tr>
                                        ) : (
                                            notas.map((nota, idx) => (
                                                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                                    <td className="p-4 font-semibold">{nota.materia}</td>
                                                    <td className="p-4 text-center font-medium">{nota.lapso1}</td>
                                                    <td className="p-4 text-center font-medium">{nota.lapso2}</td>
                                                    <td className="p-4 text-center font-medium text-slate-400">{nota.lapso3}</td>
                                                    <td className="p-4 text-center font-bold text-rose-900">{nota.definitiva}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-slate-50 border-t border-slate-200 text-sm text-slate-500 text-right">
                                * Las notas definitivas se calculan al finalizar el 3er Lapso.
                            </div>
                        </div>
                    </div>
                );

            case 'estatus':
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-rose-900 block"></span> Estatus Integral
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">Académico</h3>
                                <p className="text-sm text-slate-500 mb-3">Rendimiento actual</p>
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Aprobado / Solvente</span>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">Ficha Médica</h3>
                                <p className="text-sm text-slate-500 mb-3">Actualización de exámenes</p>
                                <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Pendiente</span>
                                <p className="text-xs text-slate-400 mt-3">Debes renovar tu constancia de niño sano antes del próximo lapso.</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-1">Deportivo</h3>
                                <p className="text-sm text-slate-500 mb-3">Participación en entrenamientos</p>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Activo</span>
                            </div>
                        </div>
                    </div>
                );

            case 'reinscripcion':
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-rose-900 block"></span> Proceso de Reinscripción
                        </h2>
                        
                        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl text-white relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div className="p-8 md:p-10 relative z-10">
                                <span className="text-rose-400 font-bold tracking-widest uppercase text-xs mb-2 block">Periodo Escolar 2026-2027</span>
                                <h3 className="text-3xl font-black mb-4">Asegura tu cupo para el próximo año</h3>
                                <p className="text-slate-300 mb-8 max-w-xl leading-relaxed">
                                    El proceso de reinscripción está habilitado para estudiantes regulares que cumplan con la solvencia académica y administrativa. Sube tus documentos actualizados para generar la planilla.
                                </p>
                                
                                <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 mb-8">
                                    <h4 className="font-bold mb-4 text-rose-300">Requisitos a cargar:</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-3 text-sm text-slate-300">
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            Boletín del año cursado
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-300">
                                            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            Constancia de residencia actualizada
                                        </li>
                                        <li className="flex items-center gap-3 text-sm text-slate-300">
                                            <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            Examen médico / Ficha antropométrica (Pendiente)
                                        </li>
                                    </ul>
                                </div>

                                <button className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 px-8 rounded-xl transition-colors w-full md:w-auto uppercase tracking-wider text-sm shadow-lg shadow-rose-900/50">
                                    Iniciar Reinscripción
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'resumen':
            default:
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-6 flex items-center gap-2">
                            <span className="w-8 h-1 bg-rose-900 block"></span> Mi Tablero
                        </h2>
                        
                        {/* Tarjetas de Resumen */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-t-4 border-t-rose-900">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Promedio Actual</p>
                                <p className="text-3xl font-black text-slate-900">{promedio}</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Faltas Injustificadas</p>
                                <p className="text-3xl font-black text-slate-900">0</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 lg:col-span-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Próximo Evento</p>
                                <p className="text-xl font-bold mb-2">Cierre del 2do Lapso Académico</p>
                                <p className="text-sm text-slate-300 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    15 de Julio, 2026
                                </p>
                            </div>
                        </div>

                        {/* Información del Perfil Conectada a la BD */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center text-rose-900 text-3xl font-black shrink-0 border-4 border-white shadow-md uppercase">
                                {estudiante.nombres?.charAt(0)}{estudiante.apellidos?.charAt(0)}
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black text-slate-900 capitalize">{estudiante.nombres} {estudiante.apellidos}</h3>
                                <p className="text-rose-600 font-bold tracking-wide uppercase text-sm mt-1 mb-3">{estudiante.anio_cursar || estudiante.grado}</p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    <span className="bg-slate-200 text-slate-700 text-xs px-3 py-1 rounded-full font-semibold">C.I: {estudiante.cedula_alumno || estudiante.cedula}</span>
                                    <span className="bg-slate-900 text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                                        Disciplina: {disciplinaDeportiva}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans">
            
            {/* SIDEBAR */}
            <aside className="w-full md:w-64 bg-[#0f172a] text-slate-300 flex flex-col md:min-h-screen shadow-2xl relative z-20">
                <div className="p-6 bg-[#090e1a] border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-900 rounded-full flex items-center justify-center text-white font-black text-xl shrink-0">
                        MVG
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-sm leading-tight">Portal de<br/><span className="text-rose-500">Regulares</span></h1>
                    </div>
                </div>

                <nav className="flex-grow p-4 space-y-2">
                    <button 
                        onClick={() => setSeccionActiva('resumen')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${seccionActiva === 'resumen' ? 'bg-rose-900 text-white shadow-md shadow-rose-900/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        Resumen
                    </button>
                    
                    <button 
                        onClick={() => setSeccionActiva('noticias')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${seccionActiva === 'noticias' ? 'bg-rose-900 text-white shadow-md shadow-rose-900/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 4a2 2 0 012 2v4a2 2 0 01-2 2h-2.343M11 7.343l1.657-1.657m0 0l1.657 1.657M12.657 5.686V12"></path></svg>
                        Noticias
                    </button>

                    <button 
                        onClick={() => setSeccionActiva('notas')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${seccionActiva === 'notas' ? 'bg-rose-900 text-white shadow-md shadow-rose-900/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        Calificaciones
                    </button>

                    <button 
                        onClick={() => setSeccionActiva('estatus')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${seccionActiva === 'estatus' ? 'bg-rose-900 text-white shadow-md shadow-rose-900/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        Estatus
                    </button>

                    <button 
                        onClick={() => setSeccionActiva('reinscripcion')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${seccionActiva === 'reinscripcion' ? 'bg-rose-900 text-white shadow-md shadow-rose-900/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Reinscripción
                    </button>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link to="/" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-rose-600 rounded-xl transition-colors font-bold text-sm text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Cerrar Sesión
                    </Link>
                </div>
            </aside>

            {/* ÁREA PRINCIPAL */}
            <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
                
                {/* Header Superior Conectado a la BD */}
                <header className="bg-white px-8 py-4 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                    <div className="text-slate-500 font-medium text-sm hidden md:block">
                        Periodo Escolar <span className="font-bold text-slate-900">2025-2026</span>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none capitalize">{estudiante.nombres}</p>
                            <span className="text-xs text-rose-600 font-semibold">{disciplinaDeportiva}</span>
                        </div>
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold uppercase">
                            {estudiante.nombres?.charAt(0)}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 relative">
                    {renderizarContenido()}
                </div>

            </main>

        </div>
    );
};

export default PortalRegulares;