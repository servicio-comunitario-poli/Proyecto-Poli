import { useState } from 'react';
import { Link } from 'react-router-dom';    
import Footer from '../Components/Footer';

const Landing = () => {
    // Estado para controlar qué deporte está seleccionado en el modal
    const [deporteSeleccionado, setDeporteSeleccionado] = useState(null);

    // Estado para controlar el modal de Misión y Visión
    const [identidadSeleccionada, setIdentidadSeleccionada] = useState(null);

    // 1. CONFIGURA AQUÍ LAS RUTAS DE TUS IMÁGENES
    // Puedes usar imágenes locales (ej. '/assets/boxeo.jpg') o URLs completas
    const infoDeportes = {
        'Ajedrez': {
            emoji: '♟️',
            imagen: '/images/Ajedrez.png', 
            descripcion: 'Desarrollo del pensamiento estratégico, análisis táctico y preparación mental para competencias de alto nivel en tableros nacionales.'
        },
        'Atletismo': {
            emoji: '🏃‍♂️',
            imagen: '/images/atletismo.jpg',
            descripcion: 'Entrenamiento de velocidad, resistencia, saltos y lanzamientos en pista, optimizando las capacidades biomotoras del atleta.'
        },
        'Baloncesto': {
            emoji: '🏀',
            imagen: '/images/baloncesto.png',
            descripcion: 'Fundamentos técnicos, tácticas grupales ofensivas/defensivas y preparación física integral orientada al juego en equipo de alta intensidad.'
        },
        'Balonmano': {
            emoji: '🤾‍♂️',
            imagen: '/images/balonmano.png',
            descripcion: 'Deporte de alta velocidad que combina agilidad, fuerza de lanzamiento, dinámicas de juego asociativo y estrategias de contraataque.'
        },
        'Boxeo': {
            emoji: '🥊',
            imagen: '/images/boxeo.png',
            descripcion: 'Escuela de combate, técnica de golpeo, combinaciones, defensa y acondicionamiento cardiovascular extremo bajo el código olímpico.'
        },
        'Ciclismo': {
            emoji: '🚴‍♂️',
            imagen: '/images/ciclismo.png',
            descripcion: 'Desarrollo de potencia aeróbica y anaeróbica, resistencia sobre ruedas y preparación táctica para pruebas de ruta y contrarreloj.'
        },
        'Esgrima': {
            emoji: '🤺',
            imagen: '/images/esgrima.png',
            descripcion: 'Destreza, reflejos agudos y coordinación fina en las modalidades de florete, espada y sable, combinando elegancia y estrategia.'
        },
        'Gimnasia': {
            emoji: '🤸‍♂️',
            imagen: '/images/gimnasia.png',
            descripcion: 'Entrenamiento de flexibilidad extrema, fuerza core, control de ejes corporales y rutinas coreográficas en múltiples aparatos.'
        },
        'Judo': {
            emoji: '🥋',
            imagen: '/images/judo.png',
            descripcion: 'Arte marcial enfocado en proyecciones, transiciones en suelo, técnicas de sumisión, control y el uso eficiente de la fuerza del oponente.'
        },
        'Karate Do': {
            emoji: '🤜',
            imagen: '/images/karatedo.png',
            descripcion: 'Entrenamiento de Katas (formas) y Kumite (combate), perfeccionando la velocidad de reacción, precisión, control y disciplina mental.'
        },
        'Kenpo': {
            emoji: '⚔️',
            imagen: '/images/kenpo.png',
            descripcion: 'Sistema de defensa personal enfocado en combinaciones rápidas de golpes, fluidez de movimientos y adaptación a situaciones reales de combate.'
        },
        'LVD-Pesas': {
            emoji: '🏋️‍♂️',
            imagen: '/images/levantamientopesas.png',
            descripcion: 'Levantamiento olímpico de pesas centrado en las modalidades de Arranque (Snatch) y Envión (Clean & Jerk) para maximizar la potencia y fuerza explosiva.'
        },
        'Lucha': {
            emoji: '🼽',
            imagen: '/images/lucha.png',
            descripcion: 'Estilo Libre y Grecorromana. Trabajo intensivo en derribos, tackles, control de agarres y destreza en lona para competiciones oficiales.'
        },
        'Tae Kwon Do': {
            emoji: '🥋',
            imagen: '/images/taekwondo.png',
            descripcion: 'Especialización en técnicas complejas de patadas de alta velocidad, combate olímpico, saltos y precisión táctica en el área de competencia.'
        },
        'Tenis de Mesa': {
            emoji: '🏓',
            imagen: '/images/tenisdemesa.png',
            descripcion: 'Desarrollo de velocidad de reacción ultrarrápida, efectos de bola (spin), coordinación óculo-manual y agilidad mental en distancias cortas.'
        },
        'Voleibol': {
            emoji: '🏐',
            imagen: '/images/voleibol.png',
            descripcion: 'Tácticas de juego rápido, técnicas de voleo, recepción, saques potentes y bloqueos en red para torneos competitivos.'
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* Hero / Bienvenida */}
            <header className="relative bg-slate-900 py-24 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-5xl mx-auto px-6 relative text-center">
                    <span className="bg-rose-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Valencia, Carabobo</span>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase">
                        Excelencia Académica y <span className="text-rose-500">Alto Rendimiento</span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Portal oficial de gestión escolar del C.E.T.D Miguel Vicente Gañango.
                        Digitalizando el futuro de nuestros atletas.
                    </p>
                </div>
            </header>

            {/* Sección de Accesos */}
            <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 grid md:grid-cols-3 gap-6">
                {/* 1. Preinscripción */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-rose-900 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">1. Preinscripción</h3>
                        <p className="text-slate-500 mb-6 text-sm">Nuevo ingreso. Inicia tu proceso para obtener el código y presentar la prueba física.</p>
                    </div>
                    <Link to="/pre-registro" className="block text-center w-full bg-rose-900 text-white py-3 rounded-xl font-bold hover:bg-rose-800 transition">
                        SOLICITAR CUPO
                    </Link>
                </div>

                {/* 2. Inscripción con Código */}
                <div className="bg-slate-100 p-8 rounded-2xl shadow-xl border border-slate-200 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-rose-900">2. Inscripción</h3>
                        <p className="text-slate-500 mb-6 text-sm">¿Aprobaste la prueba física? Ingresa tu código aquí para formalizar tu inscripción.</p>
                    </div>
                    <Link to="/inscripcion" className="block text-center w-full bg-white border-2 border-rose-900 text-rose-900 py-3 rounded-xl font-bold hover:bg-rose-50 transition">
                        VALIDAR CÓDIGO
                    </Link>
                </div>

                {/* 3. Alumnos Regulares */}
                <div className="bg-slate-800 p-8 rounded-2xl shadow-xl text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2 text-rose-400">Alumnos Regulares</h3>
                        <p className="text-slate-400 mb-6 text-sm">Accede a tu portal para gestionar reinscripción, ver estatus y notas.</p>
                    </div>
                    <Link to="/regulares" className="block text-center w-full bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-600 transition">
                        ENTRAR AL PORTAL
                    </Link>
                </div>
            </section>

            {/* Sección de Disciplinas Deportivas Interactiva */}
            <section className="py-20 max-w-6xl mx-auto px-6">
                <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase flex items-center gap-3">
                    <span className="w-10 h-1 bg-rose-900"></span> Especialidades Deportivas
                </h3>
                <p className="text-slate-500 mb-10 text-sm md:text-base font-medium">Haz clic sobre cualquier disciplina para conocer las actividades que se realizan.</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.keys(infoDeportes).map((deporte) => (
                        <button 
                            key={deporte} 
                            onClick={() => setDeporteSeleccionado({ nombre: deporte, ...infoDeportes[deporte] })}
                            className="p-5 bg-white border border-slate-200 rounded-xl hover:shadow-xl hover:border-rose-900 transition-all text-center group cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-900"
                        >
                            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {infoDeportes[deporte].emoji}
                            </div>
                            <h4 className="font-bold uppercase text-xs md:text-sm text-slate-700 group-hover:text-rose-950 transition-colors">
                                {deporte}
                            </h4>
                        </button>
                    ))}
                </div>
            </section>

            {/* SECCIÓN INTERMEDIA: MISIÓN Y VISIÓN */}
            <section className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 py-24 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay"></div>
                
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-72 h-72 bg-rose-900/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-6xl mx-auto px-6 relative">
                    
                    <div className="text-center mb-16">
                        <span className="text-rose-500 text-xs font-bold tracking-widest uppercase bg-rose-500/10 px-4 py-1.5 rounded-full border border-rose-500/20 inline-block mb-3">
                            Valores del C.E.T.D M.V.G
                        </span>
                        <h3 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white">
                            Nuestra <span className="text-rose-500">Identidad</span>
                        </h3>
                        <div className="w-12 h-1 bg-gradient-to-r from-transparent via-rose-600 to-transparent mx-auto mt-4"></div>
                        <p className="text-slate-400 text-xs md:text-sm mt-4 uppercase tracking-widest font-semibold max-w-md mx-auto leading-relaxed">
                            Selecciona una opción para desplegar el manifiesto institucional
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto relative z-10">
                        
                        {/* Botón de Misión */}
                        <button 
                            onClick={() => setIdentidadSeleccionada({
                                titulo: 'Misión',
                                emoji: '🧭',
                                imagen: '/images/mision.png', 
                                contenido: 'Iniciar, desarrollar y consolidar estudiantes/atletas con condiciones especiales hacia el deporte cursantes de educación media general y técnica en disciplinas deportivas prioritarias para la nación, formando de manera simultánea un atleta de alta competencia con un alto nivel académico.'
                            })}
                            className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl text-left w-full transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] group focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                        >
                            <div className="bg-gradient-to-r from-rose-950/50 via-rose-900/40 to-rose-950/50 p-6 border-b border-white/5 flex items-center justify-between w-full transition-colors group-hover:from-rose-900/60 group-hover:to-rose-900/40">
                                <div className="w-10"></div>
                                <span className="text-2xl font-black uppercase tracking-widest text-slate-100 text-center flex-grow group-hover:text-rose-200 transition-colors">
                                    Misión
                                </span>
                                <span className="text-2xl w-10 text-right group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">🧭</span>
                            </div>
                            <div className="p-8 flex-grow flex flex-col items-center justify-center w-full min-h-[180px] md:min-h-[220px] bg-gradient-to-b from-transparent to-slate-950/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/[0.02] transition-colors duration-300"></div>
                                <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest text-center px-6 py-3.5 rounded-xl border border-white/5 bg-slate-950/40 group-hover:text-white group-hover:border-rose-500/30 group-hover:bg-rose-950/80 transition-all duration-300 shadow-inner">
                                    Explorar Filosofía <span className="text-rose-500 ml-1 group-hover:translate-x-1 inline-block transition-transform">→</span>
                                </p>
                            </div>
                        </button>

                        {/* Botón de Visión */}
                        <button 
                            onClick={() => setIdentidadSeleccionada({
                                titulo: 'Visión',
                                emoji: '🏅',
                                imagen: '/images/vision.png', 
                                contenido: 'Garantizar el desarrollo académico de excelencia a los atletas con perspectivas al rendimiento deportivo y los deportistas de alto rendimiento.'
                            })}
                            className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl text-left w-full transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] group focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                        >
                            <div className="bg-gradient-to-r from-rose-950/50 via-rose-900/40 to-rose-950/50 p-6 border-b border-white/5 flex items-center justify-between w-full transition-colors group-hover:from-rose-900/60 group-hover:to-rose-900/40">
                                <div className="w-10"></div>
                                <span className="text-2xl font-black uppercase tracking-widest text-slate-100 text-center flex-grow group-hover:text-rose-200 transition-colors">
                                    Visión
                                </span>
                                <span className="text-2xl w-10 text-right group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">🏅</span>
                            </div>
                            <div className="p-8 flex-grow flex flex-col items-center justify-center w-full min-h-[180px] md:min-h-[220px] bg-gradient-to-b from-transparent to-slate-950/20 relative overflow-hidden">
                                <div className="absolute inset-0 bg-rose-500/0 group-hover:bg-rose-500/[0.02] transition-colors duration-300"></div>
                                <p className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-widest text-center px-6 py-3.5 rounded-xl border border-white/5 bg-slate-950/40 group-hover:text-white group-hover:border-rose-500/30 group-hover:bg-rose-950/80 transition-all duration-300 shadow-inner">
                                    Ver Proyección <span className="text-rose-500 ml-1 group-hover:translate-x-1 inline-block transition-transform">→</span>
                                </p>
                            </div>
                        </button>

                    </div>
                </div>
            </section>

            {/* Blog de Eventos */}
            <section className="bg-slate-200 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-3xl font-black text-slate-900 uppercase">Eventos Recientes</h3>
                        <button className="text-rose-900 font-bold">Ver Calendario →</button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <article className="bg-white rounded-2xl overflow-hidden shadow-md">
                            <div className="h-40 bg-slate-400"></div>
                            <div className="p-6">
                                <span className="text-rose-900 font-bold text-xs uppercase">Competencia</span>
                                <h4 className="font-bold text-lg mt-2 leading-tight">Clasificatorios Nacionales Juveniles 2026</h4>
                                <p className="text-slate-500 text-sm mt-3">Nuestros atletas de lucha viajan a la capital para buscar su pase...</p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>

            <Footer />

            {/* MODAL DE DEPORTES */}
            <div 
                className={`fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 z-50 transition-all duration-300 ease-out ${
                    deporteSeleccionado ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setDeporteSeleccionado(null)}
            >
                <div 
                    className={`bg-slate-900 border border-white/10 text-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden transform transition-all duration-300 ease-out grid md:grid-cols-2 ${
                        deporteSeleccionado ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    
                    <div className="relative h-56 md:h-full bg-slate-950 overflow-hidden group">
                        {deporteSeleccionado?.imagen ? (
                            <img 
                                src={deporteSeleccionado.imagen} 
                                alt={`Atletas de ${deporteSeleccionado.nombre}`}
                                className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700 opacity-90"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-slate-900/80" />
                        
                        <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xl border border-white/10">
                            {deporteSeleccionado?.emoji}
                        </div>
                    </div>

                    <div className="flex flex-col justify-between p-6 md:p-8 bg-gradient-to-b from-transparent to-slate-950/40 relative">
                        <div>
                            <span className="text-xs text-rose-500 font-black uppercase tracking-widest block mb-1">
                                Especialidad Deportiva
                            </span>
                            <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                {deporteSeleccionado?.nombre}
                            </h3>
                            
                            <div className="bg-white/[0.03] backdrop-blur-sm p-5 border border-white/5 rounded-2xl mb-6 shadow-inner">
                                <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                                    {deporteSeleccionado?.descripcion}
                                </p>
                            </div>

                            <div className="flex gap-3 p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl text-xs text-rose-300 font-semibold items-center mb-8">
                                <span className="text-base">🏆</span>
                                <span className="leading-tight">Formación técnica homologada y desarrollo competitivo oficial del C.E.T.D M.V.G.</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setDeporteSeleccionado(null)} 
                            className="w-full bg-white text-slate-900 hover:bg-rose-500 hover:text-white py-3.5 rounded-xl font-bold text-xs tracking-widest shadow-lg shadow-black/20 transition-all duration-300 uppercase cursor-pointer"
                        >
                            Entendido
                        </button>
                    </div>

                </div>
            </div>

            {/* MODAL MODIFICADO: MÁS GRANDE (max-w-4xl) Y ALTURA REDISEÑADA (md:h-[520px]) */}
            <div 
                className={`fixed inset-0 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 z-50 transition-all duration-300 ease-out ${
                    identidadSeleccionada ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIdentidadSeleccionada(null)}
            >
                <div 
                    className={`bg-slate-900 border border-white/10 text-white rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] w-full max-w-4xl overflow-hidden transform transition-all duration-300 ease-out grid md:grid-cols-2 md:h-[520px] ${
                        identidadSeleccionada ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* COLUMNA IZQUIERDA: CONTENEDOR DE LA IMAGEN DE IDENTIDAD */}
                    <div className="relative h-56 md:h-full bg-slate-950 overflow-hidden group">
                        {identidadSeleccionada?.imagen ? (
                            <img 
                                src={identidadSeleccionada.imagen} 
                                alt={`Manifiesto de ${identidadSeleccionada.titulo}`}
                                className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-700 opacity-90"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        ) : null}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-slate-900/80" />
                        
                        <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-xl border border-white/10">
                            {identidadSeleccionada?.emoji}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: SECCIÓN DE TEXTO EXPANDIDA */}
                    <div className="flex flex-col justify-between p-10 md:p-12 bg-gradient-to-b from-transparent to-slate-950/30 relative h-full overflow-hidden">
                        <div className="flex flex-col overflow-hidden flex-grow">
                            <span className="text-xs text-rose-500 font-black uppercase tracking-widest block mb-1">
                                Identidad Institucional
                            </span>
                            <h3 className="text-4xl font-black uppercase tracking-tight text-white mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                {identidadSeleccionada?.titulo}
                            </h3>
                            
                            {/* Caja de contenido interno con scroll y padding adaptado al nuevo tamaño */}
                            <div className="bg-white/[0.02] backdrop-blur-sm border border-white/5 p-6 md:p-8 rounded-2xl mb-6 shadow-inner relative overflow-hidden flex-grow overflow-y-auto">
                                <div className="absolute top-0 left-0 w-3 h-3 bg-rose-500 rounded-br-xl opacity-40"></div>
                                <p className="text-slate-200 text-base md:text-lg leading-relaxed font-medium text-left balance">
                                    {identidadSeleccionada?.contenido}
                                </p>
                            </div>
                        </div>

                        {/* Botón de Cierre */}
                        <button 
                            onClick={() => setIdentidadSeleccionada(null)} 
                            className="w-full bg-gradient-to-r from-rose-900 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white py-4 rounded-xl font-black text-sm tracking-widest shadow-lg shadow-rose-950/50 transition-all duration-300 uppercase border border-rose-500/20 hover:border-rose-400/30 cursor-pointer mt-auto"
                        >
                            Cerrar Ventana
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Landing;