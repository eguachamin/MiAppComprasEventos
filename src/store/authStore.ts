import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface AuthState {
  token: string | null;
  user: any;
  isLoading: boolean;
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  loadStorage: () => Promise<void>;
}

const isWeb = Platform.OS === 'web';

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  login: async (token, user) => {
    try {
      if (isWeb) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      set({ token, user });
    } catch (error) {
      console.error('Error guardando en storage:', error);
    }
  },

  logout: async () => {
    try {
      if (isWeb) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      }
      set({ token: null, user: null });
    } catch (error) {
      console.error('Error removiendo storage:', error);
    }
  },

  loadStorage: async () => {
    try {
      let token = null;
      let user = null;

      if (isWeb) {
        token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (userStr) user = JSON.parse(userStr);
      } else {
        token = await AsyncStorage.getItem('token');
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) user = JSON.parse(userStr);
      }

      if (token && user) {
        set({ token, user, isLoading: false });
      } else {
        set({ token: null, user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Error cargando desde storage:', error);
      set({ token: null, user: null, isLoading: false });
    }
  },
}));
