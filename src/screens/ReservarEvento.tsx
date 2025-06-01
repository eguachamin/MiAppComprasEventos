// app/informacion-eventos.tsx

import React, { useState } from "react";
import {
  View,
  TextStyle,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from "react-native";
import SkeletonContent from "react-native-skeleton-content";
import CarruselBanners from "@/components/modals/CarruselBanners";

export default function InformacionEventosScreen() {
  const [loading, setLoading] = useState(true);
  const [banners] = useState([
    {
      id: "1",
      uri: "https://via.placeholder.com/400x150/FFD700/FFFFFF?text=Evento+Musical"
    },
    {
      id: "2",
      uri: "https://via.placeholder.com/400x150/000080/FFFFFF?text=Festival+de+Cine"
    },
    {
      id: "3",
      uri: "https://via.placeholder.com/400x150/006400/FFFFFF?text=Exposición+Arte"
    },
  ]);

  return (
    <ScrollView style={{ backgroundColor: "#000", flex: 1 }}> 
      <Text style={styles.titulo}>Nuestros Eventos Especiales</Text>

      {/* Carrusel de banners */}
      <CarruselBanners banners={banners} isLoading={loading} />

      {/* Información quemada */}
      <View style={styles.infoContainer}>
        <Text style={styles.descripcion}>
          ¡Asiste a nuestros eventos exclusivos! Tienes la oportunidad de conocer a artistas, participar en encuentros musicales y aprovechar descuentos especiales.
        </Text>

        <Text style={styles.subtitulo}>¿Cómo cotizar un evento?</Text>
        <Text style={styles.descripcion}>
          Si deseas cotizar tu propio evento o tienes dudas sobre los eventos publicados, haz clic en el botón inferior y contáctanos directamente por WhatsApp.
        </Text>

        {/* Botón de contacto */}
        <TouchableOpacity
          style={styles.botonWhatsapp}
          onPress={() => {
            const numero = "+593992801667"; // Reemplaza con tu número real
            const mensajePredefinido = "Hola,%20¿pueden%20darme%20más%20información%20sobre%20los%20eventos?";
            const url = `whatsapp://send?text=${mensajePredefinido}&phone=${numero}`;

            Linking.openURL(url).catch(() =>
              alert("No se pudo abrir WhatsApp. Asegúrate de tenerlo instalado.")
            );
          }}
        >
          <Text style={styles.textoBotonWhatsapp}>📲 Contactar por WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  subtitulo: {
    fontSize: 20,
    color: "#FFD700",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
  },
  botonWhatsapp: {
    backgroundColor: "#25D366",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBotonWhatsapp: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
});
