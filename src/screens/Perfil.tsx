import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, ScrollView} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/authStore';
import {  obtenerDetalleCliente,  actualizarCliente,  cambiarPassword, subirFotoPerfil} from '../services/userService';
import { StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CambioPasswordExitoso from '../components/modals/CambioPasswordExitoso'; // ajusta la ruta
import { router } from 'expo-router';
import  ModalMensaje  from '@/components/modals/ModalMensaje'

interface Perfil {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  provincia: string;
  ciudad: string;
  imagenPerfil?: string | null;
}


const PerfilCliente = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user, token } = useAuthStore();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [editando, setEditando] = useState(false);
  const [imagen, setImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordactual, setPasswordactual] = useState('');
  const [passwordnuevo, setPasswordnuevo] = useState('');
  const [modalMensaje, setModalMensaje] = useState({visible: false, mensaje: '', });


    useEffect(() => {
    if (user && token) {
        cargarPerfil();
      } else {
        console.log('No hay usuario o token');
        setLoading(false); // Para que no quede cargando infinitamente
      }
      }, [user, token]);

  const cargarPerfil = async () => {
    try {
      const data = await obtenerDetalleCliente();
      setPerfil(data);
      setImagen(data.imagenPerfil || null);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      Alert.alert('Error', 'No se pudo cargar el perfil.');
    } finally {
      setLoading(false);
    }
  };

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7
    });

    if (!resultado.canceled) {
      const uri = resultado.assets[0].uri;
      setImagen(uri);
    }
  };

    const subirImagen = async (imagenUri: string) => {
  try {
    await subirFotoPerfil(imagenUri);
    Alert.alert('Éxito', 'Imagen subida correctamente');
  } catch (error) {
    Alert.alert('Error', 'No se pudo subir la imagen.');
  }
};

    const guardarCambios = async () => {
      if (!perfil) {
        setModalMensaje({
          visible: true,
          mensaje: 'No hay perfil cargado.',
        });
        return;
      }
      const camposRequeridos: (keyof Perfil)[] = ['nombre', 'email', 'telefono', 'direccion', 'provincia', 'ciudad'];

      // Verifica si algún campo está vacío
      const camposVacios = camposRequeridos.filter((campo) => !perfil[campo]);

      if (camposVacios.length > 0) {
        setModalMensaje({
          visible: true,
          mensaje: 'Por favor, completa todos los campos antes de actualizar tu perfil.',
        });
        return;
      }
    try {
            await actualizarCliente(perfil);

      if (imagen) {
        await subirImagen(imagen);
      }
      setModalMensaje({
      visible: true,
      mensaje: 'Perfil actualizado correctamente.',
    });

      Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      setEditando(false);
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      setModalMensaje({
      visible: true,
      mensaje: error.message || 'Hubo un problema al actualizar tu perfil.',
      });
      Alert.alert('Error', error.message || 'Hubo un problema al actualizar.');
    }
  };

  const manejarCambioPassword = async () => {
    if (!passwordactual || !passwordnuevo){
      setModalMensaje({
      visible: true,
      mensaje: 'Debes llenar todos los campos.',
      });
      return;} 
     if (passwordactual === passwordnuevo) {
      setModalMensaje({
        visible: true,
        mensaje: 'La nueva contraseña no puede ser igual a la actual.',
      });
      return;
    }   
    try {
      await cambiarPassword({ passwordactual, passwordnuevo });
      setModalVisible(true);
      Alert.alert('Éxito', 'Contraseña actualizada.');
      setPasswordactual('');
      setPasswordnuevo('');
      useAuthStore.getState().logout();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }
if (!perfil) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
      <Text>Cargando perfil...</Text>
    </View>
  );
}

return (
  <View style={{ flex: 1 }}>
  <ScrollView contentContainerStyle={styles.contenedor}>
    <TouchableOpacity onPress={seleccionarImagen} style={styles.avatarContenedor}>
      <Image
        source={{ uri: imagen || 'https://www.gravatar.com/avatar/?d=mp' }}
        style={styles.avatar}
      />
    </TouchableOpacity>

    {perfil && ['nombre', 'email', 'telefono', 'direccion', 'provincia', 'ciudad'].map((campo) => (
      <View key={campo} style={styles.infoFila}>
        <Feather
          name={
            campo === 'email'
              ? 'mail'
              : campo === 'telefono'
              ? 'phone'
              : campo === 'direccion'
              ? 'map-pin'
              : campo === 'provincia'
              ? 'map'
              : campo === 'ciudad'
              ? 'home'
              : 'user'
          }
          size={30}
          color="#FFD700"
        />
        <TextInput
          style={styles.infoTextoEditable}
          value={perfil[campo as keyof Perfil] || ''}
          editable={editando}
          onChangeText={(text) => setPerfil({ ...perfil, [campo]: text })}
          placeholder={`Ingrese ${campo}`}
          placeholderTextColor="#aaa"
        />
        {editando && (
          <Ionicons name="pencil" size={20} color="#FFD700" style={{ marginLeft: 8 }} />
        )}
      </View>
    ))}

    {editando ? (
      <TouchableOpacity onPress={guardarCambios} style={styles.botonEditar}>
        <Text style={styles.textoBoton}>Actualizar Cambios</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={() => setEditando(true)} style={styles.botonEditar}>
        <Text style={styles.textoBoton}>Editar Perfil</Text>
      </TouchableOpacity>
    )}

    <View style={{ marginTop: 40, width: '100%' }}>
      <Text style={{ color: '#FFD700', fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Cambiar Contraseña
      </Text>
      <TextInput
        placeholder="Contraseña Actual"
        value={passwordactual}
        onChangeText={setPasswordactual}
        secureTextEntry
        placeholderTextColor="#888"
        style={styles.inputPassword}
      />
      <TextInput
        placeholder="Nueva Contraseña"
        value={passwordnuevo}
        onChangeText={setPasswordnuevo}
        secureTextEntry
        placeholderTextColor="#888"
        style={styles.inputPassword}
      />
      <TouchableOpacity onPress={manejarCambioPassword} style={styles.botonCerrarSesion}>
        <Text style={[styles.textoBoton, { color: '#FFD700' }]}>Actualizar Contraseña</Text>
      </TouchableOpacity>
    </View>
  </ScrollView>
  {modalVisible && (
      <CambioPasswordExitoso
        onClose={() => {
          setModalVisible(false);
          router.replace('/login'); // redirige al login
        }}
  
      />
  )};
   {/* Modal de error o validaciones (si decides usar otro) */}
    {modalMensaje.visible && (
      <ModalMensaje
        visible={modalMensaje.visible}
        mensaje={modalMensaje.mensaje}
        onClose={() => setModalMensaje({ visible: false, mensaje: '' })}
      />
    )}
</View>);
};

export default PerfilCliente;

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    padding: 30,
    paddingBottom: 40,
  },
  avatarContenedor: {
    marginVertical: 20,
    borderRadius: 80,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  avatar: {
    width: 150,
    height: 150,
  },
  infoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
  infoTextoEditable: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 15,
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
    paddingVertical: 4,
  },
  botonEditar: {
    marginTop: 40,
    backgroundColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  botonCerrarSesion: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
  },
  textoBoton: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    padding: 10,
    color: '#fff',
    marginBottom: 15,
  },
});