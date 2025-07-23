import React from 'react';
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const ModalEntregaPersonal: React.FC<Props> = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>¡Compra registrada!</Text>
          <Text style={styles.text}>
          Como estás en <Text style={styles.bold}>Quito</Text> y has elegido pagar en efectivo, coordinaremos la entrega personalmente.
          Por favor, comunícate con nosotros por <Text style={styles.bold}>WhatsApp</Text> haciendo clic en el siguiente enlace:
          </Text>

          {/* Botón de WhatsApp */}
          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.link/d609q8')}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>Coordinar vía WhatsApp</Text>
          </TouchableOpacity>

          {/* Botón para cerrar */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalEntregaPersonal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
  linkButton: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  linkText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
  },
});
