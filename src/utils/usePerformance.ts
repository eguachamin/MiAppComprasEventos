import { perf } from '../../firebase';
import { useEffect } from 'react';

// Hook reutilizable para medir tiempo de carga de pantalla
export const useScreenTrace = (screenName: string) => {
  useEffect(() => {
    let trace: any = null;

    // Iniciar traza al cargar la pantalla
    const initializeTrace = async () => {
      trace = await perf().startScreenTrace(screenName);
    };

    initializeTrace();

    // Detener traza cuando la pantalla se desmonta
    return () => {
      if (trace) {
        trace.stop();
      }
    };
  }, [screenName]);
};

// Función para iniciar una traza personalizada (login, registro, etc.)
export const startCustomTrace = async (traceName: string) => {
  const trace = perf().newTrace(traceName);
  await trace.start();
  return trace;
};

// Función para detener una traza
export const stopCustomTrace = async (trace: any) => {
  if (trace) {
    await trace.stop();
  }
};