import React from 'react';
import { View, Text, TouchableOpacity , Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../utils/validators';
import { login } from '../services/auth';
import { TextInput, Button } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'expo-router';
import { resendVerification } from '../services/auth';

export default function LoginScreen() {
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const setToken = useAuthStore((state) => state.setToken) ;
  const setUser = useAuthStore((state) => state.setUser);

  const onSubmit = async (data: any) => {
  try {
    const result = await login(data.email, data.password);
    setToken(result.token);
    setUser(result.user);
    router.replace('/(tabs)');
  } catch (error: any) {
    const errorMsg = error.message;

    if (errorMsg === 'Usuario no verificado' || errorMsg === 'Token expirado') {
      const motivo = errorMsg === 'Token expirado'
        ? 'Tu token de verificación ha expirado.'
        : 'Tu cuenta aún no está verificada.';
      // Mostrar alerta con opción para reenviar el correo
      Alert.alert(
        'Cuenta no verificada',
        `${motivo} Tu cuenta aún no está verificada. ¿Deseas que te reenviemos el correo de verificación?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Reenviar',
            onPress: async () => {
              try {
                await resendVerification(data.email);
                Alert.alert('Correo enviado', 'Revisa tu bandeja de entrada.');
              } catch (err: any) {
                Alert.alert('Error', err.message);
              }
            }
          }
        ]
      );
    } else {
      Alert.alert('Error de inicio de sesión', errorMsg || 'Verifica tu correo o contraseña.');
    }
  }
};
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Iniciar Sesión</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email"
            value={value}
            onChangeText={onChange}
            style={{ marginBottom: 10 }}
          />
        )}
      />
      {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Contraseña"
            secureTextEntry
            value={value}
            onChangeText={onChange}
            style={{ marginBottom: 10 }}
          />
        )}
      />
      {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}

      <Button mode="contained" onPress={handleSubmit(onSubmit)}>
        Entrar
      </Button>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={{ color: 'blue', marginTop: 15 }}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}
