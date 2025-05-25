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
import { getProductos } from "../services/userService";
import Feather from '@expo/vector-icons/Feather'; //  
import { router } from 'expo-router';

interface Producto {
  id: string;
  nombre: string;
  artista: string;
  genero: string;
  precio: number;
  stock: number;
  imagen: string;
}

const normalizarTexto = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function ComprarVinilos() {
  const [cantidades, setCantidades] = useState<{ [id: string]: number }>({});
  const [busqueda, setBusqueda] = useState('');
  const [mostrarSinStock, setMostrarSinStock] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);

  useEffect(() => {
  const cargarProductos = async () => {
    try {
      const data = await getProductos();
      console.log('Datos crudos del backend:', data);
      const adaptados:Producto[] = data.map((producto: any) => ({
        id: producto._id,
        nombre: producto.nombreDisco,
        artista: producto.artista,
        genero: producto.genero,
        precio: producto.precio,
        stock: producto.stock,
        imagen: producto.imagen,
      }));
      setProductos(adaptados);
      setProductosFiltrados(adaptados); 
    } catch (error) {
      console.error('No se pudo cargar el catálogo.');
    }
  };

  cargarProductos();
}, []);
  useEffect(() => {
    const textoBusqueda = normalizarTexto(busqueda);

    const filtrados = productos.filter((producto) => {
      const nombre = normalizarTexto(producto.nombre);
      const artista = normalizarTexto(producto.artista);
      const genero = normalizarTexto(producto.genero);

      const coincideBusqueda =
        nombre.includes(textoBusqueda) ||
        artista.includes(textoBusqueda) ||
        genero.includes(textoBusqueda);

      const cumpleStock = mostrarSinStock ? true : producto.stock > 0;

      return coincideBusqueda && cumpleStock;
    });

    setProductosFiltrados(filtrados);
  }, [busqueda, mostrarSinStock, productos]);
  console.log('Productos filtrados:', productosFiltrados);
  
  
  const actualizarCantidad = (id: string, nuevaCantidad: number) => {
  setCantidades(prev => ({ ...prev, [id]: nuevaCantidad }));
    };


  return (
  <View style={estilos.contenedor}>
    <Text style={estilos.titulo}>Catálogo de Vinilos</Text>

    <TouchableOpacity onPress={() => router.replace('/carrito')}>
      <Feather name="shopping-cart" size={26} color="#FFD700" />
    </TouchableOpacity>
    <br />
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

    {productosFiltrados.length === 0 && (
      <Text style={{ color: '#fff', textAlign: 'center', marginVertical: 10 }}>
        No se encontraron productos con los filtros actuales.
      </Text>
    )}

    <FlatList
      data={productosFiltrados}
      keyExtractor={(item) => item.id.toString()}
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
            <>
              <View style={estilos.selectorCantidadContainer}>
                <Text style={estilos.detalle}>Cantidad:</Text>
                <View style={estilos.controlesCantidad}>
                  <TouchableOpacity
                    style={estilos.botonCantidad}
                    onPress={() =>
                      actualizarCantidad(item.id, Math.max(1, (cantidades[item.id] || 1) - 1))
                    }
                  >
                    <Text style={estilos.textoCantidad}>−</Text>
                  </TouchableOpacity>
                  <Text style={estilos.cantidad}>{cantidades[item.id] || 1}</Text>
                  <TouchableOpacity
                    style={estilos.botonCantidad}
                    onPress={() =>
                      actualizarCantidad(item.id, Math.min(item.stock, (cantidades[item.id] || 1) + 1))
                    }
                  >
                    <Text style={estilos.textoCantidad}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={estilos.boton}>
                <Text style={estilos.textoBoton}>Agregar al carrito</Text>
              </TouchableOpacity>
            </>
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
    selectorCantidadContainer: {
  marginTop: 10,
},
controlesCantidad: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginVertical: 5,
},
botonCantidad: {
  backgroundColor: '#333',
  padding: 8,
  borderRadius: 6,
},
textoCantidad: {
  color: '#fff',
  fontSize: 18,
  fontWeight: 'bold',
},
cantidad: {
  color: '#fff',
  marginHorizontal: 10,
  fontSize: 16,
},
});
