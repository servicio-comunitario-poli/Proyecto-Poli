/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback } from 'react';
import usuariosData from '../data/usuarios.json';
import resultadosData from '../data/resultados.json';

const STORAGE_KEY = 'polideportivo_user';

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading] = useState(false);

  const login = useCallback((credencial, password) => {
    const usuarios = usuariosData.usuarios;
    const credencialTrim = credencial.trim();

    const usuario = usuarios.find(u => 
      u.cedula === credencialTrim || u.codigo === credencialTrim
    );

    if (!usuario) {
      return { success: false, error: 'Usuario no encontrado' };
    }

    if (usuario.password !== password) {
      return { success: false, error: 'Contraseña incorrecta' };
    }

    if (usuario.rol === 'admin') {
      const userData = { ...usuario };
      delete userData.password;
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return { success: true, redirect: '/admin', rol: 'admin' };
    }

    const resultados = resultadosData.resultados;
    const resultadoAprobado = resultados.find(r => 
      r.usuario_id === usuario.id && r.aprobado === true
    );

    const userData = { 
      ...usuario,
      resultado_aprobado: !!resultadoAprobado
    };
    delete userData.password;

    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

    if (resultadoAprobado && !usuario.inscripcion_completa) {
      return { success: true, redirect: '/inscripcion', rol: 'estudiante' };
    }

    return { success: true, redirect: '/regulares', rol: 'estudiante' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isAdmin = user?.rol === 'admin';
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;