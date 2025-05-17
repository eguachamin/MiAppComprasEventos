import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

type ProductoPedido = {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
};

type PedidoDetalle = {
  id: string;
  fecha: string;
  estado: 'En proceso' | 'Enviado' | 'Entregado';
  cliente: {
    nombre: string;
    telefono: string;
    correo: string;
    direccion: string;
  };
  productos: ProductoPedido[];
  envio: number; // costo de envío
};

const pedidoEjemplo: PedidoDetalle = {
  id: '001',
  fecha: '2025-05-15',
  estado: 'En proceso',
  cliente: {
    nombre: 'Juan Pérez',
    telefono: '0991234567',
    correo: 'juanperez@example.com',
    direccion: 'Av. Siempre Viva 123',
  },
  productos: [
    { id: 'p1', nombre: 'Disco Vinilo A', cantidad: 1, precio: 20.0 },
    { id: 'p2', nombre: 'Disco Vinilo B', cantidad: 2, precio: 15.0 },
  ],
  envio: 4.0,
};

export default function MisPedidos() {
  const route = useRouter();
  const subtotal = pedidoEjemplo.productos.reduce(
    (sum, item) => sum + item.cantidad * item.precio,
    0
  );
  const total = subtotal + pedidoEjemplo.envio;

  return (
    <ScrollView style={styles.contenedor}>
      <Text style={styles.titulo}>Detalle Pedido #{pedidoEjemplo.id}</Text>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Información del Pedido</Text>
        <Text>Fecha: {pedidoEjemplo.fecha}</Text>
        <Text>
          Estado:{' '}
          <Text
            style={[
              styles.estado,
              pedidoEjemplo.estado === 'Entregado' && styles.estadoEntregado,
              pedidoEjemplo.estado === 'Enviado' && styles.estadoEnviado,
              pedidoEjemplo.estado === 'En proceso' && styles.estadoProceso,
            ]}
          >
            {pedidoEjemplo.estado}
          </Text>
        </Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Datos del Cliente</Text>
        <Text>Nombre: {pedidoEjemplo.cliente.nombre}</Text>
        <Text>Teléfono: {pedidoEjemplo.cliente.telefono}</Text>
        <Text>Correo: {pedidoEjemplo.cliente.correo}</Text>
        <Text>Dirección: {pedidoEjemplo.cliente.direccion}</Text>
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Productos</Text>
        {pedidoEjemplo.productos.map((prod) => (
          <View key={prod.id} style={styles.filaProducto}>
            <Text style={styles.nombreProducto}>{prod.nombre}</Text>
            <Text>Cantidad: {prod.cantidad}</Text>
            <Text>Precio: ${prod.precio.toFixed(2)}</Text>
            <Text>Subtotal: ${(prod.cantidad * prod.precio).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.seccion}>
        <Text style={styles.subtitulo}>Resumen de Pago</Text>
        <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
        <Text>Costo de envío: ${pedidoEjemplo.envio.toFixed(2)}</Text>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      </View>

      <TouchableOpacity onPress={() => route.push('/vinilo')} style={styles.boton}>
        <Text style={styles.textoBoton}>Regresar a Productos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 20,
  },
  seccion: {
    marginBottom: 20,
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 15,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  filaProducto: {
    marginBottom: 12,
    backgroundColor: '#222',
    padding: 10,
    borderRadius: 8,
  },
  nombreProducto: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  estado: {
    fontWeight: 'bold',
  },
  estadoEntregado: {
    color: '#4CAF50',
  },
  estadoEnviado: {
    color: '#2196F3',
  },
  estadoProceso: {
    color: '#FFD700',
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
  },
  boton: {
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 10,
  },
  textoBoton: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});
