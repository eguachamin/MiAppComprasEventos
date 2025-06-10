import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../store/authStore";
import {
  obtenerDetalleCliente,
  actualizarCliente,
  cambiarPassword,
} from "../services/userService";
import { StyleSheet, Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import CambioPasswordExitoso from "../components/modals/CambioPasswordExitoso"; // ajusta la ruta
import { router } from "expo-router";
import ModalMensaje from "@/components/modals/ModalMensaje";
import { ImagePickerAsset } from "expo-image-picker";

interface Perfil {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  provincia: string;
  ciudad: string;
  fotoPerfil?: string | null;
}

const PerfilCliente = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, token } = useAuthStore();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [editando, setEditando] = useState(false);
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordactual, setPasswordactual] = useState("");
  const [passwordnuevo, setPasswordnuevo] = useState("");
  const [modalMensaje, setModalMensaje] = useState({
    visible: false,
    mensaje: "",
  });
  const [eliminarFoto, setEliminarFoto] = useState(false);

  useEffect(() => {
    if (user && token) {
      cargarPerfil();
      
    } else {
      console.log("No hay usuario o token");
      setLoading(false); // Para que no quede cargando infinitamente
    }
  }, [user, token]);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Se necesita acceso a la galería para seleccionar imágenes."
        );
      }
    })();
  }, []);

  const cargarPerfil = async () => {
    try {
      const data = await obtenerDetalleCliente();
      setPerfil(data);
      setImagen(data.fotoPerfil || null);
      console.log("URL de imagen:", data.fotoPerfil);
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      Alert.alert("Error", "No se pudo cargar el perfil.");
    } finally {
      setLoading(false);
    }
  };

  const seleccionarImagen = async () => {
    console.log("Seleccionar imagen ejecutado");
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64:false,
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      console.log("URI seleccionada:", uri);
      // Validar formato del URI
    // Validar formato del URI
    if (uri && (uri.startsWith("file://") || uri.startsWith("data:image"))) {
      console.log("URI válida para envío:", uri);
      setImagen(uri);
      setEliminarFoto(false);
    } else {
      console.warn("URI inválida o no soportada:", uri);
    }
    }
  };
  const guardarCambios = async () => {
    console.log("Ejecutando guardarCambios");
    if (!perfil) {
      setModalMensaje({
        visible: true,
        mensaje: "No hay perfil cargado.",
      });
      return;
    }
    const camposRequeridos: (keyof Perfil)[] = [
      "nombre",
      "email",
      "telefono",
      "direccion",
      "provincia",
      "ciudad",
      
    ];

    // Verifica si algún campo está vacío
    const camposVacios = camposRequeridos.filter((campo) => !perfil[campo]);

    if (camposVacios.length > 0) {
      setModalMensaje({
        visible: true,
        mensaje:
          "Por favor, completa todos los campos antes de actualizar tu perfil.",
      });
      return;
    }
    const imagenParaEnviar = eliminarFoto ? null : imagen;
    console.log("Imagen para enviar:", imagenParaEnviar);
    try {
      await actualizarCliente(perfil, imagenParaEnviar, eliminarFoto);
      setModalMensaje({
        visible: true,
        mensaje: "Perfil actualizado correctamente.",
      });

      Alert.alert("Éxito", "Perfil actualizado correctamente.");
      setEditando(false);
      setEliminarFoto(false);
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      setModalMensaje({
        visible: true,
        mensaje: error.message || "Hubo un problema al actualizar tu perfil.",
      });
      Alert.alert("Error", error.message || "Hubo un problema al actualizar.");
    } finally {
      // Siempre limpiar eliminarFoto para evitar estados confusos
      setEliminarFoto(false);
    }
  };
  const manejarCambioPassword = async () => {
    if (!passwordactual || !passwordnuevo) {
      setModalMensaje({
        visible: true,
        mensaje: "Debes llenar todos los campos.",
      });
      return;
    }
    if (passwordactual === passwordnuevo) {
      setModalMensaje({
        visible: true,
        mensaje: "La nueva contraseña no puede ser igual a la actual.",
      });
      return;
    }
    try {
      await cambiarPassword({ passwordactual, passwordnuevo });
      setModalVisible(true);
      Alert.alert("Éxito", "Contraseña actualizada.");
      setPasswordactual("");
      setPasswordnuevo("");
      useAuthStore.getState().logout();
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar la contraseña.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }
  if (!perfil) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.contenedor}>
        <TouchableOpacity
          onPress={editando ? seleccionarImagen : undefined}
          style={styles.avatarContenedor}
          activeOpacity={editando ? 0.7 : 1}
        >
          <Image
            source={{ uri: imagen || "https://www.gravatar.com/avatar/?d=mp" }}
            style={styles.avatar}
          />
          {editando && (
            <View style={styles.iconoLapizContenedor}>
              <Ionicons name="pencil" size={24} color="#FFD700" />
            </View>
          )}
        </TouchableOpacity>

        {editando && (
          <View style={styles.eliminarFotoContainer}>
            <Text style={styles.eliminarFotoTexto}>Eliminar foto</Text>
            <Switch
              value={eliminarFoto}
              onValueChange={setEliminarFoto}
              trackColor={{ false: "#888", true: "#FFD700" }}
              thumbColor={eliminarFoto ? "#fff" : "#fff"}
            />
          </View>
        )}

        {perfil &&
          [
            "nombre",
            "email",
            "telefono",
            "direccion",
            "provincia",
            "ciudad",
          ].map((campo) => (
            <View key={campo} style={styles.infoFila}>
              <Feather
                name={
                  campo === "email"
                    ? "mail"
                    : campo === "telefono"
                    ? "phone"
                    : campo === "direccion"
                    ? "map-pin"
                    : campo === "provincia"
                    ? "map"
                    : campo === "ciudad"
                    ? "home"
                    : "user"
                }
                size={30}
                color="#FFD700"
              />
              <TextInput
                style={styles.infoTextoEditable}
                value={perfil[campo as keyof Perfil] || ""}
                editable={editando}
                onChangeText={(text) => setPerfil({ ...perfil, [campo]: text })}
                placeholder={`Ingrese ${campo}`}
                placeholderTextColor="#aaa"
              />
              {editando && (
                <Ionicons
                  name="pencil"
                  size={20}
                  color="#FFD700"
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>
          ))}

        {editando ? (
          <TouchableOpacity onPress={guardarCambios} style={styles.botonEditar}>
            <Text style={styles.textoBoton}>Actualizar Cambios</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setEditando(true)}
            style={styles.botonEditar}
          >
            <Text style={styles.textoBoton}>Editar Perfil</Text>
          </TouchableOpacity>
        )}

        <View style={{ marginTop: 40, width: "100%" }}>
          <Text
            style={{
              color: "#FFD700",
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 10,
            }}
          >
            Cambiar Contraseña
          </Text>
          <TextInput
            placeholder="Contraseña Actual"
            value={passwordactual}
            onChangeText={setPasswordactual}
            secureTextEntry
            placeholderTextColor="#888"
            style={styles.inputPassword}
          />
          <TextInput
            placeholder="Nueva Contraseña"
            value={passwordnuevo}
            onChangeText={setPasswordnuevo}
            secureTextEntry
            placeholderTextColor="#888"
            style={styles.inputPassword}
          />
          <TouchableOpacity
            onPress={manejarCambioPassword}
            style={styles.botonCerrarSesion}
          >
            <Text style={[styles.textoBoton, { color: "#FFD700" }]}>
              Actualizar Contraseña
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {modalVisible && (
        <CambioPasswordExitoso
          onClose={() => {
            setModalVisible(false);
            router.replace("/login"); // redirige al login
          }}
        />
      )}
      {/* Modal de error o validaciones (si decides usar otro) */}
      {modalMensaje.visible && (
        <ModalMensaje
          visible={modalMensaje.visible}
          mensaje={modalMensaje.mensaje}
          onClose={() => setModalMensaje({ visible: false, mensaje: "" })}
        />
      )}
    </View>
  );
};

export default PerfilCliente;

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: "#000",
    alignItems: "center",
    padding: 30,
    paddingBottom: 40,
  },
  avatarContenedor: {
    marginVertical: 20,
    borderRadius: 80,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFD700",
  },
  avatar: {
    width: 150,
    height: 150,
  },
  infoFila: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    paddingHorizontal: 20,
  },
  infoTextoEditable: {
    color: "#fff",
    fontSize: 20,
    marginLeft: 15,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD700",
    paddingVertical: 4,
  },
  botonEditar: {
    marginTop: 40,
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  botonCerrarSesion: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  textoBoton: {
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    color: "#000",
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: "#FFD700",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
    marginBottom: 15,
  },
  eliminarBtn: {
    marginTop: 10,
    backgroundColor: "#8B0000", // rojo oscuro para indicar acción destructiva
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FFD700", // mantiene el color dorado como borde
  },

  eliminarBtnText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
  },
  iconoLapizContenedor: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "#000000aa",
    borderRadius: 16,
    padding: 4,
  },

  eliminarFotoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  eliminarFotoTexto: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 16,
  },
});
