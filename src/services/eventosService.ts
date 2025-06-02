import api from "@/services/api";

export interface Banner {
  _id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  linkCotizar?: string;
}

// Obtener banners desde el backend
export const obtenerBanners = async (): Promise<Banner[]> => {
  try {
    const response = await api.get("/evento/listar");

    // Mapeamos tus eventos a banners
    const bannersBackend = response.data.map((evento: any) => ({
      _id: evento._id,
      nombre: evento.nombre,
      descripcion: evento.descripcion,
      imagenUrl: evento.imagenUrl,
      linkCotizar:
        evento.linkCotizar ||
        "https://wa.me/+593992801667?text=Hola%20¿me%20puedes%20dar%20más%20información?",
    }));

    return bannersBackend;
  } catch (error) {
    console.warn("Usando banners quemados (API falló)", error);
    return [
      {
        _id: "default1",
        nombre: "Evento Musical",
        descripcion: "No hay eventos disponibles aún.",
        imagenUrl:
          "https://via.placeholder.com/400x150/FFD700/FFFFFF?text=Sin+eventos",
        linkCotizar:
          "https://wa.me/+593992801667?text=Hola%20quiero%20cotizar%20un%20evento",
      },
    ];
  }
};
