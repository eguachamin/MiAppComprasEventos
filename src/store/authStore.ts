// src/store/authStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  user: any;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,

  login: async (token, user) => {
    await AsyncStorage.setItem('token', token);
    set({ token, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));