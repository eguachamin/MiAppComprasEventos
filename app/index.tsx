// app/index.tsx
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
      <Text style={{ color: '#FFD700', fontSize: 24 }}>¡Bienvenido a la app!</Text>
    </View>
  );
}
