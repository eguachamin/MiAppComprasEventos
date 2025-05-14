//Aqui debo cambiar el estado de Hydrated
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  name: string;
  email: string;
  phone: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
  isHydrated: boolean;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hydrateToken: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  //Luego cambiar importante porque es necesario cambiar para que se cargue de acuerdo a los datos ingresados
  isHydrated: true, // cambiar luego de las pruebas
  setToken: (token) => {
    AsyncStorage.setItem('token', token);
    set({ token });
  },
  setUser: (user) => {
    set({ user });
  },
  logout: () => {
    AsyncStorage.removeItem('token');
    set({ token: null, user: null });
  },
  hydrateToken: async () => {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
      set({ token: storedToken });
    }
    set({ isHydrated: true }); // IMPORTANTE
  },
}));

