import api from './api';


export interface RegistroPayload {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  provincia: string;
  ciudad: string;
  password: string;
  confirmarPassword: string;
}

export const registerUser = async (payload: RegistroPayload) => {
  try {
    const response = await api.post('/cliente/registro', payload); // <-- Cambia la ruta si tu endpoint es diferente
    return response.data;
  } catch (error: any) {
    console.error('Error en el registro:', error.response?.data || error.message);
    throw error.response?.data || { message: 'Error al registrar usuario' };
  }
};