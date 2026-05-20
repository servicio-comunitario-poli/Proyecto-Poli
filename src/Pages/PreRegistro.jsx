import { useState } from 'react';
import { Link } from 'react-router-dom';

const PreRegistro = () => {
    // Estado para cambiar entre el formulario y la pantalla de éxito
    const [registrado, setRegistrado] = useState(false);
    const [codigoAsignado, setCodigoAsignado] = useState('');

    const handleRegistro = (e) => {
        e.preventDefault();
        // Aquí Sebastián conectará el backend. Por ahora simulamos la creación del código.
        const codigoSimulado = "MVG-" + Math.floor(10000 + Math.random() * 90000);
        setCodigoAsignado(codigoSimulado);
        setRegistrado(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="w-12 h-12 bg-rose-900 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">MVG</div>
                <h2 className="text-3xl font-extrabold text-slate-900">Preinscripción 2026</h2>
                <p className="mt-2 text-sm text-slate-600">Fase 1: Registro y solicitud de prueba física</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl border-t-4 border-rose-900 sm:rounded-2xl sm:px-10">

                    {!registrado ? (
                        /* Formulario de Pre-Registro */
                        <form className="space-y-6" onSubmit={handleRegistro}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Cédula de Identidad</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm">
                                        V-
                                    </span>
                                    <input type="text" required className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-slate-300 focus:ring-rose-900 focus:border-rose-900 sm:text-sm" placeholder="12345678" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Nombres y Apellidos</label>
                                <input type="text" required className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-rose-900 focus:border-rose-900 sm:text-sm" placeholder="Ej. Juan Pérez" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">Contraseña para el portal</label>
                                <input type="password" required className="mt-1 appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-rose-900 focus:border-rose-900 sm:text-sm" />
                            </div>

                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-rose-900 hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-900 transition-all">
                                    GENERAR CÓDIGO
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Pantalla de Éxito (Muestra el código) */
                        <div className="text-center py-6">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">¡Registro Exitoso!</h3>
                            <p className="text-slate-500 mb-6">Guarda este código. Lo necesitarás para iniciar sesión e inscribirte si apruebas la prueba física.</p>

                            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-8">
                                <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">Tu Código de Estudiante</p>
                                <p className="text-3xl font-black text-rose-900 tracking-wider">{codigoAsignado}</p>
                            </div>

                            <Link to="/" className="w-full flex justify-center py-3 px-4 border-2 border-slate-200 rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all">
                                Volver al Inicio
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default PreRegistro;