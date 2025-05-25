import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';

export default function HomeScreen() {
  const router = useRouter();

  const menuItems = [
    { label: 'Comprar Vinilos', iconName: 'music', route: '/vinilo' },
    { label: 'Mis Compras', iconName: 'shopping-bag', route: '/carrito' },
    { label: 'Mi Perfil', iconName: 'user', route: '/perfilusuario' },
    { label: 'Sobre el DJ', iconName: 'info', route: '/vinilo' },
  ];

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🎧 DJ Edwin</Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>
        <TouchableOpacity onPress={() => console.log('Notificaciones')}>
          <Feather name="bell" size={26} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          useAuthStore.getState().logout();
          router.replace('/login');
        }}>
          <Feather name="log-out" size={26} color="#FFD700" />
        </TouchableOpacity>
      </View>
      </View>

      <Text style={styles.subtitle}>¡Bienvenido a tu universo musical!</Text>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.menuButton}
            onPress={() => router.push(item.route as any)}
          >
            <Feather name={item.iconName as any} size={30} color="#FFD700" />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 30,
  },
  menu: {
    flex: 1,
    justifyContent: 'center',
  },
  menuButton: {
    backgroundColor: '#111',
    borderColor: '#FFD700',
    borderWidth: 1.5,
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 6,
  },
  menuText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
