import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Spinner = () => (
  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);

const Login = () => {
  const [tipoUsuario, setTipoUsuario] = useState('estudiante');
  const [credencial, setCredencial] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!credencial.trim() || !password.trim()) {
      setError('Por favor complete todos los campos');
      setLoading(false);
      return;
    }

    const resultado = login(credencial, password);

    if (!resultado.success) {
      setError(resultado.error);
      setLoading(false);
      return;
    }

    navigate(resultado.redirect);
  };

  const getPlaceholder = () => {
    if (tipoUsuario === 'admin') {
      return 'Ingrese su cédula (V-00000000)';
    }
    return 'Ingrese su código único (MVG-XXXXX)';
  };

  const getLabel = () => {
    if (tipoUsuario === 'admin') {
      return 'Cédula de Identidad';
    }
    return 'Código Único';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 bg-rose-900 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">MVG</div>
        <h2 className="text-3xl font-extrabold text-slate-900">Acceder al Portal</h2>
        <p className="mt-2 text-sm text-slate-600">C.E.T.D Miguel Vicente Gañango</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border-t-4 border-rose-900 sm:rounded-2xl sm:px-10">
          
          <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
            <button
              type="button"
              onClick={() => { setTipoUsuario('estudiante'); setCredencial(''); setError(''); }}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                tipoUsuario === 'estudiante' 
                  ? 'bg-white text-rose-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Estudiante
            </button>
            <button
              type="button"
              onClick={() => { setTipoUsuario('admin'); setCredencial(''); setError(''); }}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                tipoUsuario === 'admin' 
                  ? 'bg-white text-rose-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Administrador
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {getLabel()}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  value={credencial}
                  onChange={(e) => setCredencial(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-rose-900 text-white font-bold rounded-lg hover:bg-rose-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Spinner />
              ) : (
                'INICIAR SESIÓN'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-rose-900 hover:text-rose-800 font-medium">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;