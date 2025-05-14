// app/comprarVinilos.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';

// Tipo de producto
interface Producto {
  _id: string;
  nombre: string;
  cantante: string;
  genero: string;
  precio: number;
  imagen: string; // URL
  stock: number;
}

export default function ComprarVinilos() {
  const token = useAuthStore((state) => state.token);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3000/api/cliente/listar', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos', error);
        Alert.alert('Error', 'No se pudieron cargar los productos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, [token]);

  const comprarDisco = async (productoId: string) => {
    try {
      await axios.post(
        `https://tu-api.com/api/pedidos`,
        { productoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProductos((prev) =>
        prev.map((p) =>
          p._id === productoId ? { ...p, stock: p.stock - 1 } : p
        )
      );
      Alert.alert('Compra realizada', 'El disco ha sido añadido a tu pedido.');
    } catch (error) {
      console.error('Error al comprar disco:', error);
      Alert.alert('Error', 'No se pudo completar la compra.');
    }
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <Text style={styles.name}>{item.nombre}</Text>
      <Text style={styles.detail}>Cantante: {item.cantante}</Text>
      <Text style={styles.detail}>Género: {item.genero}</Text>
      <Text style={styles.detail}>Precio: ${item.precio.toFixed(2)}</Text>
      <Text style={styles.detail}>Stock: {item.stock}</Text>
      <TouchableOpacity
        style={[styles.button, item.stock === 0 && styles.disabledButton]}
        onPress={() => comprarDisco(item._id)}
        disabled={item.stock === 0}
      >
        <Text style={styles.buttonText}>{item.stock > 0 ? 'Comprar' : 'Agotado'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={productos}
      renderItem={renderItem}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.container}
      refreshing={loading}
      onRefresh={() => {}}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    marginBottom: 3,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
