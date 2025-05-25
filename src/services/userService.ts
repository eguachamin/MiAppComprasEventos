import api from "./api";
import { useAuthStore } from "@/store/authStore";

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

export interface ActContraseña {
  passwordactual: string;
  passwordnuevo: string;
}

export const registerUser = async (payload: RegistroPayload) => {
  try {
    const response = await api.post("/cliente/registro", payload);
    console.log("Respuesta del servidor:", response.data);
    // Aquí puedes validar que la respuesta sea exitosa o no
    return response.data;
  } catch (error: any) {
    console.error("Error en el registro:", error);
    throw error;
  }
};

export const loginUser = async (payload: LoginPayload) => {
  try {
    const response = await api.post("/cliente/login", payload);
    return response.data;
  } catch (error: any) {
    console.error("Error en el login:", error);

    // Relanza el error para que el componente lo maneje
    throw error;
  }
};

export const getProductos = async () => {
  try {
    const response = await api.get("/producto/listar");
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};
export const reenviarCorreoVerificacion = async (
  payload: VerificiacionPayload
) => {
  const response = await api.post("/cliente/reenviar-confirmacion", payload);
  return response.data;
};

export const recuperarPassword = async (email: string) => {
  const res = await api.post("/cliente/recuperar-password", { email });
  return res.data;
};

export const obtenerDetalleCliente = async () => {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error("No autenticado");

  const response = await api.get(`/cliente/perfil/`, {
    headers: {

      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Cambiar contraseña
export const cambiarPassword = async (payload: ActContraseña) => {
  const { token } = useAuthStore.getState();
  if (!token) throw new Error("No autenticado");

  const res = await api.put("/cliente/actualizarpassword", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
//Funcion para actualizar Cliente:

export const actualizarCliente = async (
  datosActualizados: any,
  imagenUri?: string | null,
  eliminarFoto?: boolean
) => {
  const { user, token } = useAuthStore.getState();
  if (!user || !token) throw new Error("No autenticado");
  const formData = new FormData();
  console.log("Imagen recibida en el servicio:", imagenUri);
  console.log("Eliminar foto:", eliminarFoto);

  // Agregar los campos de texto
  for (const key in datosActualizados) {
  const valor = datosActualizados[key];

  if (
    valor !== null &&
    valor !== undefined &&
    (typeof valor === "string" || typeof valor === "number" || typeof valor === "boolean")
  ) {
    formData.append(key, valor.toString());
  } else if (typeof valor === "object" && valor !== null) {
    // Si recibes un objeto (por ejemplo una provincia seleccionada), puedes extraer el campo útil:
    if (valor.id) {
      formData.append(key, valor.id.toString());
    } else if (valor.nombre) {
      formData.append(key, valor.nombre.toString());
    }
    // O ignóralo si no es útil
  }
}

  if (eliminarFoto) {
    formData.append("eliminarFoto", "true");
  } else if (imagenUri && typeof imagenUri === "string") {
    if (imagenUri.startsWith("file://")) {
      // Caso móvil: URI local
      console.log("imagenUri es válida (file):", imagenUri);
      const filename = imagenUri.split("/").pop() || "foto.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const ext = match?.[1]?.toLowerCase();
      const type =
        ext === "jpg" || ext === "jpeg"
          ? "image/jpeg"
          : ext === "png"
          ? "image/png"
          : "image/jpeg";
      formData.append("fotoPerfil", {
        uri: imagenUri,
        name: filename,
        type,
      } as any);
    } else if (imagenUri.startsWith("data:image")) {
      // Caso base64: convertir a Blob y File
      console.log("imagenUri es base64, convirtiendo a Blob");
      const base64Data = imagenUri.split(",")[1];
      const contentTypeMatch = imagenUri.match(/data:(image\/\w+);base64,/);
      const contentType = contentTypeMatch ? contentTypeMatch[1] : "image/jpeg";

      const blob = base64ToBlob(base64Data, contentType);
      const file = new File([blob], "foto.jpg", { type: contentType });

      formData.append("fotoPerfil", file);
    } else {
      console.warn("URI de imagen no soportada:", imagenUri);
    }
  }

  try {
    console.log("Enviando perfil:", datosActualizados);
    console.log("Imagen para enviar:", imagenUri);
    console.log("Eliminar foto:", eliminarFoto);

    const response = await api.put(`/cliente/actualizar/${user.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Respuesta del backend:", response.data);
    return response.data;
  } catch (error: any) {
      console.error("Error completo al actualizar perfil:", error);
      console.error("Error.response:", error?.response);
      console.error("Error.response.data:", error?.response?.data);
    console.error("Respuesta del servidor:", JSON.stringify(error?.response?.data, null, 2));
    throw new Error(
       (error?.response?.data?.mensaje) ||
        error?.message ||
        "Error al actualizar perfil"
    );
  }
};
// Función auxiliar para convertir base64 a Blob
function base64ToBlob(base64Data: string, contentType = "") {
  const sliceSize = 512;
  const byteCharacters = atob(base64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
}