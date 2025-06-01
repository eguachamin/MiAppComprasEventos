import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";

// Asegúrate de tener esta versión instalada
import SkeletonContent from "react-native-skeleton-content";

interface Banner {
  id: string;
  uri: string;
}

interface Props {
  banners: Banner[];
  isLoading?: boolean;
}

export default function CarruselBanners({ banners, isLoading = true }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <>
      {/* Cargando */}
      {isLoading && (
        <View
          style={{
            width: "100%",
            height: 150,
            backgroundColor: "#333",
            borderRadius: 12,
            marginHorizontal: 20,
            marginBottom: 20,
          }}
        />
      )}

      {/* Contenido real */}
      {!isLoading && (
        <View
          style={{
            width: "100%",
            height: 150,
            borderRadius: 12,
            overflow: "hidden",
            marginHorizontal: 20,
            marginBottom: 20,
          }}
        >
          <Image
            source={{ uri: banners[activeIndex].uri }}
            style={{ width: "100%", height: 150 }}
            resizeMode="cover"
          />
        </View>
      )}
    </>
  );
}