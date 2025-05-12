import axios from 'axios';

// Crear una instancia básica
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'https://inexcons-backend.onrender.com/api', // URL del backend de Laravel
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false, // Cambiar a false para evitar problemas de CORS
  // Configuración adicional para mejorar la estabilidad
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Aceptar respuestas hasta 499
  }
});

// Interceptor para agregar el token a las peticiones
instance.interceptors.request.use(
  (config) => {
    console.log('=== Inicio de Petición ===');
    console.log('URL:', config.url);
    console.log('Método:', config.method);
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    console.log('Base URL:', config.baseURL);
    console.log('=== Fin de Petición ===');
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Agregar timestamp para evitar caché
    config.params = {
      ...config.params,
      _t: new Date().getTime()
    };
    return config;
  },
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
instance.interceptors.response.use(
  (response) => {
    console.log('=== Respuesta Exitosa ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('Headers:', response.headers);
    console.log('=== Fin de Respuesta ===');
    return response;
  },
  (error) => {
    console.error('=== Error en la Respuesta ===');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Config:', {
      url: error.config?.url,
      method: error.config?.method,
      data: error.config?.data,
      baseURL: error.config?.baseURL
    });
    console.error('=== Fin de Error ===');

    if (error.response?.status === 401) {
      // Limpiar el token y redirigir al login
      localStorage.clear();
      // No redirigir si ya estamos en la página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (error.code === 'ECONNABORTED') {
      // Manejar timeout
      return Promise.reject(new Error('La conexión tardó demasiado. Por favor, verifica tu conexión a internet.'));
    } else if (!error.response) {
      // Manejar errores de red
      return Promise.reject(new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.'));
    } else if (error.response?.status === 422) {
      return Promise.reject(new Error('Datos inválidos. Por favor, verifica la información ingresada.'));
    } else if (error.response?.status === 500) {
      return Promise.reject(new Error('Error del servidor. Por favor, intenta más tarde.'));
    }
    return Promise.reject(error);
  }
);

export default instance; 