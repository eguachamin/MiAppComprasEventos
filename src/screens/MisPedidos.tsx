// screens/PedidosScreen.tsx

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { listarHistorialCompras } from "@/services/carritoService";

export default function PedidosScreen() {
  
  const [pedidos, setPedidos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const data = await listarHistorialCompras(); // Esta función ya la tienes en carritoService
        setPedidos(data);
      } catch (error) {
        console.error("Error al cargar pedidos", error);
      }
    };

    cargarPedidos();
  }, []);

  return (
    <ScrollView style={styles.contenedor}>
      <Text style={styles.titulo}>Mis Pedidos</Text>

      {pedidos.length === 0 && (
        <Text style={{ color: "#fff", textAlign: "center" }}>
          No tienes compras realizadas aún.
        </Text>
      )}

      {pedidos.map((pedido, index) => (
        <TouchableOpacity
          key={`pedido-${pedido._id || index}`}
          style={styles.filaTabla}
          onPress={() =>
            router.push({ pathname: "/detalle-pedido", params: { id: pedido._id } })
          }
        >
          <Text style={[styles.celda, styles.celdaNombre]}>
            {pedido.estado}
          </Text>
          <Text style={styles.celda}>
            {new Date(pedido.fechaCompra).toLocaleDateString()}
          </Text>
          <Text style={styles.celda}>
            ${pedido.total.toFixed(2)}
          </Text>
          <Text style={styles.celda}>
            Ver Detalle →
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
                style={styles.botonVolver}
                onPress={() => router.replace('/home')}
              >
                <Text style={styles.textoBoton}>← Volver</Text>
              </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  filaTabla: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingVertical: 12,
  },
  celda: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  celdaNombre: {
    flex: 2,
    textAlign: "left",
    color: "#fff",
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
});