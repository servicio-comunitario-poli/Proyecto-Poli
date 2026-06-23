import { createClient } from '@supabase/supabase-js';

// Asegúrate de usar VITE_ en tu .env. 
// Si no quieres cambiar el .env, usa process.env.SUPABASE_URL pero VITE_ es lo recomendado para React.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Inicializamos el cliente. 
// Exportamos como 'supabase' para poder hacer: import { supabase } from '...'
export const supabase = createClient(supabaseUrl, supabaseKey);

// Prueba de conexión que pediste
supabase
    .from('usuarios') 
    .select('*', { count: 'exact', head: true })
    .then(({ error }) => {
    if (error) {
        console.error("🔴 ERROR DE CONEXIÓN A SUPABASE:", error.message);
    } else {
        console.log("🟢 CONEXIÓN A SUPABASE EXITOSA. Base de datos en línea.");
    }
    });