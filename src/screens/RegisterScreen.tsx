//Pantalla de Login
//Evelyn Guachamin

// Importaciones necesarias de librerías y componentes
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { provinciasConCiudades } from "../utils/provinciasCiudades";
import { registroSchema } from "../utils/validators";
// Servicios del backend para registrar usuarios
import { registerUser } from "../services/userService";
// Modales personalizados
import Email_Existente_Modal from "../components/modals/Email-ya-registrado";

// Listado de Provincias utilizado para el Picker
const provincias = [
  "Azuay",
  "Bolívar",
  "Cañar",
  "Carchi",
  "Chimborazo",
  "Cotopaxi",
  "El_Oro",
  "Esmeraldas",
  "Galápagos",
  "Guayas",
  "Imbabura",
  "Loja",
  "Los_Ríos",
  "Manabí",
  "Morona_Santiago",
  "Napo",
  "Orellana",
  "Pastaza",
  "Pichincha",
  "Santa_Elena",
  "Santo_Domingo",
  "Sucumbíos",
  "Tungurahua",
  "Zamora Chinchipe",
];

// Tipado del formulario
type ValoresFormulario = {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  provincia: string;
  ciudad: string;
  password: string;
  confirmarPassword: string;
};

export default function PantallaRegistro() {
  const [showEmail_Existente_Modal, setShowEmail_Existente_Modal] =
    useState(false);
  // Hook useForm inicializa los campos del formulario con valores vacíos y aplica validación con Zod
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ValoresFormulario>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      direccion: "",
      provincia: "",
      ciudad: "",
      password: "",
      confirmarPassword: "",
    },
  });

  const [ciudadOpen, setCiudadOpen] = useState(false);
  const [ciudadItems, setCiudadItems] = useState<
    { label: string; value: string }[]
  >([]);

  const [provinciaOpen, setProvinciaOpen] = useState(false);
  const valorProvincia = watch("provincia");
  
  useEffect(() => {
    if (provinciaOpen) {
      setCiudadOpen(false);
    }
  }, [provinciaOpen]);

  useEffect(() => {
    if (ciudadOpen) {
      setProvinciaOpen(false);
    }
  }, [ciudadOpen]);
  // useEffect actualiza dinámicamente el listado de ciudades al seleccionar una provincia
  useEffect(() => {
    if (valorProvincia) {
      const ciudades = provinciasConCiudades[valorProvincia] || [];
      setCiudadItems(ciudades.map((c) => ({ label: c, value: c })));
      setValue("ciudad", ""); // Limpia ciudad anterior si cambia provincia

      // console.log utilizado únicamente en para pruebas en desarrollo
      //console.log(provinciasConCiudades[valorProvincia]);
    }
  }, [valorProvincia]);
  //Funcion para enviar la información al backend
  const enviarFormulario = async (data: ValoresFormulario) => {
    //Antes de enviar se realiza las validaciones de los campos del formulario
    if (data.password !== data.confirmarPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    try {
      //Envio de la informacion
      const respuesta = await registerUser(data);
      console.log("Registro exitoso:", respuesta);

      // ↓↓↓ Logs solo para pruebas funcionales ↓↓↓
      // console.log("✓ Usuario registrado correctamente");
      // console.log("Datos enviados:", data);
      // console.log("Respuesta del servidor:", respuesta.status);
      // Parte de las pruebas de funcionalidad
      //if (respuesta?.data?.msg?.includes("confirmar")) {
      //console.log("📩 Notificación enviada al administrador sobre la nueva compra");
      //}

      //Cambio de pantalla registro exitoso
      router.replace("/registroExitoso");
    } catch (error: any) {
      console.log("Error capturado en enviarFormulario:", error);
      //Pruebas de Funcionalidad
      //console.log("✗ Error al registrar usuario:", error.message);

      if (
        error?.response?.data?.msg ===
        "Lo sentimos, el email ya se encuentra registrado"
      ) {
        setShowEmail_Existente_Modal(true); // ← activa el modal
      } else {
        // Mostrar otros errores o loguearlos
        console.error("Error desconocido en registro:", error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={estilos.contenedor}
    >
      <ScrollView
        contentContainerStyle={estilos.contenidoScroll}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        <Text style={estilos.titulo}>Registro</Text>

        {/* Tus inputs mapeados */}
        {[
          { name: "nombre", placeholder: "Nombre y Apellido" },
          {
            name: "email",
            placeholder: "Correo Electrónico",
            keyboardType: "email-address" as const,
          },
          {
            name: "telefono",
            placeholder: "Teléfono",
            keyboardType: "phone-pad" as const,
            isNumeric: true,
          },
          { name: "direccion", placeholder: "Dirección" },
          {
            name: "password",
            placeholder: "Contraseña",
            secureTextEntry: true,
          },
          {
            name: "confirmarPassword",
            placeholder: "Confirmar Contraseña",
            secureTextEntry: true,
          },
        ].map(({ name, isNumeric, ...propsInput }) => (
          <Controller
            key={name}
            control={control}
            name={name as keyof ValoresFormulario}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={estilos.input}
                  onChangeText={(text) => {
                    const processed = isNumeric
                      ? text.replace(/[^0-9]/g, "")
                      : text;
                    onChange(processed);
                  }}
                  value={value}
                  placeholderTextColor="#aaa"
                  {...propsInput}
                />
                {errors[name as keyof typeof errors] && (
                  <Text style={estilos.error}>
                    {errors[name as keyof typeof errors]?.message}
                  </Text>
                )}
              </>
            )}
          />
        ))}

        {/* Selector de Provincia con Picker */}
        <Controller
          control={control}
          name="provincia"
          render={({ field: { onChange, value } }) => (
            <>
                <View style={[estilos.pickerContainer, { marginBottom: 12 }]}>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => {
                    onChange(itemValue);
                  }}
                  style={{ color: "white",height: 50 }}
                  dropdownIconColor="#FFD700"
                  
                >
                  <Picker.Item label="Selecciona una provincia" value="" />
                  {provincias.map((p) => (
                    <Picker.Item
                      key={p}
                      label={p.replace("_", " ")}
                      value={p}
                    />
                  ))}
                </Picker>
              </View>
              {errors.provincia && (
                <Text style={estilos.error}>{errors.provincia.message}</Text>
              )}
            </>
          )}
        />

        {/* Selector de Ciudad con Picker */}
        <Controller
          control={control}
          name="ciudad"
          render={({ field: { onChange, value } }) => (
            <>
                <View style={[estilos.pickerContainer, { marginBottom: 12 }]}>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => {
                    onChange(itemValue);
                  }}
                  enabled={!!valorProvincia}
                  style={{ color: "white",  height: 50 }}
                  dropdownIconColor="#FFD700"
                >
                  {!valorProvincia ? (
                    <Picker.Item
                      label="Primero selecciona una provincia"
                      value=""
                      color="#999"
                    />
                  ) : (
                    ciudadItems.map((item) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))
                  )}
                </Picker>
              </View>
              {errors.ciudad && (
                <Text style={estilos.error}>{errors.ciudad.message}</Text>
              )}
            </>
          )}
        />
        {/* Botón de Registro */}
        <TouchableOpacity
          style={estilos.boton}
          onPress={handleSubmit(enviarFormulario)}
        >
          <Text style={estilos.textoBoton}>Registrarse</Text>
        </TouchableOpacity>
      </ScrollView>
        {/*Muestra Modal Personalizado */}
      {showEmail_Existente_Modal && (
        <Email_Existente_Modal
          onClose={() => setShowEmail_Existente_Modal(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#000",
  },
  contenidoScroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginBottom: 20,
  },
  etiqueta: {
    color: "#fff",
    marginTop: 15,
    marginBottom: 5,
    fontSize: 14,
    zIndex: 1001,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  contenedorDropdown: {
    zIndex: 1000,
    position: "relative",
  },
  dropdown: {
    backgroundColor: "#1a1a1a",
    borderColor: "#444",
  },
  contenedorDropDown: {
    backgroundColor: "#222",
    borderColor: "#444",
  },
  boton: {
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBoton: {
    textAlign: "center",
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  error: {
    color: "#FF4D4D",
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorTexto: {
    color: "red",
    fontSize: 13,
    marginBottom: 8,
    marginLeft: 5,
  },
  pickerContainer: {
    backgroundColor: "#000",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    overflow: "hidden",
    marginBottom: 12,
  },
  pickerItem: {
    color: "white",
    fontSize: 16,
  },
  
});
