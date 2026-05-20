import { Link } from 'react-router-dom';    
import Footer from '../Components/Footer';

const Landing = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* Hero / Bienvenida */}
            <header className="relative bg-slate-900 py-24 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="max-w-5xl mx-auto px-6 relative text-center">
                    <span className="bg-rose-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">Valencia, Carabobo</span>
                    <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight uppercase">
                        Excelencia Académica y <span className="text-rose-500 text-rose-400">Alto Rendimiento</span>
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        Portal oficial de gestión escolar del C.E.T.D Miguel Vicente Gañango.
                        Digitalizando el futuro de nuestros atletas.
                    </p>
                </div>
            </header>

            {/* Sección de Accesos (Fase 1, Fase 2 y Regulares) */}
            <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10 grid md:grid-cols-3 gap-6">
                
                {/* 1. Preinscripción */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-rose-900 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-bold mb-2">1. Preinscripción</h3>
                        <p className="text-slate-500 mb-6 text-sm">Nuevo ingreso. Inicia tu proceso para obtener el código y presentar la prueba física.</p>
                    </div>
                    {/* CAMBIO AQUÍ: de button a Link */}
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
                    {/* CAMBIO AQUÍ */}
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
                    {/* CAMBIO AQUÍ */}
                    <Link to="/regulares" className="block text-center w-full bg-slate-700 text-white py-3 rounded-xl font-bold hover:bg-slate-600 transition">
                        ENTRAR AL PORTAL
                    </Link>
                </div>

            </section>

            {/* Sección de Disciplinas Deportivas (Las 16 Oficiales) */}
            <section className="py-20 max-w-6xl mx-auto px-6">
                <h3 className="text-3xl font-black text-slate-900 mb-10 uppercase flex items-center gap-3">
                    <span className="w-10 h-1 bg-rose-900"></span> Especialidades Deportivas
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        'Ajedrez', 'Atletismo', 'Baloncesto', 'Balonmano',
                        'Boxeo', 'Ciclismo', 'Esgrima', 'Gimnasia',
                        'Judo', 'Karate Do', 'Kenpo', 'LVD-Pesas',
                        'Lucha', 'Tae Kwon Do', 'Tenis de Mesa', 'Voleibol'
                    ].map((deporte) => (
                        <div key={deporte} className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-lg hover:border-rose-900 transition-all text-center group cursor-pointer">
                            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏅</div>
                            <h4 className="font-bold uppercase text-xs md:text-sm text-slate-700">{deporte}</h4>
                        </div>
                    ))}
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

            {/* Llamada al componente Footer que separarás */}
            <Footer />

        </div>
    );
};

export default Landing;