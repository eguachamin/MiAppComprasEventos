import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  Switch,
} from 'react-native';

const productosEjemplo = [
  {
    id: '1',
    nombre: 'Vinilo Dorado',
    artista: 'DJ Edwin',
    genero: 'Electrónica',
    precio: 25.99,
    stock: 5,
    imagen: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    nombre: 'Ritmos del Sur',
    artista: 'Edwin Asqui',
    genero: 'Reggaetón',
    precio: 19.99,
    stock: 0,
    imagen: 'https://via.placeholder.com/150',
  },
  // Más productos...
];

export default function ComprarVinilos() {
  const [busqueda, setBusqueda] = useState('');
  const [mostrarSinStock, setMostrarSinStock] = useState(false);
  const [productos, setProductos] = useState(productosEjemplo);
  const [productosFiltrados, setProductosFiltrados] = useState(productosEjemplo);

  useEffect(() => {
    const filtrados = productos.filter((producto) => {
      const texto = busqueda.toLowerCase();
      const coincide =
        producto.nombre.toLowerCase().includes(texto) ||
        producto.artista.toLowerCase().includes(texto) ||
        producto.genero.toLowerCase().includes(texto);
      return coincide && (mostrarSinStock || producto.stock > 0);
    });
    setProductosFiltrados(filtrados);
  }, [busqueda, mostrarSinStock, productos]);

  return (
    <View style={estilos.contenedor}>
      <Text style={estilos.titulo}>Catálogo de Vinilos</Text>

      <TextInput
        style={estilos.inputBusqueda}
        placeholder="Buscar por nombre, artista o género"
        placeholderTextColor="#aaa"
        value={busqueda}
        onChangeText={setBusqueda}
      />

      <View style={estilos.filtroContainer}>
        <Text style={estilos.etiquetaFiltro}>Mostrar productos sin stock</Text>
        <Switch
          value={mostrarSinStock}
          onValueChange={setMostrarSinStock}
          thumbColor={mostrarSinStock ? '#FFD700' : '#777'}
          trackColor={{ false: '#555', true: '#FFD700' }}
        />
      </View>

      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <View style={estilos.card}>
            <Image source={{ uri: item.imagen }} style={estilos.imagen} />
            <Text style={estilos.nombre}>{item.nombre}</Text>
            <Text style={estilos.detalle}>Artista: {item.artista}</Text>
            <Text style={estilos.detalle}>Género: {item.genero}</Text>
            <Text style={estilos.detalle}>Precio: ${item.precio}</Text>
            <Text style={estilos.detalle}>Stock: {item.stock}</Text>
            {item.stock > 0 ? (
              <TouchableOpacity style={estilos.boton}>
                <Text style={estilos.textoBoton}>Agregar al carrito</Text>
              </TouchableOpacity>
            ) : (
              <Text style={estilos.sinStock}>Próximamente en stock</Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 12,
    textAlign: 'center',
  },
  inputBusqueda: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 12,
  },
  filtroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  etiquetaFiltro: {
    color: '#fff',
    fontSize: 14,
  },
  lista: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderColor: '#444',
    borderWidth: 1,
  },
  imagen: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  nombre: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detalle: {
    color: '#fff',
    fontSize: 14,
  },
  boton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  textoBoton: {
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  sinStock: {
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
