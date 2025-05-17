import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  
} from 'react-native';
import { useRouter } from 'expo-router';
import CompraExitosaModal from '../screens/CompraExistosaModal'; // ajusta el path si es necesario

// Para mejor checkbox en Expo usa react-native-paper o react-native-checkbox
// Aquí un ejemplo básico con TouchableOpacity para check

type ProductoCarrito = {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
};

const productosEjemplo: ProductoCarrito[] = [
  { id: '1', nombre: 'Disco A', cantidad: 2, precio: 15 },
  { id: '2', nombre: 'Disco B', cantidad: 1, precio: 20 },
];

export default function CarritoCompras() {
  const [modalVisible, setModalVisible] = useState(false);
  const route = useRouter();
  const handleCloseModal = () => {
  setModalVisible(false);
  route.push('/pedidos');
};
  // Datos usuario (puedes usar estado real luego)
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [direccionEntrega, setDireccionEntrega] = useState('');

  const [productos, setProductos] = useState(productosEjemplo);

  const [envioQuito, setEnvioQuito] = useState(false);
  const [envioProvincia, setEnvioProvincia] = useState(false);

  const [formaPago, setFormaPago] = useState<'efectivo' | 'transferencia' | ''>('');

  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const costoEnvio = (envioQuito ? 4 : 0) + (envioProvincia ? 6 : 0);
  const total = subtotal + costoEnvio;

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity onPress={() => route.push('/pedidos')} style={styles.botonPedidos}>
        <Text style={[styles.textoBoton , { marginTop: 0 }]}>Mis Pedidos</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Datos del Comprador</Text>
      {[
        { label: 'Nombre', value: nombre, setter: setNombre, keyboardType: 'default' },
        { label: 'Teléfono', value: telefono, setter: setTelefono, keyboardType: 'phone-pad' },
        { label: 'Correo', value: correo, setter: setCorreo, keyboardType: 'email-address' },
        { label: 'Dirección', value: direccion, setter: setDireccion, keyboardType: 'default' },
        { label: 'Dirección de Entrega', value: direccionEntrega, setter: setDireccionEntrega, keyboardType: 'default' },
      ].map(({ label, value, setter, keyboardType }) => (
        <TextInput
          key={label}
          style={styles.input}
          placeholder={label}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={setter}
          keyboardType={keyboardType as any}
        />
      ))}

      <Text style={styles.titulo}>Productos en el Carrito</Text>
      <View style={styles.tabla}>
        <View style={[styles.filaTabla, styles.filaHeader]}>
          <Text style={[styles.celda, styles.celdaNombre]}>Producto</Text>
          <Text style={styles.celda}>Cantidad</Text>
          <Text style={styles.celda}>Precio</Text>
        </View>

        {productos.map(({ id, nombre, cantidad, precio }) => (
          <View key={id} style={styles.filaTabla}>
            <Text style={[styles.celda, styles.celdaNombre]}>{nombre}</Text>
            <Text style={styles.celda}>{cantidad}</Text>
            <Text style={styles.celda}>${precio.toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>

      <Text style={styles.titulo}>Envío</Text>

      <View style={styles.checkboxFila}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            setEnvioQuito(!envioQuito);
            if (envioProvincia && !envioQuito) setEnvioProvincia(false); // solo uno a la vez
          }}
        >
          <View style={[styles.cuadroCheck, envioQuito && styles.cuadroCheckSeleccionado]} />
        </TouchableOpacity>
        <Text style={styles.checkboxTexto}>Quito + $4</Text>
      </View>

      <View style={styles.checkboxFila}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            setEnvioProvincia(!envioProvincia);
            if (envioQuito && !envioProvincia) setEnvioQuito(false); // solo uno a la vez
          }}
        >
          <View style={[styles.cuadroCheck, envioProvincia && styles.cuadroCheckSeleccionado]} />
        </TouchableOpacity>
        <Text style={styles.checkboxTexto}>Provincia + $6</Text>
      </View>

      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>

      <Text style={styles.titulo}>Forma de Pago</Text>
      <View style={styles.checkboxFila}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setFormaPago(formaPago === 'efectivo' ? '' : 'efectivo')}
        >
          <View style={[styles.cuadroCheck, formaPago === 'efectivo' && styles.cuadroCheckSeleccionado]} />
        </TouchableOpacity>
        <Text style={styles.checkboxTexto}>Efectivo</Text>
      </View>

      <View style={styles.checkboxFila}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setFormaPago(formaPago === 'transferencia' ? '' : 'transferencia')}
        >
          <View style={[styles.cuadroCheck, formaPago === 'transferencia' && styles.cuadroCheckSeleccionado]} />
        </TouchableOpacity>
        <Text style={styles.checkboxTexto}>Transferencia</Text>
      </View>

      {formaPago === 'transferencia' && (
        <View style={styles.comprobanteContainer}>
          <Text style={styles.label}>Subir Comprobante</Text>
          <TouchableOpacity style={styles.botonSubir}>
            <Text style={styles.textoBoton}>Seleccionar archivo</Text>
          </TouchableOpacity>
        </View>
      )}

        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.botonComprar}>
        <Text style={[styles.textoBoton, { marginTop: 0 }]}>Finalizar Compra</Text>
        </TouchableOpacity>
        <CompraExitosaModal
          visible={modalVisible}
          onClose={handleCloseModal}
        />
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  botonPedidos: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  textoBoton: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  titulo: {
    fontSize: 20,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  tabla: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    marginBottom: 12,
  },
  filaTabla: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  filaHeader: {
    backgroundColor: '#222',
  },
  celda: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  celdaNombre: {
    flex: 2,
  },
  subtotal: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  checkboxFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 10,
  },
  cuadroCheck: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  cuadroCheckSeleccionado: {
    backgroundColor: '#FFD700',
  },
  checkboxTexto: {
    color: '#fff',
    fontSize: 16,
  },
  total: {
    fontSize: 18,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  comprobanteContainer: {
    marginTop: 10,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  botonSubir: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonComprar: {
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});
