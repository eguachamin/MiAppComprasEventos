// src/app/_layout.tsx o similar
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Stack } from 'expo-router';

import { useAuthStore } from '@/store/authStore';
import { useNotificacionStore } from '@/store/notificacionStore'; // Asegúrate de tener este store

export default function RootLayout() {
  const loadStorage = useAuthStore((state) => state.loadStorage);
  const isLoading = useAuthStore((state) => state.isLoading);
  const addNotificacion = useNotificacionStore((state) => state.agregarNotificacion);

  useEffect(() => {
    loadStorage();
  }, []);

  useEffect(() => {
    // Registrar permisos (solo necesario si no lo hiciste antes)
    const registerForPushNotificationsAsync = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          alert('Permiso para notificaciones denegado');
        }
      }
    };

    registerForPushNotificationsAsync();

    // Escuchar notificaciones mientras la app está abierta
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      const title = notification.request.content.title || 'Sin título';
      const body = notification.request.content.body || 'Sin mensaje';

      // Guardamos la notificación localmente
      addNotificacion(title, body);
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack />;
}
