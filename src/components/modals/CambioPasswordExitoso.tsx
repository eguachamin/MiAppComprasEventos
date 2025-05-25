import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

interface Props {
  onClose?: () => void;
}

export default function CambioPasswordExitoso({ onClose }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>¡Contraseña actualizada!</Text>
        <Text style={styles.text}>
          Tu contraseña se cambió correctamente. Por favor, inicia sesión de nuevo.
        </Text>
        <TouchableOpacity
          onPress={() => {
            if(onClose) onClose();
            router.replace('/login');
          }}
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
    position: 'absolute', // ✅ Añade esto
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.95)',
  justifyContent: 'center',
  alignItems: 'center',
  padding: 16,
  zIndex: 9999, // ✅ asegura que esté al frente
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
