import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function RegistroExitoso() {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>¡Registro exitoso!</Text>

        <Text style={styles.text}>
          Revisa tu correo electrónico y confirma tu cuenta antes de iniciar sesión.
        </Text>
        
        <TouchableOpacity
          onPress={() => router.replace('/login')}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>Ir al Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modal: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 12,
    textAlign: 'justify',
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

