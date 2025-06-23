// utils/notificaciones.js
import * as Notifications from 'expo-notifications';

export async function getExpoPushToken() {
    const { status } = await Notifications.getPermissionsAsync();

    if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
            console.warn('Permiso para notificaciones no concedido.');
            return null;
        }
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
    experienceId: '@tatiana97/tesiseguachaminapp',
    }as any);
        console.log("🎯 Token generado:", tokenData);
    return tokenData.data; // Devuelve solo la parte del token
}