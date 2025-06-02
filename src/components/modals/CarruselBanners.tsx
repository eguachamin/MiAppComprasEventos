import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

interface Banner {
  _id: string;
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  linkCotizar?: string;
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
      }, 4000);

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
      style={{
        marginHorizontal: 20,
        marginBottom: 20,
      }}
      onPress={() => {
        if (activeBanner.linkCotizar) {
          Linking.openURL(activeBanner.linkCotizar);
        }
      }}
    >
      <Image
        source={{ uri: activeBanner.imagenUrl }}
        style={{
          width: "100%",
          height: 150,
          borderRadius: 12,
          marginBottom: 10,
        }}
        resizeMode="cover"
      />
      <Text style={{ color: "#FFD700", textAlign: "center", marginBottom: 10 }}>
        {activeBanner.nombre}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
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