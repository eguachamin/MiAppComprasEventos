// screens/DetallePedidoScreen.tsx
import ZoomableImageModal from '@/components/modals/ZoomableImage'
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { detalleHistorialCompras } from "@/services/carritoService";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { startCustomTrace, stopCustomTrace, useScreenTrace } from '@/utils/usePerformance';

export default function DetallePedidoScreen() {
  useScreenTrace('detalle_pedido_screen');
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    const cargarDetalle = async () => {
      let trace;
      try {
        trace = await startCustomTrace('detalle_pedido_flow');
        // Opcional: iniciar otra traza específica para errores
        const errorTrace = await startCustomTrace('detalle_pedido_error');
        await errorTrace.stop();
        const data = await detalleHistorialCompras(id); // Tu backend tiene: /compras/detallehistorial/:id
        setPedido(data);
        await stopCustomTrace(trace);
      } catch (error) {
        if (trace) await stopCustomTrace(trace);
        console.error("Error al cargar el detalle del pedido:", error);
      }
    };

    if (id) {
      cargarDetalle();
    }
  }, [id]);

  if (!pedido) {
    return (
      <View style={styles.contenedor}>
        <Text style={{ color: "#fff" }}>Cargando...</Text>
      </View>
    );
  }

  return (
  <ScrollView style={styles.contenedor}>
    <Text style={styles.titulo}>Detalle del Pedido</Text>
    <GestureHandlerRootView >
    <View style={styles.card}>
      {/* Fecha */}
      <Text style={styles.label}>Fecha:</Text>
      <Text style={styles.valor}>
        {new Date(pedido.fechaCompra).toLocaleString()}
      </Text>

      {/* Estado */}
      <Text style={styles.label}>Estado:</Text>
      <Text style={styles.valor}>{pedido.estado}</Text>

      {/* Dirección */}
      <Text style={styles.label}>Dirección:</Text>
      <Text style={styles.valor}>
        {pedido.direccionEnvio
          ? `${pedido.direccionEnvio.callePrincipal}, ${pedido.direccionEnvio.calleSecundaria}, ${pedido.direccionEnvio.provincia}, ${pedido.direccionEnvio.ciudad}`
          : "Retiro en lugar público"}
      </Text>

      {/* Método de envío */}
      <Text style={styles.label}>Método de envío:</Text>
      <Text style={styles.valor}>{pedido.metodoEnvio}</Text>

      {/* Total */}
      <Text style={styles.label}>Total:</Text>
      <Text style={styles.valor}>${pedido.total.toFixed(2)}</Text>

      {/* Productos */}
      <Text style={styles.label}>Productos:</Text>
      {pedido.productos.map((producto: any, index: number) => (
        <View key={`producto-${index}`} style={styles.productoItem}>
          <Text style={styles.valor}>
            {producto.nombre} x {producto.cantidad} - ${producto.precio * producto.cantidad}
          </Text>
        </View>
      ))}

      {/* Comprobante de Envío o Entrega */}
      <Text style={styles.label}>Comprobante de Envío:</Text>

      {pedido.metodoEnvio === "encuentro-publico" ? (
        <Text style={styles.valor}>
          Este pedido será entregado personalmente en un lugar público. No se requiere comprobante de envío.
        </Text>
      ) : pedido.estado === "pendiente" ? (
        <Text style={styles.valor}>
          Tu pedido aún está en estado pendiente. Una vez procesado, aparecerá aquí el comprobante o guía de envío.
        </Text>
      ) : pedido.comprobanteEnvio ? (
        <ZoomableImageModal
          uri= {pedido.comprobanteEnvio }
          thumbnailSize={150}
        />
        
      ) : (
        <Text style={styles.valor}>
          El administrador aún no ha cargado un comprobante de envío para este pedido.
        </Text>
      )}

      {pedido.estado === "enviado" && (
        <>
          <Text style={styles.label}>Fecha de Envío:</Text>
          <Text style={styles.valor}>
            {new Date(pedido.fechaEnvio).toLocaleString()}
          </Text>
        </>
      )}

      {/* Datos de la persona que recibe si es Servientrega */}
      {pedido.metodoEnvio === "servientrega" && pedido.direccionEnvio &&(
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Datos de la Persona que Recibe:</Text>
          <Text style={styles.valor}>Nombre: {pedido.direccionEnvio.nombreRecibe}</Text>
          <Text style={styles.valor}>Cédula: {pedido.direccionEnvio.cedula}</Text>
        </View>
      )}
      
      {/* Botón Volver */}
      <TouchableOpacity
        style={styles.botonVolver}
        onPress={() => router.back()}
      >
        <Text style={styles.textoBoton}>← Volver</Text>
      </TouchableOpacity>
    </View>
    </GestureHandlerRootView>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#000",
    padding: 20,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  titulo: {
    fontSize: 24,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    color: "#FFD700",
    fontSize: 16,
    marginTop: 15,
  },
  valor: {
    color: "#fff",
    fontSize: 16,
  },
  productoItem: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#FFD700",
    marginTop: 8,
  },
  botonVolver: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  textoBoton: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  personaRecibeContainer: {
  marginTop: 15,
  paddingLeft: 10,
  borderLeftWidth: 2,
  borderLeftColor: "#FFD700",
},
personaRecibeLabel: {
  color: "#FFD700",
  fontSize: 16,
  fontWeight: "bold",
},
personaRecibeValor: {
  color: "#fff",
  fontSize: 16,
  marginLeft: 10,
  marginBottom: 8,
},
});