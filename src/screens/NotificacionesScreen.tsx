// screens/NotificacionesScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNotificacionStore } from '@/store/notificacionStore';

export default function NotificacionesScreen() {
  const { notificaciones, marcarComoLeida } = useNotificacionStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>
      {notificaciones.length === 0 ? (
        <Text style={styles.emptyText}>No tienes notificaciones aún.</Text>
      ) : (
        <FlatList
          data={notificaciones}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.item,
                item.leida ? styles.leido : styles.noLeido
              ]}
              onPress={() => marcarComoLeida(item.id)}
            >
              <Text style={styles.titulo}>{item.titulo}</Text>
              <Text style={styles.cuerpo}>{item.cuerpo}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFD700', marginBottom: 20 },
  emptyText: { color: '#ccc', fontSize: 16 },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  leido: { backgroundColor: '#111' },
  noLeido: { backgroundColor: '#1a1a1a' },
  titulo: { fontSize: 16, fontWeight: '600', color: '#fff' },
  cuerpo: { fontSize: 14, color: '#ccc', marginTop: 4 },
});