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
export interface LoginPayload {
  email: string;
  password: string;
}
export interface VerificiacionPayload {
  email: string;
}

export const registerUser = async (payload: RegistroPayload) => {
  try {
    const response = await api.post('/cliente/registro', payload);
    console.log('Respuesta del servidor:', response.data);
    // Aquí puedes validar que la respuesta sea exitosa o no
    return response.data;
  } catch (error: any) {
    console.error('Error en el registro:', error);
    throw error;
  }
};

export const loginUser = async (payload: LoginPayload) => {
  try {
    const response = await api.post('/cliente/login', payload);
    return response.data;
  } catch (error: any) {
    console.error('Error en el login:', error);

    // Relanza el error para que el componente lo maneje
    throw error;
  }
};

export const getProductos = async () => {
  try {
    
    const response = await api.get('/producto/listar');
    return response.data;
  } catch (error: any) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
};
export const reenviarCorreoVerificacion = async (payload: VerificiacionPayload) => {
  const response = await api.post('/cliente/reenviar-confirmacion', payload);
  return response.data;
};

export const recuperarPassword = async (email: string) => {
  const res = await api.post('/cliente/recuperar-password', { email });
  return res.data;
};