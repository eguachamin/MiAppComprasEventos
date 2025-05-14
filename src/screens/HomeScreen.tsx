import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a la app del DJ</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/vinilo')}
      >
        <Text style={styles.buttonText}>Comprar Discos de Vinilo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/eventos')}
      >
        <Text style={styles.buttonText}>Reservar Servicio del DJ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/pedidos')}
      >
        <Text style={styles.buttonText}>Ver Mis Pedidos / Reservas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => router.push('/perfilusuario')}
      >
        <Text style={styles.secondaryText}>Mi Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonSecondary: {
    padding: 10,
    marginTop: 10,
  },
  secondaryText: {
    color: '#007bff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
