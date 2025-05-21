// components/modals/CorreoNoVerificado_Modal.tsx
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CorreoNoVerificado_Modal({
  visible,
  onClose,
  onReenviar,
}: {
  visible: boolean;
  onClose: () => void;
  onReenviar: () => void;
}) 
{
  if (!visible) return null; // No mostrar modal si visible es falso
    console.log('Modal renderizado, visible:', visible);
  return (
    
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.modalFondo}>
        <View style={styles.modalContenido}>
          <Text style={styles.titulo}>Correo no verificado</Text>
          <Text style={styles.texto}>
            Tu cuenta aún no ha sido verificada. ¿Deseas reenviar el correo de verificación?
          </Text>

          <TouchableOpacity onPress={onReenviar} style={styles.boton}>
            <Text style={styles.textoBoton}>Reenviar Correo</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={[styles.boton, { backgroundColor: '#ccc', marginTop: 10 }]}>
            <Text style={[styles.textoBoton, { color: '#333' }]}>Cancelar</Text>
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
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  texto: {
    fontSize: 16,
    marginBottom: 20,
  },
  boton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    fontWeight: 'bold',
    color: '#000',
  },
});
