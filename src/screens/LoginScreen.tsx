//Pantalla de Login
//Evelyn Guachamin
// Importaciones de librerías y componentes necesarios
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
// Funciones del servicio de usuario
import { loginUser, reenviarCorreoVerificacion } from '../services/userService';
// Store global para manejo de autenticación
import { useAuthStore } from '../store/authStore';
// Modales personalizados para diferentes situaciones
import CorreoEnviado_Modal from '../components/modals/CorreoEnviado'; // crea este modal similar
import CorreoNoVerificado_Modal from '../components/modals/CorreoNoVerificado_Modal';
import RecuperarPasswordModal from '../components/modals/RecuperarPasswordModal';

// Tipado del formulario
type FormData = {
  email: string;
  password: string;
};

export default function LoginScreen() {
   // Hook para manejar el formulario con React Hook Form
  const { control, handleSubmit } = useForm<FormData>();
  const login = useAuthStore((state) => state.login);
  const router = useRouter();

  // Estados locales para controlar la UI
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [correoPendiente, setCorreoPendiente] = useState('');
  const [reenviando, setReenviando] = useState(false);
  const [showCorreoEnviado, setShowCorreoEnviado] = useState(false);
  const [mostrarModalRecuperar, setMostrarModalRecuperar] = useState(false);
  
  // Función que se ejecuta al enviar el formulario
  const onSubmit = async (data: FormData) => {
    try {
      // Intenta iniciar sesión con los datos del formulario
      const res = await loginUser(data);

      //Se usó para verificar el flujo de login durante pruebas manuales.
      //console.log('Respuesta login:', res);

      // Extrae el token y datos del usuario desde la respuesta
      const { token, _id, ...userData } = res;

      // Guarda el usuario en el estado global
      await login(token, { id: _id, ...userData });

      // Redirige a la pantalla principal
      router.replace('/home');

    } catch (error: any) {
      // Manejo de errores del login
      const msg = error?.response?.data?.msg || 'Error al iniciar sesión';

      //Permitio identificar errores durante el desarrollo de la aplicación
      //console.log('Error en el login:', error);

       // Si el error es por correo no verificado, muestra el modal correspondiente
      if (msg.toLowerCase().includes('verificar')) {
        setCorreoPendiente(data.email);
        setIsModalVisible(true);
      } else {
        setErrorMsg(msg);
      }
    }
  };
  // Función para reenviar correo de verificación
  const handleReenviarCorreo = async () => {
    try {
      setReenviando(true);
      await reenviarCorreoVerificacion({ email: correoPendiente });

      //Se utilizó para confirmar el envío exitoso del correo en las pruebas
        //console.log('Correo de verificación reenviado con éxito');

      // Mostrar modal de confirmación y cerrar modal anterior
      setShowCorreoEnviado(true);
      setIsModalVisible(false);
    } catch (error) {
      alert('No se pudo reenviar el correo');
    } finally {
      setReenviando(false);
    }
  };
  
  return (
    <View style={styles.container}>
    {/* Logo de la app */}
      <Image
        source={require('../assets/images/logo_edwinAsquiDj.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Iniciar Sesión</Text>
      {/* Campo de correo electrónico */}
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
      {/* Campo de contraseña */}
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
      {/* Mensaje de error en caso de fallo */}
      {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

      {/* Botón para iniciar sesión */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      
      {/* Enlace para recuperar contraseña */}
      <TouchableOpacity onPress={() => setMostrarModalRecuperar(true)}>
        <Text style={styles.registerText}>
          ¿Olvidaste tu contraseña? <Text style={styles.highlight}>Da clic aquí</Text>
        </Text>
      </TouchableOpacity>

      {/* Enlace para registrarse */}
      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? <Text style={styles.highlight}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
      
      {/* Modales personalizados */}
      <CorreoNoVerificado_Modal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onReenviar={handleReenviarCorreo}
      />
        <CorreoEnviado_Modal
          visible={showCorreoEnviado}
          onClose={() => setShowCorreoEnviado(false)}
        />
      <RecuperarPasswordModal
        visible={mostrarModalRecuperar}
        onClose={() => setMostrarModalRecuperar(false)}
      />
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
  // Inputs y etiquetas
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
  // Botón principal
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
  // Textos de enlaces
  registerText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 15,
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  // Mensajes de error
  error: {
    color: '#FF4D4D',
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  }
});
