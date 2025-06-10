// store/notificacionStore.ts
import { create } from 'zustand';

type Notificacion = {
    id: string;
    titulo: string;
    cuerpo: string;
    leida: boolean;
    fecha: Date;
};

type Store = {
    notificaciones: Notificacion[];
    cantidadNoLeidas: number;
    agregarNotificacion: (titulo: string, cuerpo: string) => void;
    marcarComoLeida: (id: string) => void;
    limpiarNotificaciones: () => void;
};

export const useNotificacionStore = create<Store>((set) => ({
    notificaciones: [],
    cantidadNoLeidas: 0,

    agregarNotificacion: (titulo, cuerpo) =>
        set((state) => {
            const nueva = {
                id: Math.random().toString(36).substring(2),
                titulo,
                cuerpo,
                leida: false,
                fecha: new Date(),
            };
            return {
                notificaciones: [nueva, ...state.notificaciones],
                cantidadNoLeidas: state.cantidadNoLeidas + 1,
            };
        }),

    marcarComoLeida: (id) =>
        set((state) => {
            const nuevas = state.notificaciones.map((n) =>
                n.id === id ? { ...n, leida: true } : n
            );
            const nuevasNoLeidas = nuevas.filter((n) => !n.leida).length;

            return {
                notificaciones: nuevas,
                cantidadNoLeidas: nuevasNoLeidas,
            };
        }),

    limpiarNotificaciones: () =>
        set({
            notificaciones: [],
            cantidadNoLeidas: 0,
        }),
}));