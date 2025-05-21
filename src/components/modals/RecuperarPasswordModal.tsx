import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { recuperarPassword } from '../../services/userService';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const RecuperarPasswordModal: React.FC<Props> = ({ visible, onClose }) => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async () => {
    if (!email) return;

    setLoading(true);
    try {
      const res = await recuperarPassword(email);
      setMensaje(
        'Se ha enviado información a tu correo para restablecer la contraseña. Por favor, revisa tu correo y vuelve a iniciar sesión.'
      );
    } catch (error: any) {
      const msg = error?.response?.data?.msg || 'Error al enviar el correo';
      setMensaje(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCerrar = () => {
    setEmail('');
    setMensaje('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {mensaje ? (
            <>
              <Text style={styles.modalText}>{mensaje}</Text>
              <TouchableOpacity style={styles.buttonClose} onPress={handleCerrar}>
                <Text style={styles.buttonCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>Recuperar contraseña</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Ingresa tu correo"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {loading ? (
                <ActivityIndicator size="small" color="#FFD700" />
              ) : (
                <TouchableOpacity style={styles.buttonPrimary} onPress={handleRecuperar}>
                  <Text style={styles.buttonPrimaryText}>Enviar</Text>
                </TouchableOpacity>
              )}
              {/* Botón Cancelar añadido aquí también */}
              <TouchableOpacity style={styles.buttonClose} onPress={handleCerrar}>
                <Text style={styles.buttonCloseText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default RecuperarPasswordModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#000',
    padding: 20,
    borderRadius: 12,
    width: '90%',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#FFD700',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    color: '#000',
  },
  modalText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'justify',
  },
  buttonPrimary: {
    backgroundColor: '#FFD700',
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  buttonPrimaryText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonClose: {
    marginTop: 15,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
  },
  buttonCloseText: {
    color: '#fff',
    textAlign: 'center',
  },
});
