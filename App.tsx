import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import { useEffect } from 'react';
import { useAuthStore } from './src/store/authStore';
import ReservarEvento from './src/screens/ReservarEvento';

const Stack = createNativeStackNavigator();

export default function App() {
  const hydrateToken = useAuthStore((state) => state.hydrateToken);

  useEffect(() => {
    hydrateToken();
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ReservarEvento" component={ReservarEvento} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
