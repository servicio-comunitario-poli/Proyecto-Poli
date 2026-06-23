import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/server'; // Importación correcta

const InscripcionFinal = () => {
    const [fase, setFase] = useState(1);
    const [codigo, setCodigo] = useState('');
    const [errorCodigo, setErrorCodigo] = useState('');
    const [loading, setLoading] = useState(false);

    // Estado con los nombres exactos de las columnas de tu tabla 'inscripciones'
    const [formData, setFormData] = useState({
        cedula: '', nombres: '', apellidos: '', fecha_nacimiento: '',
        genero: '', direccion: '', disciplina: '', anio_cursar: '',
        cedula_representante: '', nombre_representante: '', telefono_representante: '', fecha_inscripcion: ''
    });

    const disciplinas = [
        "Ajedrez", "Atletismo", "Baloncesto", "Balonmano", "Boxeo", 
        "Ciclismo", "Esgrima", "Gimnasia", "Judo", "Karate Do", 
        "Kenpo", "LVD-Pesas", "Lucha", "Tae Kwon Do", "Tenis de Mesa", "Voleibol"
    ];

    // --- MANEJADORES CONECTADOS A SUPABASE ---

    const handleValidarCodigo = async (e) => {
        e.preventDefault();
        setErrorCodigo('');
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('codigo_estudiante', codigo)
                .single();

            if (error || !data) {
                setErrorCodigo('Código no encontrado. Verifique e intente nuevamente.');
            } else {
                setFase(2);
            }
        } catch (err) {
            setErrorCodigo('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFinalizarInscripcion = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        // Construcción explícita: SOLO lo que existe en la tabla
        const payload = {
            codigo_estudiante: codigo,
            cedula_alumno: formData.cedula,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            // Double safety: Si por alguna razón está vacío, enviamos null en vez de "" para que Postgres no falle
            fecha_nacimiento: formData.fecha_nacimiento || null, 
            genero: formData.genero,
            direccion: formData.direccion,
            anio_cursar: formData.anio_cursar,
            disciplina: formData.disciplina,
            cedula_representante: formData.cedula_representante,
            nombre_representante: formData.nombre_representante,
            telefono_representante: formData.telefono_representante,
            fecha_inscripcion: new Date().toISOString()
        };

        try {
            const { error } = await supabase
                .from('inscripciones')
                .insert([payload]); // Enviamos el objeto limpio

            if (error) throw error;
            setFase(3);
        } catch (err) {
            console.error("Error completo:", err);
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    // --- RENDERIZADO (DISEÑO FINO MANTENIDO) ---
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 font-sans text-slate-900 relative overflow-hidden py-12">
            <div className="absolute top-0 w-full h-[40vh] bg-[#0f172a] rounded-b-[50px] md:rounded-b-[100px] shadow-lg"></div>

            <div className={`w-full bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-slate-200 transition-all duration-500 ease-in-out ${fase === 2 ? 'max-w-4xl' : 'max-w-md'}`}>
                
                {/* FASE 1: VALIDACIÓN */}
                {fase === 1 && (
                    <div className="animate-fade-in">
                        <div className="p-8 pb-6 text-center border-b border-slate-100">
                            <h2 className="text-2xl font-black uppercase tracking-tight text-[#0f172a]">Validar <span className="text-[#8e1638]">Código</span></h2>
                        </div>
                        <div className="p-8 bg-slate-50/50">
                            <form onSubmit={handleValidarCodigo} className="space-y-6">
                                <input
                                    type="text"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                                    placeholder="EJ: MVG-12345"
                                    className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:border-[#8e1638] text-center font-mono text-lg uppercase font-bold shadow-inner"
                                    required
                                />
                                {errorCodigo && <p className="text-red-500 text-xs font-bold text-center">{errorCodigo}</p>}
                                <button type="submit" disabled={loading} className="w-full bg-[#8e1638] text-white py-4 rounded-xl font-black uppercase hover:bg-[#6b102a] transition-all">
                                    {loading ? "Verificando..." : "Verificar y Continuar"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* FASE 2: FORMULARIO */}
                {fase === 2 && (
                    <div className="animate-fade-in p-8">
                        <h2 className="text-2xl font-black mb-6">Formalizar Inscripción</h2>
                        <form onSubmit={handleFinalizarInscripcion} className="space-y-4">
                            
                            {/* Datos Básicos */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <input name="cedula" placeholder="Cédula" onChange={handleInputChange} required className="p-3 border rounded-lg" />
                                <input name="nombres" placeholder="Nombres" onChange={handleInputChange} required className="p-3 border rounded-lg" />
                                <input name="apellidos" placeholder="Apellidos" onChange={handleInputChange} required className="p-3 border rounded-lg" />
                            </div>

                            {/* NUEVO CAMPO: Fecha de Nacimiento */}
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-500 uppercase px-1">Fecha de Nacimiento</label>
                                <input 
                                    type="date" 
                                    name="fecha_nacimiento" 
                                    onChange={handleInputChange} 
                                    required 
                                    className="w-full p-3 border rounded-lg text-slate-600 focus:outline-none focus:border-[#8e1638]" 
                                />
                            </div>

                            {/* Selección de Año Académico */}
                            <select name="anio_cursar" onChange={handleInputChange} required className="w-full p-3 border rounded-lg">
                                <option value="">Seleccione Año...</option>
                                {['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'].map(a => <option key={a} value={a}>{a}</option>)}
                            </select>

                            {/* Selección de Disciplina */}
                            <select name="disciplina" onChange={handleInputChange} required className="w-full p-3 border rounded-lg">
                                <option value="">Seleccione Disciplina...</option>
                                {disciplinas.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>

                            <button type="submit" className="w-full bg-[#8e1638] text-white py-4 rounded-xl font-black uppercase hover:bg-[#6b102a] transition-all">Procesar Inscripción</button>
                        </form>
                    </div>
                )}

                {/* FASE 3: ÉXITO */}
                {fase === 3 && (
                    <div className="animate-fade-in p-10 text-center">
                        <h2 className="text-3xl font-black mb-4">¡Inscripción Exitosa!</h2>
                        <Link to="/login" className="block w-full bg-[#0f172a] text-white py-4 rounded-xl font-black">Ir a Iniciar Sesión</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InscripcionFinal;