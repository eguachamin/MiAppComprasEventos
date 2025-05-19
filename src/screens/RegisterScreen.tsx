import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { registerUser } from '../services/userService'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { registroSchema } from '../utils/validators'; 
import { router } from "expo-router";
import Email_Existente_Modal from "../components/modals/Email-ya-registrado";
import axios from 'axios';


const provincias = [
  'Azuay', 'Bolívar', 'Cñar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',
  'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos',
  'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',
  'Santa Elena', 'Santo Domingo', 'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe',
];



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
  const [showEmail_Existente_Modal, setShowEmail_Existente_Modal] = useState(false);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ValoresFormulario>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      provincia: '',
      ciudad: '',
      password: '',
      confirmarPassword: '',
    },
  });

  const [abierto, setAbierto] = useState(false);
  const [items, setItems] = useState(
    provincias.map((prov) => ({ label: prov, value: prov }))
  );

  const valorProvincia = watch('provincia');

  const enviarFormulario = async(data: ValoresFormulario) => {
    if (data.password !== data.confirmarPassword) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }

  try {
    const respuesta = await registerUser(data);
    console.log('Registro exitoso:', respuesta);
    router.replace('/registroExitoso');
    } 
  catch (error: any) 
  {
    console.log('Error capturado en enviarFormulario:', error);

    if (
      error?.response?.data?.msg ===
      'Lo sentimos, el email ya se encuentra registrado'
    ) {
      setShowEmail_Existente_Modal(true); // ← activa el modal
    } else {
      // Puedes mostrar otros errores o loguearlos
      console.error('Error desconocido en registro:', error);
    }
  }
  };

  return (
    <>
    <ScrollView contentContainerStyle={estilos.contenidoScroll} style={estilos.contenedor}>
      <Text style={estilos.titulo}>Registro</Text>

      {[
        { name: 'nombre', placeholder: 'Nombre y Apellido' },
        { name: 'email', placeholder: 'Correo Electrónico', keyboardType: 'email-address' as const},
        { name: 'telefono', placeholder: 'Teléfono', keyboardType: 'phone-pad' as const,isNumeric: true,},
        { name: 'direccion', placeholder: 'Dirección' },
        { name: 'password', placeholder: 'Contraseña', secureTextEntry: true },
        { name: 'confirmarPassword', placeholder: 'Confirmar Contraseña', secureTextEntry: true },
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
                const processed = isNumeric ? text.replace(/[^0-9]/g, '') : text;
                onChange(processed);
                }}
                value={value}
                placeholderTextColor="#aaa"
                {...propsInput}
              />
              {errors[name as keyof typeof errors] && (
                <Text style={estilos.error}>{errors[name as keyof typeof errors]?.message}</Text>
              )}
            </>
          )}
        />
      ))}


      <Text style={estilos.etiqueta}>Provincia</Text>
      <Controller
        control={control}
        name="provincia"
        render={({ field: { onChange } }) => (
          <View style={estilos.contenedorDropdown}>
            <DropDownPicker
              open={abierto}
              value={valorProvincia}
              items={items}
              setOpen={setAbierto}
              setValue={(callback) => {
                const result = callback(valorProvincia);
                setValue('provincia', result);
                onChange(result);
              }}
              setItems={setItems}
              placeholder="Selecciona una provincia"
              style={estilos.dropdown}
              dropDownContainerStyle={estilos.contenedorDropDown}
              textStyle={{ color: 'white' }}
              placeholderStyle={{ color: '#aaa' }}
              listItemLabelStyle={{ color: 'white' }}
              ArrowDownIconComponent={() => (
                <Feather name="chevron-down" size={20} color="#FFD700" />
              )}
              ArrowUpIconComponent={() => (
                <Feather name="chevron-up" size={20} color="#FFD700" />
              )}
              zIndex={1000}
            />
            {errors.provincia && (
              <Text style={estilos.error}>{errors.provincia.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="ciudad"
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={estilos.input}
              onChangeText={onChange}
              value={value}
              placeholder="Ciudad"
              placeholderTextColor="#aaa"
            />
            {errors.ciudad && (
              <Text style={estilos.error}>{errors.ciudad.message}</Text>
            )}
          </>
        )}
      />

      <TouchableOpacity style={estilos.boton} onPress={handleSubmit(enviarFormulario)}>
        <Text style={estilos.textoBoton}>Registrarse</Text>
      </TouchableOpacity>
        
    </ScrollView>
    {showEmail_Existente_Modal && (
      <Email_Existente_Modal onClose={() => setShowEmail_Existente_Modal(false)} />
    )}
  </>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000',
  },
  contenidoScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 20,
  },
  etiqueta: {
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
    fontSize: 14,
    zIndex: 1001,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  contenedorDropdown: {
    zIndex: 1000,
  },
  dropdown: {
    backgroundColor: '#1a1a1a',
    borderColor: '#444',
  },
  contenedorDropDown: {
    backgroundColor: '#222',
    borderColor: '#444',
  },
  boton: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBoton: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  error: {
    color: '#FF4D4D',
    fontSize: 12,
    marginBottom: 8,
    marginLeft: 4,
  },
  errorTexto: {
  color: 'red',
  fontSize: 13,
  marginBottom: 8,
  marginLeft: 5,
},

});
