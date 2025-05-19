import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { loginUser } from '../services/userService';
import { useAuthStore } from '../store/authStore';

type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { control, handleSubmit } = useForm<FormData>();
  const login = useAuthStore((state) => state.login);
  const router = useRouter();
  const [errorMsg, setErrorMsg] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await loginUser(data);
      await login(res.token, res.usuario);
      router.replace('/home');
    } catch (error: any) {
      const msg = error?.response?.data?.msg || 'Error al iniciar sesión';
      setErrorMsg(msg);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo_edwinAsquiDj.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Iniciar Sesión</Text>

      <Text style={styles.label}>Correo electrónico</Text>
      <Controller
        control={control}
        name="email"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="ejemplo@correo.com"
            value={value}
            onChangeText={onChange}
            style={styles.input}
            placeholderTextColor="#888"
            textColor="#fff"
          />
        )}
      />

      <Text style={styles.label}>Contraseña</Text>
      <Controller
        control={control}
        name="password"
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="••••••••"
            secureTextEntry={!showPassword}
            value={value}
            onChangeText={onChange}
            style={styles.input}
            placeholderTextColor="#888"
            textColor="#fff"
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
                color="#fff"
          />
          }
          />
        )}
      />

      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? <Text style={styles.highlight}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#FFD700',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  label: {
    color: '#fff',
    marginBottom: 5,
    marginLeft: 4,
    fontSize: 16,
  },
  input: {
    marginBottom: 20,
    backgroundColor: '#1a1a1a',
  },
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  error: {
    color: '#FF4D4D',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  },
});
