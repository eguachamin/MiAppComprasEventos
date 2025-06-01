import { API_URL } from '@env';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';


const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para agregar token a cada petición
api.interceptors.request.use(
  async (config) => {
    const token = useAuthStore.getState().token; // Obtener token directamente del store
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {};
    if (status === 401) {
      // Token inválido o expirado, hacer logout
      useAuthStore.getState().logout();
      // Aquí puedes agregar navegación a login si quieres, por ejemplo:
      // router.replace('/login');
    }
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 404) {
      console.warn('Producto ya eliminado:', error.response.data);
      return Promise.resolve(); // Ignora el error 404
    }
    throw error;
  }
);

export default api;