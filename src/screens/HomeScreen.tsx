import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/store/authStore';
import { useNotificacionStore } from '@/store/notificacionStore';

export default function HomeScreen() {
  const router = useRouter();
  const cantidadNoLeidas = useNotificacionStore((state) => state.cantidadNoLeidas);

  const menuItems = [
    { label: 'Comprar Vinilos', iconName: 'music', route: '/vinilo' },
    { label: 'Mis Pedidos', iconName: 'shopping-bag', route: '/pedidos' },
    { label: 'Mi Perfil', iconName: 'user', route: '/perfilusuario' },
    { label: 'Info de Eventos', iconName: 'info', route: '/eventos' },
  ];

  return (
    <LinearGradient
      colors={['#000000', '#1a1a1a']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🎧 DJ Edwin</Text>
        <View style={{ flexDirection: 'row', gap: 15 }}>

         {/* Botón de campana */}
        <TouchableOpacity onPress={() => router.push('/notificaciones')}>
            <Feather name="bell" size={26} color="#FFD700" />
            {cantidadNoLeidas > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cantidadNoLeidas}</Text>
              </View>
            )}
          
        </TouchableOpacity>
        {/* Botón de logout */}
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
    marginBottom: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  subtitle: {
    fontSize: 25,
    color: '#FFD700',
    textAlign: 'center',
    marginBottom: 30,
    marginTop:40
  },
  menu: {
    flex: 1,
    justifyContent: 'flex-start',
    gap: 15,
  },
  menuButton: {
    backgroundColor: '#111',
    borderColor: '#FFD700',
    borderWidth: 1.5,
    padding: 20,
    borderRadius: 14,
    marginBottom: 15,
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
  campanaContainer: {
    position: 'relative',
    padding: 10,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
