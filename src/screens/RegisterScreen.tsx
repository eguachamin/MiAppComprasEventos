import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import { register } from '../services/auth';

// Define los campos válidos del formulario
type FormValues = {
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  address: string;
  province: string;
  city: string;
  password: string;
  confirmPassword: string;
};

const provincias = [
  'Azuay', 'Bolívar', 'Cañar', 'Carchi', 'Chimborazo', 'Cotopaxi', 'El Oro',
  'Esmeraldas', 'Galápagos', 'Guayas', 'Imbabura', 'Loja', 'Los Ríos',
  'Manabí', 'Morona Santiago', 'Napo', 'Orellana', 'Pastaza', 'Pichincha',
  'Santa Elena', 'Santo Domingo', 'Sucumbíos', 'Tungurahua', 'Zamora Chinchipe',
];

const schema = yup.object().shape({
  name: yup.string().required('El nombre es obligatorio'),
  email: yup.string().email('Correo inválido').required('Correo requerido'),
  phone: yup.string().matches(/^[0-9]{10}$/, 'Número inválido').required('Teléfono requerido'),
  birthdate: yup.string().required('Fecha de nacimiento requerida'),
  address: yup.string().required('Dirección requerida'),
  province: yup.string().required('Provincia requerida'),
  city: yup.string().required('Ciudad requerida'),
  password: yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmar contraseña'),
});

export default function RegisterScreen() {
  const router = useRouter();
  const [selectedProvince, setSelectedProvince] = useState('');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await register(
        data.name,
        data.email,
        data.password,
        data.phone,
        data.birthdate,
        data.address,
        data.province,
        data.city
      );
      Alert.alert(
      '¡Cuenta creada!',
      'Te enviamos un correo de verificación. Por favor, revisa tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.',
        [{ text: 'Iniciar sesión', onPress: () => router.replace('/login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      {/* Campos básicos */}
      {([
        { name: 'name', placeholder: 'Nombre y Apellido' },
        { name: 'email', placeholder: 'Correo', keyboardType: 'email-address' },
        { name: 'phone', placeholder: 'Teléfono', keyboardType: 'phone-pad' },
        { name: 'birthdate', placeholder: 'Fecha de nacimiento (dd/mm/aaaa)' },
        { name: 'address', placeholder: 'Dirección' },
        { name: 'password', placeholder: 'Contraseña', secureTextEntry: true },
        { name: 'confirmPassword', placeholder: 'Confirmar Contraseña', secureTextEntry: true },
      ] as const).map(({ name, ...inputProps }) => (
        <React.Fragment key={name}>
          <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                value={value ?? ''}
                {...inputProps}
              />
            )}
          />
          {errors[name] && <Text style={styles.error}>{errors[name]?.message}</Text>}
        </React.Fragment>
      ))}

      {/* Picker de Provincia */}
      <Text style={styles.label}>Provincia</Text>
      <Controller
        control={control}
        name="province"
        render={({ field: { onChange, value } }) => (
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => {
              setSelectedProvince(itemValue);
              onChange(itemValue);
            }}
            style={styles.input}
          >
            <Picker.Item label="Seleccione una provincia" value="" />
            {provincias.map((prov) => (
              <Picker.Item key={prov} label={prov} value={prov} />
            ))}
          </Picker>
        )}
      />
      {errors.province && <Text style={styles.error}>{errors.province.message}</Text>}

      {/* Ciudad */}
      <Controller
        control={control}
        name="city"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Ciudad"
            style={styles.input}
            onChangeText={onChange}
            value={value ?? ''}
          />
        )}
      />
      {errors.city && <Text style={styles.error}>{errors.city.message}</Text>}

      {/* Botón de registro */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 5,
  },
  error: { color: 'red', marginBottom: 10 },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
