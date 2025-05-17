import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Feather } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { registerUser } from '../services/userService'; 

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
  const { control, handleSubmit, setValue, watch } = useForm<ValoresFormulario>({
    defaultValues: {
      provincia: '',
    },
  });

  const [abierto, setAbierto] = useState(false);
  const [items, setItems] = useState(
    provincias.map((prov) => ({ label: prov, value: prov }))
  );

  const valorProvincia = watch('provincia');

  const enviarFormulario = async(datos: ValoresFormulario) => {
    if (datos.password !== datos.confirmarPassword) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }

  try {
    const { confirmarPassword, ...payload } = datos;
    const respuesta = await registerUser(payload);
    Alert.alert('Registro exitoso', 'Ya puedes iniciar sesión');
    console.log(respuesta);
  } catch (error: any) {
    Alert.alert('Error', error.message || 'No se pudo completar el registro');
  }
  };

  return (
    <ScrollView contentContainerStyle={estilos.contenidoScroll} style={estilos.contenedor}>
      <Text style={estilos.titulo}>Registro</Text>

      {[
        { name: 'nombre', placeholder: 'Nombre y Apellido' },
        { name: 'email', placeholder: 'Correo Electrónico', keyboardType: 'email-address' as const},
        { name: 'telefono', placeholder: 'Teléfono', keyboardType: 'phone-pad' as const},
        { name: 'direccion', placeholder: 'Dirección' },
        { name: 'password', placeholder: 'Contraseña', secureTextEntry: true },
        { name: 'confirmarPassword', placeholder: 'Confirmar Contraseña', secureTextEntry: true },
      ].map(({ name, ...propsInput }) => (
        <Controller
          key={name}
          control={control}
          name={name as keyof ValoresFormulario}
          render={({ field: { onChange, value } }) => (
            <TextInput
              style={estilos.input}
              onChangeText={onChange}
              value={value}
              placeholderTextColor="#aaa"
              {...propsInput}
            />
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
          </View>
        )}
      />

      <Controller
        control={control}
        name="ciudad"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={estilos.input}
            onChangeText={onChange}
            value={value}
            placeholder="Ciudad"
            placeholderTextColor="#aaa"
          />
        )}
      />

      <TouchableOpacity style={estilos.boton} onPress={handleSubmit(enviarFormulario)}>
        <Text style={estilos.textoBoton}>Registrarse</Text>
      </TouchableOpacity>
    </ScrollView>
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
});
