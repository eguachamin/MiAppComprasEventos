// components/modals/ModalMensaje.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ModalMensaje({ visible, mensaje, onClose }: {
  visible: boolean;
  mensaje: string;
  onClose: () => void;
}) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.mensaje}>{mensaje}</Text>
        <TouchableOpacity onPress={onClose} style={styles.boton}>
          <Text style={styles.textoBoton}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modal: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  mensaje: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
  },
  textoBoton: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
