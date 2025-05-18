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
    const response = await api.post('/cliente/registro', payload);
    console.log('Respuesta del servidor:', response.data);
    // Aquí puedes validar que la respuesta sea exitosa o no
    if (response.data.success === false) {
      // Si tu backend responde algo así, lanza error manualmente:
      throw new Error(response.data.message || 'Error desconocido');
    }
    return response.data;
  } catch (error: any) {
    console.error('Error en el registro:', error);
    let mensaje = 'Error al registrar usuario';

    if (error?.response?.data?.message) {
      mensaje = error.response.data.message;
    } else if (error?.message) {
      mensaje = error.message;
    }

    throw new Error(mensaje);
  }
};