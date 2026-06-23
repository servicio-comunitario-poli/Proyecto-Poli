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

    try {
      // MODIFICACIÓN: Agregamos await porque el login contra Supabase es asíncrono
      const resultado = await login(credencial, password, tipoUsuario);

      if (!resultado.success) {
        setError(resultado.error);
        setLoading(false);
        return;
      }

      // Si todo sale bien, navegamos
      navigate(resultado.redirect);
    } catch (err) {
      setError("Error de conexión con la base de datos");
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    if (tipoUsuario === 'admin') {
      return 'Ingrese su cédula (V-00000000)';
    }
    return 'Ingrese su código de estudiante';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <h2 className="text-2xl font-black text-slate-900 mb-6 text-center uppercase">Iniciar Sesión</h2>
        
        <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setTipoUsuario('estudiante')}
            className={`flex-1 py-2 rounded-md font-bold text-sm uppercase transition-colors ${tipoUsuario === 'estudiante' ? 'bg-white shadow text-rose-900' : 'text-slate-500'}`}
          >
            Estudiante
          </button>
          <button 
            onClick={() => setTipoUsuario('admin')}
            className={`flex-1 py-2 rounded-md font-bold text-sm uppercase transition-colors ${tipoUsuario === 'admin' ? 'bg-white shadow text-rose-900' : 'text-slate-500'}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Credencial</label>
            <input
              type="text"
              value={credencial}
              onChange={(e) => setCredencial(e.target.value)}
              placeholder={getPlaceholder()}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-900 focus:border-rose-900 outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-rose-900 text-white font-bold rounded-lg hover:bg-rose-800 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? <Spinner /> : 'INICIAR SESIÓN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;