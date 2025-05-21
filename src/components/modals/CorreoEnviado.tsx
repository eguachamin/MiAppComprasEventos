import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type CorreoEnviadoModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function CorreoEnviado_Modal({ visible, onClose }: CorreoEnviadoModalProps) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalFondo}>
        <View style={styles.modalContenido}>
          <Text style={styles.titulo}>Correo enviado</Text>
          <Text style={styles.texto}>
            El correo de verificación fue enviado con éxito. Por favor revisa tu bandeja de entrada.
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.boton}>
            <Text style={styles.textoBoton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalFondo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContenido: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  texto: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  boton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  },
});

