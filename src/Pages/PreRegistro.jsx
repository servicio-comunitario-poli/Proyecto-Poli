import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/server'; // Importación correcta del cliente Supabase

const PreRegistro = () => {
    const [registrado, setRegistrado] = useState(false);
    const [codigoAsignado, setCodigoAsignado] = useState('');
    const [showRequisitosModal, setShowRequisitosModal] = useState(false);
    const [showDescargasModal, setShowDescargasModal] = useState(false);

    // NUEVO: Estados para capturar los datos del formulario
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');

    const requisitosFisicos = [
        "Estudiante de 6to. grado (Constancia de estudio original)",
        "Constancia original de niño sano",
        "Planilla de pre-inscripción impresa (L.T.D.M.V.G)",
        "Foto tipo carnet reciente del aspirante y del representante",
        "Copia fotostática de la cédula del aspirante y del representante",
        "Copia certificada de la partida de nacimiento del aspirante"
    ];

    // MODIFICADO: Función asíncrona para guardar en Supabase
    const handleRegistro = async (e) => {
        e.preventDefault();
        
        // 1. Generar código único
        const codigoSimulado = "MVG-" + Math.floor(10000 + Math.random() * 90000);
        
        // 2. Insertar en Supabase
        const { error } = await supabase
            .from('usuarios')
            .insert([{
                cedula: cedula,
                nombres: nombre, // Ajustado a tu SQL 'nombres'
                password: password, // Asegúrate de haber renombrado en DB a 'password'
                codigo_estudiante: codigoSimulado,
                rol: 'estudiante'
            }]);

        if (error) {
            console.error("Error al registrar:", error.message);
            alert("Error al registrar en la base de datos: " + error.message);
            return;
        }

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
                        <form className="space-y-6" onSubmit={handleRegistro}>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Cédula de Identidad</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm font-medium">V-</span>
                                    <input 
                                        type="text" 
                                        required 
                                        value={cedula} 
                                        onChange={(e) => setCedula(e.target.value)}
                                        className="flex-1 px-3 py-2 border border-slate-300 rounded-r-md focus:ring-rose-900 focus:border-rose-900 sm:text-sm" 
                                        placeholder="12345678" 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Nombres y Apellidos</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-rose-900 focus:border-rose-900 sm:text-sm" 
                                    placeholder="Ej. Juan Pérez" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700">Contraseña</label>
                                <input 
                                    type="password" 
                                    required 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-rose-900 focus:border-rose-900 sm:text-sm" 
                                />
                            </div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-rose-900 hover:bg-rose-800 transition-all">
                                GENERAR CÓDIGO
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-6 animate-fade-in">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">¡Registro Exitoso!</h3>
                            <p className="text-slate-500 text-sm mb-6">Guarda este código.</p>
                            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 mb-6">
                                <p className="text-sm text-slate-500 uppercase tracking-widest mb-1">Tu Código</p>
                                <p className="text-3xl font-black text-rose-900 tracking-wider">{codigoAsignado}</p>
                            </div>
                            <div className="space-y-3 mb-6">
                            </div>
                            <Link to="/" className="w-full flex justify-center py-3 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white">Volver al Inicio</Link>
                        </div>
                    )}
                </div>
            </div>

            
        </div>
    );
};

export default PreRegistro;