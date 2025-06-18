import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

interface Banner {
  _id: string;
  nombre: string;
  imagenUrl: string;
  fecha: string; // Cambiado a string minúscula (recomendado)
}

interface Props {
  banners: Banner[];
  isLoading?: boolean;
}

export default function CarruselBanners({ banners, isLoading }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isLoading && banners.length > 1) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % banners.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners.length, isLoading]);

  // Validación adicional
  if (isLoading || banners.length === 0) {
    return (
      <View style={styles.skeleton}>
        <Text style={{ color: "#fff" }}>Cargando banner...</Text>
      </View>
    );
  }

  const activeBanner = banners[activeIndex];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        // Puedes dejar esto vacío o abrir un link si tienes linkCotizar
        // Si quieres agregarlo después, está bien así
      }}
    >
      <Image
        source={{ uri: activeBanner.imagenUrl }}
        style={styles.image}
        resizeMode="cover"
        onError={(e) => console.log("Error cargando imagen:", e.nativeEvent.error)}
      />

      <Text style={styles.titulo}>{activeBanner.nombre}</Text>

      {/* Muestra la fecha si existe */}
      {activeBanner.fecha && (
        <Text style={styles.fecha}>
          Fecha: {new Date(activeBanner.fecha).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  image: {
    width: "105%",
    height: 400,
    borderRadius: 12,
    backgroundColor: "#222", // Fondo en caso de fallar la imagen
  },
  titulo: {
    color: "#FFD700",
    textAlign: "center",
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
  },
  fecha: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 4,
    fontSize: 14,
  },
  skeleton: {
    width: "100%",
    height: 150,
    backgroundColor: "#333",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
});