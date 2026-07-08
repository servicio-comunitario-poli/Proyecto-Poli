import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../utils/server';

const MenuItem = ({ id, icon, label, activeTab, onClick }) => (
  <li>
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-rose-900 text-white shadow-md shadow-rose-900/20' 
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  </li>
);

const StatCard = ({ value, label, borderColor }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 ${borderColor}`}>
    <div className="text-3xl font-black text-slate-900">{value}</div>
    <div className="text-slate-500 text-sm mt-1 uppercase tracking-wider font-bold">{label}</div>
  </div>
);

const AdminPanel = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  // Estados generales del dashboard
  const [datos, setDatos] = useState({
    inscripciones: [],
    documentos: [],
    usuarios: [],
    publicaciones: [],
    noticiasPortal: [] // Nuevo estado independiente del blog
  });

  // ==========================================
  // ESTADOS: Módulo de Estudiantes
  // ==========================================
  const [estudiantes, setEstudiantes] = useState([]);
  const [gradoFiltro, setGradoFiltro] = useState('Todos');
  const [notasTemporales, setNotasTemporales] = useState({});

  // ==========================================
  // ESTADOS: Módulo de Blog
  // ==========================================
  const [mostrarFormBlog, setMostrarFormBlog] = useState(false);
  const [guardandoBlog, setGuardandoBlog] = useState(false);
  const [nuevoPost, setNuevoPost] = useState({
    titulo: '',
    categoria: 'COMPETENCIA',
    contenido: ''
  });

  // ==========================================
  // ESTADOS: Módulo de Información Portal
  // ==========================================
  const [mostrarFormNoticias, setMostrarFormNoticias] = useState(false);
  const [guardandoNoticias, setGuardandoNoticias] = useState(false);
  const [nuevaNoticia, setNuevaNoticia] = useState({
    titulo: '',
    categoria: 'NOTICIA',
    contenido: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: inscData } = await supabase.from('inscripciones').select('*');
        const { data: docData } = await supabase.from('documentos').select('*');
        const { data: usrData } = await supabase.from('usuarios').select('*');
        const { data: pubData } = await supabase.from('publicaciones_blog').select('*').order('creado_en', { ascending: false });
        const { data: notiData } = await supabase.from('noticias_portal').select('*').order('creado_en', { ascending: false });

        // CARGA DE NOTAS CORREGIDA: Ahora carga las notas siempre para que se vean en los inputs
        const materiaProfesor = user?.materia || "Materia Asignada";
        const { data: notasAnteriores } = await supabase
          .from('notas')
          .select('*')
          .eq('materia', materiaProfesor);
          
        if (notasAnteriores) {
          const notasCargadas = {};
          notasAnteriores.forEach(nota => {
            notasCargadas[nota.cedula_estudiante] = {
              lapso1: nota.lapso1 !== null ? nota.lapso1 : '',
              lapso2: nota.lapso2 !== null ? nota.lapso2 : '',
              lapso3: nota.lapso3 !== null ? nota.lapso3 : ''
            };
          });
          setNotasTemporales(notasCargadas);
        }

        setDatos({
          inscripciones: inscData || [],
          documentos: docData || [],
          usuarios: usrData || [],
          publicaciones: pubData || [],
          noticiasPortal: notiData || []
        });

        if (inscData) setEstudiantes(inscData);

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // ==========================================
  // FUNCIONES DEL MÓDULO ESTUDIANTES / NOTAS
  // ==========================================
  const estudiantesFiltrados = gradoFiltro === 'Todos' 
    ? estudiantes 
    : estudiantes.filter(est => est.anio_cursar === gradoFiltro);

  const handleNotaChange = (cedula, lapso, valor) => {
    setNotasTemporales(prev => ({
      ...prev,
      [cedula]: {
        ...prev[cedula],
        [lapso]: valor
      }
    }));
  };

  const guardarNotas = async (cedula) => {
    const notasEstudiante = notasTemporales[cedula];
    if (!notasEstudiante) return;

    const materiaProfesor = user?.materia || "Materia Asignada"; 

    try {
      const { error } = await supabase
        .from('notas')
        .upsert({ 
          cedula_estudiante: cedula, 
          materia: materiaProfesor,
          lapso1: notasEstudiante.lapso1 ? parseFloat(notasEstudiante.lapso1) : null,
          lapso2: notasEstudiante.lapso2 ? parseFloat(notasEstudiante.lapso2) : null,
          lapso3: notasEstudiante.lapso3 ? parseFloat(notasEstudiante.lapso3) : null
        }, { onConflict: 'cedula_estudiante, materia' });

      if(error) throw error;
      
      alert(`✅ Notas guardadas correctamente para la materia: ${materiaProfesor}`);

    } catch (error) {
      console.error("Error guardando notas:", error);
      alert("Hubo un error al guardar las notas.");
    }
  };

  // ==========================================
  // FUNCIONES DEL MÓDULO BLOG
  // ==========================================
  const handleCrearPublicacion = async (e) => {
    e.preventDefault();
    setGuardandoBlog(true);
    
    const { data, error } = await supabase
      .from('publicaciones_blog')
      .insert([{ 
        titulo: nuevoPost.titulo, 
        categoria: nuevoPost.categoria, 
        contenido: nuevoPost.contenido 
      }])
      .select();

    if (!error && data) {
      alert("¡Publicación creada exitosamente!");
      setMostrarFormBlog(false);
      setNuevoPost({ titulo: '', categoria: 'COMPETENCIA', contenido: '' });
      setDatos(prev => ({
        ...prev,
        publicaciones: [data[0], ...prev.publicaciones]
      }));
    } else {
      alert("Hubo un error al crear la publicación");
      console.error(error);
    }
    setGuardandoBlog(false);
  };

  const eliminarPublicacion = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar esta publicación?")) {
      const { error } = await supabase.from('publicaciones_blog').delete().eq('id', id);
      if(!error) {
        setDatos(prev => ({
          ...prev,
          publicaciones: prev.publicaciones.filter(pub => pub.id !== id)
        }));
      } else {
        alert("Error al eliminar");
      }
    }
  };

  // ==========================================
  // FUNCIONES DEL MÓDULO INFORMACIÓN PORTAL
  // ==========================================
  const handleCrearNoticiaPortal = async (e) => {
    e.preventDefault();
    setGuardandoNoticias(true);
    
    const { data, error } = await supabase
      .from('noticias_portal')
      .insert([{ 
        titulo: nuevaNoticia.titulo, 
        categoria: nuevaNoticia.categoria, 
        contenido: nuevaNoticia.contenido 
      }])
      .select();

    if (!error && data) {
      alert("¡Información de cartelera creada exitosamente!");
      setMostrarFormNoticias(false);
      setNuevaNoticia({ titulo: '', categoria: 'NOTICIA', contenido: '' });
      setDatos(prev => ({
        ...prev,
        noticiasPortal: [data[0], ...prev.noticiasPortal]
      }));
    } else {
      alert("Hubo un error al crear el aviso informativo");
      console.error(error);
    }
    setGuardandoNoticias(false);
  };

  const eliminarNoticiaPortal = async (id) => {
    if(window.confirm("¿Estás seguro de eliminar este aviso informativo de la cartelera?")) {
      const { error } = await supabase.from('noticias_portal').delete().eq('id', id);
      if(!error) {
        setDatos(prev => ({
          ...prev,
          noticiasPortal: prev.noticiasPortal.filter(noti => noti.id !== id)
        }));
      } else {
        alert("Error al eliminar el aviso informativo");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const esProfesor = user?.rol?.includes('profesor') || true;

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <div className="w-10 h-10 bg-rose-900 rounded-full flex items-center justify-center text-white font-black text-xl mb-3">
            MVG
          </div>
          <h2 className="text-xl font-black text-slate-900">Panel Central</h2>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">
            {user?.rol ? user.rol.replace('_', ' ') : 'Administrador'}
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <MenuItem id="dashboard" icon="📊" label="Dashboard" activeTab={activeTab} onClick={setActiveTab} />
            
            {esProfesor && (
              <MenuItem id="estudiantes" icon="👨‍🎓" label="Estudiantes / Notas" activeTab={activeTab} onClick={setActiveTab} />
            )}
            
            <MenuItem id="inscripciones" icon="📝" label="Inscripciones" activeTab={activeTab} onClick={setActiveTab} />
            <MenuItem id="documentos" icon="📁" label="Documentos" activeTab={activeTab} onClick={setActiveTab} />
            <MenuItem id="blog" icon="📰" label="Gestionar Blog" activeTab={activeTab} onClick={setActiveTab} />
            <MenuItem id="informacion_portal" icon="ℹ️" label="Información Portal" activeTab={activeTab} onClick={setActiveTab} />
            <MenuItem id="usuarios" icon="👥" label="Usuarios" activeTab={activeTab} onClick={setActiveTab} />
            <MenuItem id="configuracion" icon="⚙️" label="Configuración" activeTab={activeTab} onClick={setActiveTab} />
          </ul>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-bold"
          >
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          
          <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <h1 className="text-2xl font-black text-slate-900 capitalize">
                Hola, {user?.nombres || 'Usuario'}
              </h1>
              <p className="text-slate-500 mt-1">
                {activeTab === 'estudiantes' ? 'Gestiona las calificaciones de tus alumnos.' : 'Resumen de actividad y gestión del sistema.'}
              </p>
            </div>
            {user?.materia && (
              <div className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-sm tracking-wider uppercase shadow-md">
                Materia: {user.materia}
              </div>
            )}
          </header>

          <div className="animate-fadeIn">
            
            {/* VISTA: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard value={datos.inscripciones.length} label="Total Inscritos" borderColor="border-l-blue-500" />
                  <StatCard value={estudiantes.length} label="Estudiantes Regulares" borderColor="border-l-green-500" />
                  <StatCard value={datos.documentos.length} label="Docs Pendientes" borderColor="border-l-yellow-500" />
                  <StatCard value={datos.usuarios.length} label="Usuarios Registrados" borderColor="border-l-rose-500" />
                </div>
              </div>
            )}

            {/* VISTA: ESTUDIANTES Y CALIFICACIONES */}
            {activeTab === 'estudiantes' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span className="w-4 h-4 bg-rose-900 rounded-full inline-block"></span>
                    Carga de Calificaciones
                  </h3>
                  
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-bold text-slate-700">Filtrar por Grado:</label>
                    <select 
                      value={gradoFiltro}
                      onChange={(e) => setGradoFiltro(e.target.value)}
                      className="bg-white border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 p-2.5 font-medium shadow-sm"
                    >
                      <option value="Todos">Todos los grados</option>
                      <option value="1er Año">1er Año</option>
                      <option value="2do Año">2do Año</option>
                      <option value="3er Año">3er Año</option>
                      <option value="4to Año">4to Año</option>
                      <option value="5to Año">5to Año</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-900 text-white uppercase tracking-wider text-xs">
                        <th className="px-4 py-4 font-bold rounded-tl-lg">Cédula</th>
                        <th className="px-4 py-4 font-bold">Estudiante</th>
                        <th className="px-4 py-4 font-bold text-center">Grado</th>
                        <th className="px-4 py-4 font-bold text-center text-rose-300">1er Lapso</th>
                        <th className="px-4 py-4 font-bold text-center text-rose-300">2do Lapso</th>
                        <th className="px-4 py-4 font-bold text-center text-rose-300">3er Lapso</th>
                        <th className="px-4 py-4 font-bold text-center rounded-tr-lg">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {estudiantesFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-4 py-8 text-center text-slate-500 font-medium">
                            No hay estudiantes registrados en este grado.
                          </td>
                        </tr>
                      ) : (
                        estudiantesFiltrados.map((est) => (
                          <tr key={est.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-600">{est.cedula_alumno}</td>
                            <td className="px-4 py-3 text-slate-900 font-bold capitalize">
                              {est.apellidos}, {est.nombres}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="bg-slate-200 text-slate-800 text-xs px-2 py-1 rounded font-bold">
                                {est.anio_cursar || 'N/A'}
                              </span>
                            </td>
                            
                            <td className="px-4 py-3 text-center">
                              <input 
                                type="number" 
                                min="1" max="20"
                                placeholder="--"
                                className="w-16 text-center border border-slate-300 rounded p-1 text-slate-900 font-bold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                                value={notasTemporales[est.cedula_alumno]?.lapso1 || ''}
                                onChange={(e) => handleNotaChange(est.cedula_alumno, 'lapso1', e.target.value)}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input 
                                type="number" 
                                min="1" max="20"
                                placeholder="--"
                                className="w-16 text-center border border-slate-300 rounded p-1 text-slate-900 font-bold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                                value={notasTemporales[est.cedula_alumno]?.lapso2 || ''}
                                onChange={(e) => handleNotaChange(est.cedula_alumno, 'lapso2', e.target.value)}
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input 
                                type="number" 
                                min="1" max="20"
                                placeholder="--"
                                className="w-16 text-center border border-slate-300 rounded p-1 text-slate-900 font-bold focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                                value={notasTemporales[est.cedula_alumno]?.lapso3 || ''}
                                onChange={(e) => handleNotaChange(est.cedula_alumno, 'lapso3', e.target.value)}
                              />
                            </td>

                            <td className="px-4 py-3 text-center">
                              <button 
                                onClick={() => guardarNotas(est.cedula_alumno)}
                                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded font-bold text-xs shadow-sm transition-colors uppercase tracking-wide"
                              >
                                Guardar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VISTA: GESTIONAR BLOG */}
            {activeTab === 'blog' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Gestionar Blog</h3>
                  <button 
                    onClick={() => setMostrarFormBlog(!mostrarFormBlog)}
                    className="px-4 py-2 bg-rose-900 text-white font-bold rounded-lg hover:bg-rose-800 transition-colors shadow-sm"
                  >
                    {mostrarFormBlog ? 'Cancelar' : '+ Nueva Publicación'}
                  </button>
                </div>

                {mostrarFormBlog && (
                  <form onSubmit={handleCrearPublicacion} className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-800 mb-4">Crear Nueva Publicación</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título de la publicación</label>
                        <input 
                          type="text" required
                          value={nuevoPost.titulo}
                          onChange={(e) => setNuevoPost({...nuevoPost, titulo: e.target.value})}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-rose-900 focus:border-rose-900 outline-none"
                          placeholder="Ej. Gran final del torneo de Ajedrez..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                        <select 
                          value={nuevoPost.categoria}
                          onChange={(e) => setNuevoPost({...nuevoPost, categoria: e.target.value})}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-rose-900 outline-none bg-white"
                        >
                          <option value="COMPETENCIA">Competencia</option>
                          <option value="NOTICIA">Noticia</option>
                          <option value="AVISO">Aviso</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contenido</label>
                        <textarea 
                          required rows="4"
                          value={nuevoPost.contenido}
                          onChange={(e) => setNuevoPost({...nuevoPost, contenido: e.target.value})}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-rose-900 outline-none"
                          placeholder="Escribe el desarrollo de la noticia aquí..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <button 
                          type="submit" 
                          disabled={guardandoBlog}
                          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400"
                        >
                          {guardandoBlog ? 'Guardando...' : 'Guardar Publicación'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {datos.publicaciones.length === 0 ? (
                      <p className="text-slate-500 text-center py-4 bg-slate-50 rounded-lg">No hay publicaciones activas.</p>
                  ) : datos.publicaciones.map((pub) => (
                    <div key={pub.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center bg-white hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-bold text-slate-900">{pub.titulo}</h4>
                        <p className="text-sm text-slate-500">
                          <span className="font-medium text-rose-900">{pub.categoria}</span> • {new Date(pub.creado_en).toLocaleDateString('es-VE')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => eliminarPublicacion(pub.id)} className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISTA: INFORMACIÓN PORTAL */}
            {activeTab === 'informacion_portal' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Información Portal (Cartelera Informativa)</h3>
                  <button 
                    onClick={() => setMostrarFormNoticias(!mostrarFormNoticias)}
                    className="px-4 py-2 bg-rose-900 text-white font-bold rounded-lg hover:bg-rose-800 transition-colors shadow-sm"
                  >
                    {mostrarFormNoticias ? 'Cancelar' : '+ Nuevo Aviso / Noticia'}
                  </button>
                </div>

                {mostrarFormNoticias && (
                  <form onSubmit={handleCrearNoticiaPortal} className="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-xl">
                    <h4 className="font-bold text-slate-800 mb-4">Crear Nuevo Registro Informativo</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Título del Aviso / Noticia</label>
                        <input 
                          type="text" required
                          value={nuevaNoticia.titulo}
                          onChange={(e) => setNuevaNoticia({...nuevaNoticia, titulo: e.target.value})}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-rose-900 focus:border-rose-900 outline-none"
                          placeholder="Ej. Convocatoria a Asamblea General..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                        <select 
                          value={nuevaNoticia.categoria}
                          onChange={(e) => setNuevaNoticia({...nuevaNoticia, categoria: e.target.value})}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-rose-900 outline-none bg-white"
                        >
                          <option value="NOTICIA">Noticia</option>
                          <option value="AVISO">Aviso</option>
                          <option value="COMPETENCIA">Competencia</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Contenido Informativo</label>
                        <textarea 
                          required rows="4"
                          value={nuevaNoticia.contenido}
                          onChange={(e) => setNuevaNoticia({...nuevaNoticia, contenido: e.target.value})}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-rose-900 outline-none"
                          placeholder="Escribe el aviso meramente informativo aquí..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <button 
                          type="submit" 
                          disabled={guardandoNoticias}
                          className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:bg-slate-400"
                        >
                          {guardandoNoticias ? 'Guardando...' : 'Publicar en Cartelera'}
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  {datos.noticiasPortal.length === 0 ? (
                      <p className="text-slate-500 text-center py-4 bg-slate-50 rounded-lg">No hay avisos informativos publicados.</p>
                  ) : datos.noticiasPortal.map((noti) => (
                    <div key={noti.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center bg-white hover:shadow-md transition-shadow">
                      <div>
                        <h4 className="font-bold text-slate-900">{noti.titulo}</h4>
                        <p className="text-sm text-slate-500">
                          <span className="font-medium text-rose-900">{noti.categoria}</span> • {new Date(noti.creado_en).toLocaleDateString('es-VE')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => eliminarNoticiaPortal(noti.id)} className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VISTA: USUARIOS */}
            {activeTab === 'usuarios' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="text-lg font-black text-slate-900 mb-4">Gestión de Usuarios</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                        <tr className="border-b border-slate-200">
                            <th className="px-4 py-3 font-semibold text-slate-700">Cédula</th>
                            <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
                            <th className="px-4 py-3 font-semibold text-slate-700">Rol</th>
                        </tr>
                        </thead>
                        <tbody>
                        {datos.usuarios.map((usr) => (
                            <tr key={usr.id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="px-4 py-3 text-slate-600 font-medium">{usr.cedula}</td>
                                <td className="px-4 py-3 text-slate-900 font-bold capitalize">{usr.nombres}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                                      usr.rol?.includes('profesor') ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {usr.rol?.replace('_', ' ') || 'Usuario'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;