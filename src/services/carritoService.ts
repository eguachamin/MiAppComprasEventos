import api from "./api";
import { useAuthStore } from "@/store/authStore";

interface ProductoEnCarrito {
  productoId: string;
  nombreDisco: string;
  artista: string;
  imagen: string;
  precio: number;
  cantidad: number;
}

export interface Carrito {
  _id: string;
  cliente: string;
  productos: {
    _id: string;
    producto: {
      _id: string;
      nombreDisco: string;
      artista: string;
      precio: number;
      genero: string;
      stock: number;
      imagen: string;
    };
    cantidad: number;
  }[];
  total: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export const agregarAlCarrito = async ( productoId: string, cantidad: number = 1) => {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error("No autenticado");
  try {
    const response = await api.post( "/carrito/agregar",
      {
        productos: [{productoId,cantidad,},],
      },
      {
        headers: {Authorization: `Bearer ${token}`,},
      }
    );

    return response.data;
  } catch (error:any) {
    const mensaje = error.response?.data?.msg || "Error al agregar al carrito";
    console.error("Error al agregar al carrito:", mensaje);
    throw new Error(mensaje); 
  }
};

export const obtenerCarrito = async (): Promise<Carrito> => {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error("No autenticado");

  const response = await api.get("/carrito", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data as Carrito; // 👈 ahora devuelve el objeto completo
};

export const actualizarCantidadProducto = async (productoId: string, nuevaCantidad: number) => {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error('No autenticado');

  const response = await api.put(
    '/carrito/actualizar',
    { productoId, nuevaCantidad },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data; // lo que devuelva el backend (puedes ajustar si quieres)
};
export const eliminarProductoDelCarrito = async (productoId: string) => {
  const token = useAuthStore.getState().token;

  const response = await api.delete(`/carrito/eliminar/${productoId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};