import api from "@/services/api";

export interface Banner {
  _id: string;
  nombre: string;
  imagenUrl: string;
  fecha: string;
}

// Obtener banners desde el backend
export const obtenerBanners = async (): Promise<Banner[]> => {
  try {
    const response = await api.get("/evento/listar");

    // Mapeamos tus eventos a banners
    const bannersBackend = response.data.map((evento: any) => ({
      _id: evento._id,
      nombre: evento.nombreEvento,
      imagenUrl: evento.imagenEvento,
      fecha: evento.fechaEvento
    }));

    return bannersBackend;
  } catch (error) {
    console.warn("Usando banners quemados (API falló)", error);
    return [
      {
        _id: "default1",
        nombre: "Evento Musical",
        imagenUrl:
          "https://via.placeholder.com/400x150/FFD700/FFFFFF?text=Sin+eventos",
        fecha:""
      },
    ];
  }
};
