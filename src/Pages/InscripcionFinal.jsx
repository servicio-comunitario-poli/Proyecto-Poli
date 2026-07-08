import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../utils/server';

const InscripcionFinal = () => {
    const [fase, setFase] = useState(1);
    const [codigo, setCodigo] = useState('');
    const [errorCodigo, setErrorCodigo] = useState('');
    const [loading, setLoading] = useState(false);

    // Estado con todos los campos presentes en tu tabla 'inscripciones'
    const [formData, setFormData] = useState({
        cedula: '', nombres: '', apellidos: '', fecha_nacimiento: '',
        genero: '', direccion: '', disciplina: '', anio_cursar: '',
        cedula_representante: '', nombre_representante: '', telefono_representante: ''
    });

    const disciplinas = [
        "Ajedrez", "Atletismo", "Baloncesto", "Balonmano", "Boxeo", 
        "Ciclismo", "Esgrima", "Gimnasia", "Judo", "Karate Do", 
        "Kenpo", "LVD-Pesas", "Lucha", "Tae Kwon Do", "Tenis de Mesa", "Voleibol"
    ];

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
        
        // Construcción del objeto con todos los datos
        const payload = {
            codigo_estudiante: codigo,
            cedula_alumno: formData.cedula,
            nombres: formData.nombres,
            apellidos: formData.apellidos,
            fecha_nacimiento: formData.fecha_nacimiento,
            genero: formData.genero, // Ahora este dato viene del formulario
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
                .insert([payload]);

            if (error) throw error;
            setFase(3);
        } catch (err) {
            console.error("Error completo:", err);
            alert("Error al procesar: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className={`w-full bg-white rounded-2xl shadow-2xl p-8 transition-all ${fase === 2 ? 'max-w-4xl' : 'max-w-md'}`}>
                
                {/* FASE 1: VALIDACIÓN */}
                {fase === 1 && (
                    <form onSubmit={handleValidarCodigo} className="space-y-4">
                        <h2 className="text-2xl font-black text-center">Validar Código</h2>
                        <input type="text" value={codigo} onChange={(e) => setCodigo(e.target.value.toUpperCase())} placeholder="EJ: MVG-12345" className="w-full p-4 border rounded-xl" required />
                        {errorCodigo && <p className="text-red-500 text-center font-bold">{errorCodigo}</p>}
                        <button type="submit" disabled={loading} className="w-full bg-[#8e1638] text-white py-4 rounded-xl font-bold">Continuar</button>
                    </form>
                )}

                {/* FASE 2: FORMULARIO COMPLETO */}
                {fase === 2 && (
                    <form onSubmit={handleFinalizarInscripcion} className="space-y-4">
                        <h2 className="text-2xl font-black mb-4">Formalizar Inscripción</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input name="cedula" placeholder="Cédula Alumno" onChange={handleInputChange} required className="p-3 border rounded" />
                            <input name="nombres" placeholder="Nombres" onChange={handleInputChange} required className="p-3 border rounded" />
                            <input name="apellidos" placeholder="Apellidos" onChange={handleInputChange} required className="p-3 border rounded" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="date" name="fecha_nacimiento" onChange={handleInputChange} required className="p-3 border rounded" />
                            <select name="genero" onChange={handleInputChange} required className="p-3 border rounded">
                                <option value="">Seleccione Género...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                        </div>

                        <input name="direccion" placeholder="Dirección de Habitación" onChange={handleInputChange} required className="w-full p-3 border rounded" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select name="anio_cursar" onChange={handleInputChange} required className="p-3 border rounded">
                                <option value="">Año a cursar...</option>
                                {['1er Año', '2do Año', '3er Año', '4to Año', '5to Año'].map(a => <option key={a} value={a}>{a}</option>)}
                            </select>
                            <select name="disciplina" onChange={handleInputChange} required className="p-3 border rounded">
                                <option value="">Disciplina...</option>
                                {disciplinas.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* DATOS REPRESENTANTE */}
                        <h3 className="font-bold border-b mt-4">Datos del Representante</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input name="cedula_representante" placeholder="Cédula Rep." onChange={handleInputChange} required className="p-3 border rounded" />
                            <input name="nombre_representante" placeholder="Nombre Completo" onChange={handleInputChange} required className="p-3 border rounded" />
                            <input name="telefono_representante" placeholder="Teléfono" onChange={handleInputChange} required className="p-3 border rounded" />
                        </div>

                        <button type="submit" className="w-full bg-[#8e1638] text-white py-4 rounded-xl font-bold mt-4">Procesar Inscripción</button>
                    </form>
                )}

                {/* FASE 3: ÉXITO */}
                {fase === 3 && (
                    <div className="text-center">
                        <h2 className="text-3xl font-black">¡Inscripción Exitosa!</h2>
                        <Link to="/login" className="block mt-4 text-[#8e1638] underline">Ir a Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InscripcionFinal;