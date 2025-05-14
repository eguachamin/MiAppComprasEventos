import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/', // ✅ Reemplaza con tu URL real
});

// Login correcto según tu backend:
export const login = async (email: string, password: string) => {
  const response = await api.post('/cliente/login', { email, password });
  return response.data;
};

// Registro según tu backend:
export const register = async (
  name: string,
  mail: string,
  password: string,
  phone: string,
  birthdate: string,
  address: string,
  province: string,
  city: string
) => {
  try {
    const response = await api.post('/cliente/registro', {
      name,
      mail,
      password,
      phone,
      birthdate,
      address,
      province,
      city,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error de registro');
    }
    throw new Error('Error desconocido en el registro');
  }
};
export const resendVerification = async (email: string) => {
  try {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al reenviar verificación');
    }
    throw new Error('Error desconocido al reenviar verificación');
  }
};

export const enviarCotizacion = async (data: any, token: string) => {
  try {
    const response = await api.post('/cotizaciones', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al enviar cotización');
    }
    throw new Error('Error desconocido al enviar cotización');
  }
};
export const checkReservationExists = async (date: string, time: string, token: string) => {
  try {
    const response = await api.get(`/reservations/check?date=${date}&time=${time}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Suponiendo que el backend responde con: { exists: true }
    return response.data.exists;

  } catch (error: any) {
    console.error('Error en la revision de la reserva:', error?.response?.data || error.message);
    throw new Error('Fallo en la revisión');
  }
};
export const getUserOrders = async (token: string) => {
  try {
    const response = await api.get('/pedidos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // se espera un array de pedidos
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al obtener los pedidos');
    }
    throw new Error('Error desconocido al obtener los pedidos');
  }
};