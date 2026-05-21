import { useState } from 'react';
import { Link } from 'react-router-dom';

const PreRegistro = () => {
    // Estado para cambiar entre el formulario y la pantalla de éxito
    const [registrado, setRegistrado] = useState(false);
    const [codigoAsignado, setCodigoAsignado] = useState('');
    
    // Estados independientes para controlar cada modal
    const [showRequisitosModal, setShowRequisitosModal] = useState(false);
    const [showDescargasModal, setShowDescargasModal] = useState(false);

    // Lista de requisitos físicos
    const requisitosFisicos = [
        "Estudiante de 6to. grado (Constancia de estudio original)",
        "Constancia original de niño sano",
        "Planilla de pre-inscripción impresa (L.T.D.M.V.G)",
        "Foto tipo carnet reciente del aspirante y del representante",
        "Copia fotostática de la cédula del aspirante y del representante",
        "Copia certificada de la partida de nacimiento del aspirante"
    ];

    const handleRegistro = (e) => {
        e.preventDefault();
        const codigoSimulado = "MVG-" + Math.floor(10000 + Math.random() * 90000);
        setCodigoAsignado(codigoSimulado);
        setRegistrado(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="w-12 h-12 bg-rose-900 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4 shadow-md">MVG</div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Preinscripción 2026</h2>
                <p className="mt-2 text-sm text-slate-600">Fase 1: Registro y solicitud de prueba física</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl border-t-4 border-rose-900 sm:rounded-2xl sm:px-10">

                    {!registrado ? (
                        /* Formulario de Pre-Registro (Solo Cédula y Nombre) */
                        <form className="space-y-6" onSubmit={handleRegistro}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Cédula de Identidad</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm font-medium">
                                        V-
                                    </span>
                                    <input type="text" required className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-rose-900 focus:border-rose-900 sm:text-sm" placeholder="12345678" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Nombres y Apellidos</label>
                                <input type="text" required className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-rose-900 focus:border-rose-900 sm:text-sm" placeholder="Ej. Juan Pérez" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Contraseña para el portal</label>
                                <input type="password" required className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-rose-900 focus:border-rose-900 sm:text-sm" />
                            </div>

                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-rose-900 hover:bg-rose-800 transition-all duration-200">
                                    GENERAR CÓDIGO
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Pantalla de Éxito con los dos botones únicos abajo */
                        <div className="text-center py-6 animate-fade-in">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">¡Registro Exitoso!</h3>
                            <p className="text-slate-500 text-sm mb-6">Guarda este código. Lo necesitarás para iniciar sesión e inscribirte si apruebas la prueba física.</p>

                            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-6">
                                <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">Tu Código de Estudiante</p>
                                <p className="text-3xl font-black text-rose-900 tracking-wider">{codigoAsignado}</p>
                            </div>

                            {/* PANEL DE ACCIONES (Dos botones separados y estéticos) */}
                            <div className="space-y-3 mb-6">
                                <button 
                                    type="button" 
                                    onClick={() => setShowRequisitosModal(true)} 
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-rose-900 rounded-xl text-sm font-bold text-rose-900 bg-rose-50/40 hover:bg-rose-50 transition-all duration-200"
                                >
                                    📋 VER REQUISITOS DE PREINSCRIPCIÓN
                                </button>

                                <button 
                                    type="button" 
                                    onClick={() => setShowDescargasModal(true)} 
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 rounded-xl text-sm font-bold text-white shadow-md transition-all duration-200"
                                >
                                    📥 DESCARGAR PLANILLAS EN PDF
                                </button>
                            </div>

                            <Link to="/" className="w-full flex justify-center py-3 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all">
                                Volver al Inicio
                            </Link>
                        </div>
                    )}

                </div>
            </div>

            {/* 1. MODAL DE REQUISITOS */}
            {showRequisitosModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="bg-rose-950 px-6 py-5 text-white">
                            <h3 className="text-xl font-bold tracking-tight">Requisitos Obligatorios</h3>
                            <p className="text-sm text-rose-200/80 mt-1">Soportes físicos exigidos que debe consignar en la institución.</p>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                {requisitosFisicos.map((item, index) => (
                                    <div key={index} className="flex items-start p-3.5 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl text-base text-slate-700 shadow-sm">
                                        <span className="text-rose-900 font-bold mr-3 mt-0.5 text-lg">✓</span>
                                        <span className="font-medium leading-relaxed">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-amber-50 border border-amber-200/70 text-slate-700 text-sm rounded-xl space-y-2 shadow-sm">
                                <p className="text-amber-800 font-bold uppercase tracking-wide text-base">⚠️ Información Importante:</p>
                                <p className="leading-normal font-medium">Esta documentación deberá presentarse en una carpeta física en el departamento de control de estudios.</p>
                                <div className="text-slate-800 font-semibold text-base">
                                    <p>📅 Horario: Lunes a Jueves (8:00 AM - 12:00 PM / 1:00 PM - 4:00 PM)</p>
                                </div>
                                <p className="font-bold text-rose-950 pt-2 border-t border-amber-200/60 uppercase text-center tracking-wide text-sm">
                                    El aspirante debe asistir obligatoriamente en ropa deportiva.
                                </p>
                            </div>

                            <button onClick={() => setShowRequisitosModal(false)} className="w-full bg-rose-900 hover:bg-rose-800 text-white py-3 rounded-xl font-bold text-base shadow-md transition-all duration-200">
                                ENTENDIDO
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. MODAL EXCLUSIVO DE DESCARGAS (PDF REAL) */}
            {showDescargasModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100">
                        <div className="bg-slate-900 px-6 py-5 text-white">
                            <h3 className="text-xl font-bold tracking-tight">Formatos y Planillas Oficiales</h3>
                            <p className="text-sm text-slate-400 mt-1">Descargue los archivos e imprímalos para su entrega física.</p>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="space-y-3">
                                {/* Planilla 1 - DESCARGA REAL DEL PDF */}
                                <a 
                                    href="/planilla_preinscripcion.pdf" 
                                    download="Planilla_Preinscripcion_LTDMVG.pdf"
                                    className="flex items-center justify-between p-4 bg-rose-50/40 hover:bg-rose-50 border border-rose-100 rounded-xl text-base text-rose-950 font-bold shadow-sm transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">📄</span>
                                        <span>Planilla de Pre-inscripción</span>
                                    </div>
                                    <span className="text-sm bg-rose-900 text-white px-4 py-1.5 rounded-lg group-hover:bg-rose-800 transition-colors shadow-sm">
                                        Descargar PDF
                                    </span>
                                </a>
                            </div>

                            <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-xs text-center border border-slate-200">
                                El documento está en formato **PDF estándar**. Asegúrese de imprimirlo en una hoja tamaño carta de forma nítida.
                            </div>

                            <button onClick={() => setShowDescargasModal(false)} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-bold text-base shadow-md transition-all duration-200">
                                CERRAR VENTANA
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PreRegistro;