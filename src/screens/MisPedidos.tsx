// app/(tabs)/misPedidos.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { getUserOrders } from '../services/auth'; // usamos el servicio actualizado

export default function MisPedidos() {
  const token = useAuthStore((state) => state.token);
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarPedidos = async () => {
      if (!token) {
        setError('No estás autenticado.');
        setLoading(false);
        return;
      }

      try {
        const data = await getUserOrders(token);
        setPedidos(data);
      } catch (err: any) {
        console.error(err);
        setError('Error al cargar los pedidos.');
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Pedidos</Text>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : pedidos.length === 0 ? (
        <Text style={styles.empty}>No tienes pedidos aún.</Text>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.pedido}>
              <Text style={styles.itemTitle}>
                {item.tipo === 'vinilo' ? 'Compra de Vinilo' : 'Cotización'}
              </Text>
              <Text>Estado: {item.estado}</Text>
              <Text>Fecha: {new Date(item.fecha).toLocaleDateString()}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  pedido: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemTitle: { fontWeight: 'bold' },
  error: { color: 'red', marginTop: 20 },
  empty: { marginTop: 20, fontStyle: 'italic' },
});
