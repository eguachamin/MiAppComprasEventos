// src/screens/LoginScreen.tsx
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const route =useRouter();
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/logo_edwinAsquiDj.jpg')} // Asegúrate de colocar tu logo en assets
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Iniciar Sesión</Text>

      <TextInput
        label="Correo electrónico"
        mode="outlined"
        style={styles.input}
        textColor="white"
        outlineColor="gray"
        theme={{ colors: { primary: '#FFD700' } }}
      />

      <TextInput
        label="Contraseña"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        textColor="white"
        outlineColor="gray"
        theme={{ colors: { primary: '#FFD700' } }}
      />

      <Button
        mode="contained"
        onPress={() => {}}
        style={styles.button}
        labelStyle={{ color: '#000' }}
      >
        Entrar
      </Button>

      <TouchableOpacity onPress={() => route.push('/register')}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? <Text style={styles.highlight}>Regístrate</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fondo negro
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
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#1a1a1a',
  },
  button: {
    backgroundColor: '#FFD700',
    marginVertical: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
  registerText: {
    color: '#fff',
    textAlign: 'center',
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
