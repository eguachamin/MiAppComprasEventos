import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, Linking, StyleSheet } from "react-native";
import CarruselBanners from "@/components/modals/CarruselBanners";
import { obtenerBanners } from "@/services/eventosService";

export default function InformacionEventosScreen() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarBanners = async () => {
      try {
        const datos = await obtenerBanners();
        // Prueba de funcionamiento
        console.log("✓ Banners promocionales cargados correctamente");
        console.log("Cantidad de banners recibidos:", datos.length);
        console.log("Primer banner:", datos[0]);
        setBanners(datos);
        setLoading(false);
      } catch (error: any) {
        console.log("✗ Error al cargar los banners:", error.message);
      }
    };

    cargarBanners();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#000", flex: 1 }}>
      <Text style={styles.titulo}>Nuestros Eventos Especiales</Text>

      {/* Carrusel de banners */}
      <CarruselBanners banners={banners} isLoading={loading} />

      {/* Banners quemados (opcional si quieres dos fijos) */}
      {!loading && (
        <>
          <Text style={styles.subtitulo}>¿Cómo cotizar un evento?</Text>
          <Text style={styles.descripcion}>
            Si deseas cotizar tu propio evento o tienes dudas sobre los publicados, haz clic en el botón inferior y contáctanos directamente por WhatsApp.
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
        </>
      )}

      {/* Un banners fijos (quemados) */}
      <View style={styles.infoContainer}>
        <Text style={styles.subtitulo}></Text>

        <Image
          source={require("@/assets/images/Imagen_Publicitaria1.jpg")}
          style={styles.bannerEstatico}
        />
            </View>
        {/* Sección de redes sociales */}
<View style={styles.redesContainer}>
  <TouchableOpacity
    onPress={() =>
      Linking.openURL("https://www.facebook.com/edwin.asqui.1") 
    }
  >
    <View style={styles.redSocialItem}>
      <Image
        source={require("@/assets/images/facebook.png")} // ajusta la ruta según tu estructura
        style={styles.iconoRed}
      />
      <Text style={styles.redSocialTexto}>Edwin Asqui - Facebook</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() =>
      Linking.openURL("https://www.instagram.com/edwinasqui/") 
    }
  >
    <View style={styles.redSocialItem}>
      <Image
        source={require("@/assets/images/instagram.png")}
        style={styles.iconoRed}
      />
      <Text style={styles.redSocialTexto}>edwinasqui - Instagram</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() =>
      Linking.openURL("https://twitter.com/EdwinAsqui") 
    }
  >
    <View style={styles.redSocialItem}>
      <Image
        source={require("@/assets/images/twitter.png")}
        style={styles.iconoRed}
      />
      <Text style={styles.redSocialTexto}>@EdwinAsqui - Twitter/X</Text>
    </View>
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
    paddingHorizontal: 20,
  },
  infoContainer: {
    padding: 30,
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
    paddingHorizontal: 20,
  },
  descripcion: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  botonWhatsapp: {
    backgroundColor: "#25D366",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  textoBotonWhatsapp: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff",
  },
  bannerEstatico: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  redesContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  redSocialItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  redSocialTexto: {
    marginLeft: 15,
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "bold",
  },
  iconoRed: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});