import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';

type Usuario = {
  nombre: string;
  correo: string;
  telefono: string;
  direccion: string;
  provincia: string;
  ciudad: string;
  avatarUrl?: string; // opcional
};

const usuarioEjemplo: Usuario = {
  nombre: 'Edwin Asqui',
  correo: 'edwin@example.com',
  telefono: '+593 999 999 999',
  direccion: 'Av. Principal #123',
  provincia: 'Pichincha',
  ciudad: 'Quito',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
};

export default function PerfilCliente() {
  // Aquí podrías recibir props o usar un contexto/estado para el usuario real
  const usuario = usuarioEjemplo;

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <View style={styles.avatarContenedor}>
        <Image
          source={{ uri: usuario.avatarUrl || 'https://i.pravatar.cc/150?img=1' }}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.nombre}>{usuario.nombre}</Text>

      <View style={styles.infoFila}>
        <Feather name="mail" size={30} color="#FFD700" />
        <Text style={styles.infoTexto}>{usuario.correo}</Text>
      </View>

      <View style={styles.infoFila}>
        <Feather name="phone" size={30} color="#FFD700" />
        <Text style={styles.infoTexto}>{usuario.telefono}</Text>
      </View>

      <View style={styles.infoFila}>
        <Feather name="map-pin" size={30} color="#FFD700" />
        <Text style={styles.infoTexto}>{usuario.direccion}</Text>
      </View>

      <View style={styles.infoFila}>
        <Feather name="map" size={30} color="#FFD700" />
        <Text style={styles.infoTexto}>{usuario.provincia}</Text>
      </View>

      <View style={styles.infoFila}>
        <Feather name="home" size={30} color="#FFD700" />
        <Text style={styles.infoTexto}>{usuario.ciudad}</Text>
      </View>

      <TouchableOpacity style={styles.botonEditar}>
        <Text style={styles.textoBoton}>Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botonCerrarSesion}>
        <Text style={[styles.textoBoton, { color: '#FFD700' }]}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
  nombre: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 30,
    textAlign: 'center',
  },
  infoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
  infoTexto: {
    color: '#fff',
    fontSize: 25,
    marginLeft: 15,
    flexShrink: 1,
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
});
