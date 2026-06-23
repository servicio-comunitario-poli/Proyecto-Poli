/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback } from 'react';
import { supabase } from '../utils/server'; // Importamos el cliente centralizado

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
  const [loading, setLoading] = useState(false);

  // AHORA ES ASYNC PARA PODER HACER EL AWAIT CON SUPABASE
  const login = useCallback(async (credencial, password, tipoUsuario) => {
    setLoading(true);
    const credencialTrim = credencial.trim();

    // 1. Consultar usuario en Supabase
    // Ajustamos la columna a buscar según si es admin o estudiante
    const campoBusqueda = tipoUsuario === 'admin' ? 'cedula' : 'codigo_estudiante';

    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq(campoBusqueda, credencialTrim)
      .single();

    if (error || !usuario) {
      setLoading(false);
      return { success: false, error: 'Usuario no encontrado' };
    }

    // 2. Verificar contraseña (Asegúrate de que el campo en DB se llame password)
    if (usuario.password !== password) {
      setLoading(false);
      return { success: false, error: 'Contraseña incorrecta' };
    }

    // 3. Lógica de redirección según el rol
    if (usuario.rol === 'admin') {
      const userData = { ...usuario };
      delete userData.password;
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setLoading(false);
      return { success: true, redirect: '/admin', rol: 'admin' };
    }

    // Lógica para estudiantes (revisar inscripciones si es necesario)
    const userData = { ...usuario };
    delete userData.password;

    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setLoading(false);

    // Aquí podrías agregar lógica para verificar si ya completó inscripción
    if (!usuario.inscripcion_completa) {
      return { success: true, redirect: '/inscripcion', rol: 'estudiante' };
    }

    return { success: true, redirect: '/regulares', rol: 'estudiante' };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.rol === 'admin',
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;