import React from 'react';
import { Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface Props {
  visible: boolean;
  onClose: () => void;
}

const CompraExitosaModal: React.FC<Props> = ({ visible, onClose }) => {
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>¡Gracias por tu compra!</Text>
          <Text style={styles.text}>
            Si realizaste el pago por transferencia y el envío es a provincia,
            con gusto en el apartado <Text style={styles.bold}>Mis pedidos</Text> se subirá la guía
            para que estés pendiente de la entrega. Esta puede demorar hasta 48 horas.
          </Text>
          <Text style={styles.text}>
            Si realizaste la compra un viernes, la entrega se realizará en días laborales.
            Revisa el apartado <Text style={styles.bold}>Mis pedidos</Text> para ver notificaciones de actualización.
          </Text>
          <Text style={styles.text}>
            Si estás en <Text style={styles.bold}>Quito</Text> y el pago fue en efectivo, por favor da clic en el siguiente enlace para coordinar personalmente la entrega:
          </Text>

          <TouchableOpacity
            onPress={() => Linking.openURL('https://wa.link/d609q8')}
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>Coordinar vía WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
    
  );
};

export default CompraExitosaModal;

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
