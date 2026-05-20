import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import blogData from '../data/blog.json';
import resultadosData from '../data/resultados.json';

const MenuItem = ({ id, icon, label, activeTab, onClick }) => (
  <li>
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-rose-900 text-white' 
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  </li>
);

const StatCard = ({ value, label, borderColor }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${borderColor}`}>
    <div className="text-3xl font-black text-slate-900">{value}</div>
    <div className="text-slate-500 text-sm mt-1">{label}</div>
  </div>
);

const Badge = ({ aprobado }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    aprobado 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }`}>
    {aprobado ? 'Aprobado' : 'No Aprobado'}
  </span>
);

const Spinner = () => (
  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-900"></div>
);

const AdminPanel = () => {
  const { user, isAdmin, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const publicaciones = blogData.publicaciones;
  const resultados = resultadosData.resultados;

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900">Panel de Administración</h1>
          <p className="text-slate-600">Gestión del Sistema Polideportivo</p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <ul className="space-y-1">
                <MenuItem id="dashboard" icon="📊" label="Dashboard" activeTab={activeTab} onClick={setActiveTab} />
                <MenuItem id="resultados" icon="📋" label="Cargar Resultados" activeTab={activeTab} onClick={setActiveTab} />
                <MenuItem id="inscripciones" icon="✓" label="Inscripciones" activeTab={activeTab} onClick={setActiveTab} />
                <MenuItem id="blog" icon="📰" label="Gestionar Blog" activeTab={activeTab} onClick={setActiveTab} />
                <MenuItem id="usuarios" icon="👥" label="Usuarios" activeTab={activeTab} onClick={setActiveTab} />
              </ul>
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard value={publicaciones.length} label="Publicaciones Activas" borderColor="border-rose-900" />
                  <StatCard 
                    value={resultados.filter(r => r.aprobado).length} 
                    label="Aprobados Prueba Física" 
                    borderColor="border-green-500" 
                  />
                  <StatCard 
                    value={resultados.filter(r => !r.aprobado).length} 
                    label="No Aprobados" 
                    borderColor="border-amber-500" 
                  />
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Bienvenido, {user.nombres}</h3>
                  <p className="text-slate-600">
                    Use el menú lateral para acceder a las diferentes funciones del panel de administración.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'resultados' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Cargar Resultados de Pruebas Físicas</h3>
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">📁</div>
                  <p className="text-slate-600 mb-4">Arrastre un archivo Excel aquí o haga clic para seleccionar</p>
                  <p className="text-slate-400 text-sm mb-4">Formatos aceptados: .xlsx, .xls, .csv</p>
                  <button className="px-6 py-3 bg-rose-900 text-white font-bold rounded-lg hover:bg-rose-800 transition-colors">
                    Seleccionar Archivo
                  </button>
                </div>
                <div className="mt-6">
                  <h4 className="font-bold text-slate-700 mb-3">Resultados Recientes</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="px-4 py-3 font-semibold text-slate-700">Cédula</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">Nombre</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">Deporte</th>
                          <th className="px-4 py-3 font-semibold text-slate-700">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultados.map((r) => (
                          <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-3 text-slate-600">{r.cedula}</td>
                            <td className="px-4 py-3 text-slate-600">{r.nombres}</td>
                            <td className="px-4 py-3 text-slate-600">{r.deporte}</td>
                            <td className="px-4 py-3">
                              <Badge aprobado={r.aprobado} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inscripciones' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Inscripciones Completadas</h3>
                <p className="text-slate-600">Aquí se mostrarán las inscripciones que han completado la planilla.</p>
                <div className="mt-4 p-4 bg-slate-100 rounded-lg text-center text-slate-500">
                  No hay inscripciones completadas aún
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-900">Gestionar Blog</h3>
                  <button className="px-4 py-2 bg-rose-900 text-white font-bold rounded-lg hover:bg-rose-800 transition-colors">
                    + Nueva Publicación
                  </button>
                </div>
                <div className="space-y-4">
                  {publicaciones.map((pub) => (
                    <div key={pub.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-slate-900">{pub.titulo}</h4>
                        <p className="text-sm text-slate-500">{pub.categoria} • {new Date(pub.creado_en).toLocaleDateString('es-VE')}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                          Editar
                        </button>
                        <button className="px-3 py-1.5 text-sm text-rose-900 hover:bg-rose-50 rounded-lg transition-colors">
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'usuarios' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Gestión de Usuarios</h3>
                <p className="text-slate-600">Administrar usuarios del sistema.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;