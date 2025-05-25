import api from './api';
import {useAuthStore} from '@/store/authStore'

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

export interface ActContraseña{
  passwordactual: string;
  passwordnuevo: string;
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


export const obtenerDetalleCliente = async () => {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error('No autenticado');

  const response = await api.get(`/cliente/perfil/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const actualizarCliente = async (datosActualizados: any) => {
  const { user, token } = useAuthStore.getState();
  if (!user || !token) throw new Error('No autenticado');

  try {
    const response = await api.put(`/cliente/actualizar/${user.id}`, datosActualizados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Respuesta del servidor:', error?.response?.data);
    throw new Error(error?.response?.data?.mensaje || 'Error al actualizar perfil');
  }
};

// Cambiar contraseña
export const cambiarPassword = async (payload: ActContraseña) => {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error('No autenticado');

  const res = await api.put('/cliente/actualizarpassword', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};



export const subirFotoPerfil = async (imagenUri: string) => {
  const { user, token } = useAuthStore.getState();
  if (!user || !token) throw new Error('No autenticado');

  const formData = new FormData();
  formData.append('imagen', {
    uri: imagenUri,
    name: 'perfil.jpg',
    type: 'image/jpeg',
  } as any);

  try {
    const response = await api.post(`/cliente/subir-foto/${user.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al subir imagen:', error);
    throw error;
  }
};
