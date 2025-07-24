// Pantalla Mis Pedidos
//Evelyn Guachamin

//Importación de Librerías

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { listarHistorialCompras } from "@/services/carritoService";

export default function PedidosScreen() {
  const [mostrarPendientes, setMostrarPendientes] = useState(false);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const router = useRouter();
  //Capitaliza la palabra para mejor presentación en la interfaz (Estado)
  const capitalizarPrimeraLetra = (texto: string) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};
//Carga los pedidos del Cliente
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
  // Filtra los pedidos si "mostrarPendientes" es true
  const pedidosFiltrados = mostrarPendientes
    ? pedidos.filter((p) => p.estado === "pendiente")
    : pedidos;

  return (
    <ScrollView style={styles.contenedor}>
      <Text style={styles.titulo}>Mis Pedidos</Text>
      {/* Filtro de mostrar solo pendientes */}
      <View style={styles.filtroContainer}>
          <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>
            Mostrar pedidos en estado pendiente
          </Text>
          <Switch
            value={mostrarPendientes}
            onValueChange={setMostrarPendientes}
            thumbColor={mostrarPendientes ? "#FFD700" : "#f4f3f4"}
            trackColor={{ false: "#555", true: "#FFD700" }}
          />
        </View>
      </View>
      {pedidos.length === 0 && (
        <Text style={{ color: "#fff", textAlign: "center" }}>
          No tienes compras realizadas aún.
        </Text>
      )}
      {pedidosFiltrados.length === 0 && (
        <Text style={{ color: "#999", textAlign: "center" }}>
          {mostrarPendientes
            ? "No tienes pedidos pendientes."
            :""}
        </Text>
      )}
      {pedidosFiltrados.map((pedido, index) => (
        <TouchableOpacity
          key={`pedido-${pedido._id || index}`}
          style={styles.filaTabla}
          onPress={() =>
            router.push({ pathname: "/detalle-pedido", params: { id: pedido._id } })
          }
        >
          <Text style={[styles.celda, styles.celdaNombre]}>
            {capitalizarPrimeraLetra(pedido.estado)}
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
//Estilos de la Interfaz
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
  filtroContainer: {
    marginBottom: 20,
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
  },
  filtroTexto: {
    color: "#ccc",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchLabel: {
    color: "#fff",
    fontSize: 16,
    marginRight: 10,
  },
});