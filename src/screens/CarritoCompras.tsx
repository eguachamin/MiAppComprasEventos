import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CompraExitosaModal from "../components/modals/CompraExistosaModal"; // ajusta el path si es necesario
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../store/authStore";
import { obtenerDetalleCliente } from "../services/userService";
import ModalMensaje from "@/components/modals/ModalMensaje";
import {
  obtenerCarrito,
  Carrito,
  actualizarCantidadProducto,
  eliminarProductoDelCarrito,
} from "@/services/carritoService";

type ProductoCarrito = {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
};

export default function CarritoCompras() {
  //Para cambiar de página
  const route = useRouter();
  // Modales
  const [modalMensajeVisible, setModalMensajeVisible] = useState(false);
  const [modalMensajeTexto, setModalMensajeTexto] = useState("");
  const [modalMensajeTipo, setModalMensajeTipo] = useState<"exito" | "error">(
    "exito"
  );
  const [modalCompraExitosaVisible, setModalCompraExitosaVisible] =
    useState(false);
  //Subir Documentos
  const [comprobante, setComprobante] = useState<string | null>(null);
  // Informacion del cliente
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  //Informacion de direccion
  const [callePrincipal, setCallePrincipal] = useState("");
  const [calleSecundaria, setCalleSecundaria] = useState("");
  const [numeracion, setNumeracion] = useState("");
  const [referencia, setReferencia] = useState("");
  const [provincia, setProvincia] = useState("");
  const [ciudad, setCiudad] = useState("");
  //Informacion para el envio
  const [cedula, setCedula] = useState("");
  const [nombreRecibe, setNombreRecibe] = useState("");
  //Informacio de Productos
  const [productos, setProductos] = useState<ProductoCarrito[]>([]);
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  //Informacion y checkbox de Envio
  const [envioQuito, setEnvioQuito] = useState(false);
  const [envioProvincia, setEnvioProvincia] = useState(false);
  const [zonaSurServientre, setZonaSurServientre] = useState(false);
  const [zonaOtra, setZonaOtra] = useState(false);
  // Forma de pago cuando encuentro en lugar público
  const [formaPago, setFormaPago] = useState<"" | "efectivo" | "transferencia">(
    ""
  );
  //Estados en valores
  const [total, setTotal] = useState(0); // Total base sin envío
  const [subtotal, setSubtotal] = useState(0);
  //Verificar
  const [nombreTitular, setNombreTitular] = useState("");
  const [apellidosTitular, setApellidosTitular] = useState("");

  // Calcula el costo de envío según selección
  const costoEnvioQuito = zonaSurServientre ? 3.5 : 0; // solo Sur Servientre +$3.50
  const costoEnvioProvincia = 6;
  // Calcula total dinámico
  const totalConEnvio = envioQuito
    ? subtotal + costoEnvioQuito
    : envioProvincia
    ? subtotal + costoEnvioProvincia
    : subtotal;

  useEffect(() => {
    const cargarDatosCliente = async () => {
      try {
        const datos = await obtenerDetalleCliente(); // Usa el token internamente
        setNombre(datos.nombre);
        setTelefono(datos.telefono);
        setCorreo(datos.email);
      } catch (error) {
        console.error("Error al cargar datos del cliente", error);
      }
    };

    cargarDatosCliente();
  }, []);

  useEffect(() => {
    const fetchCarrito = async () => {
      try {
        const data = await obtenerCarrito();
        setCarrito(data); // por si necesitas otros datos como el total

        const productosFormateados = data.productos.map((item) => ({
          id: item.producto._id,
          nombre: item.producto.nombreDisco,
          cantidad: item.cantidad,
          precio: item.producto.precio,
        }));

        setProductos(productosFormateados);
      } catch (error) {
        console.error("Error al obtener el carrito:", error);
      }
    };

    fetchCarrito();
  }, []);

  useEffect(() => {
    const nuevoSubtotal = productos.reduce((acc, item) => {
    return acc + item.precio * item.cantidad;
  }, 0);
  setSubtotal(nuevoSubtotal);
}, [productos]);

  useEffect(() => {
    const costoEnvio =
      envioQuito && zonaSurServientre ? 3.5 : envioProvincia ? 6 : 0;

    setTotal(subtotal + costoEnvio);
  }, [subtotal, envioQuito, envioProvincia, zonaSurServientre]);

  //Funciones 
  const seleccionarImagen = async () => {
      const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images', 
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64:false,
    });

    if (!resultado.canceled) {
      setComprobante(resultado.assets[0].uri);
      console.log("URI del comprobante:", resultado.assets[0].uri);
    }
  };

  const actualizarCantidad = async (index: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    const producto = productos[index];

    try {
      await actualizarCantidadProducto(productos[index].id, nuevaCantidad);
      const nuevosProductos = [...productos];
      nuevosProductos[index].cantidad = nuevaCantidad;
      setProductos(nuevosProductos);
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
    }
  };

  const eliminarProducto = async (productoId: string) => {
    try {
      await eliminarProductoDelCarrito(productoId);

      if (!carrito) return;

      // Filtra los productos del carrito (estructura backend)
      const nuevosProductos = carrito.productos.filter(
        (p) => p.producto._id !== productoId
      );

      // Calcula el nuevo total
      const nuevoTotal = nuevosProductos.reduce(
        (acc, item) => acc + item.producto.precio * item.cantidad,
        0
      );

      // Actualiza el estado carrito con la nueva lista y total
      setCarrito({
        ...carrito,
        productos: nuevosProductos,
        total: nuevoTotal,
      });

      // Actualiza el estado productos simple para la UI
      const productosSimples = nuevosProductos.map((p) => ({
        id: p.producto._id,
        nombre: p.producto.nombreDisco,
        cantidad: p.cantidad,
        precio: p.producto.precio,
      }));

      setProductos(productosSimples);

      setModalMensajeTexto("Producto eliminado del carrito");
      setModalMensajeTipo("exito");
      setModalMensajeVisible(true);
      setTimeout(() => setModalMensajeVisible(false), 3000);
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);

      setModalMensajeTexto("No se pudo eliminar el producto");
      setModalMensajeTipo("error");
      setModalMensajeVisible(true);
      setTimeout(() => setModalMensajeVisible(false), 3000);
    }
  };

  const handleCloseModal = () => {
    setModalCompraExitosaVisible(false);
    route.push("/pedidos");
  };

  const finalizarCompra = () => {
    if (
      !nombre ||
      !telefono ||
      !correo ||
      !callePrincipal ||
      !provincia ||
      !ciudad ||
      !formaPago
    ) {
      setModalMensajeTexto("Por favor, complete todos los campos obligatorios");
      setModalMensajeVisible(true);
      return;
    }

    if (envioProvincia) {
      if (!cedula) {
        setModalMensajeTexto(
          "Debe ingresar su número de cédula para envíos a provincia"
        );
        setModalMensajeVisible(true);
        return;
      }
      if (!nombreRecibe) {
        setModalMensajeTexto(
          "Debe ingresar el nombre y apellidos de la persona que recibe"
        );
        setModalMensajeVisible(true);
        return;
      }
      if (!nombreTitular || !apellidosTitular) {
        setModalMensajeTexto(
          "Debe ingresar nombre y apellidos del titular de la cuenta"
        );
        setModalMensajeVisible(true);
        return;
      }
      if (formaPago === "transferencia" && !comprobante) {
        setModalMensajeTexto("Debe subir el comprobante de transferencia");
        setModalMensajeVisible(true);
        return;
      }
      // Validar que el carrito esté disponible
      if (!carrito || !carrito.productos?.length) {
        setModalMensajeTexto("No hay productos en el carrito");
        setModalMensajeVisible(true);
        return;
      }

      // Validar que las cantidades no excedan el stock
      const hayStockSuficiente = carrito.productos.every(
        (item) => item.cantidad <= item.producto.stock
      );

      if (!hayStockSuficiente) {
        setModalMensajeTexto(
          "Hay productos cuya cantidad excede el stock disponible"
        );
        setModalMensajeVisible(true);
        return;
      }

      try {
        // Construir los datos del pedido
        const pedido = {
          productos: carrito.productos.map((item) => ({
            producto: item.producto._id,
            cantidad: item.cantidad,
          })),
          direccion: {
            callePrincipal,
            calleSecundaria,
            numeracion,
            referencia,
            provincia,
            ciudad,
          },
          envioProvincia,
          cedula: envioProvincia ? cedula : null,
          nombreRecibe: envioProvincia ? nombreRecibe : null,
          formaPago,
          nombreTitular,
          apellidosTitular,
          comprobante, // si es transferencia, subirlo antes y enviar solo la URL
          total: carrito.total,
        };

        // Mostrar modal de éxito
        setModalCompraExitosaVisible(true);

        // (Opcional) Vaciar el carrito después de compra exitosa
        // await vaciarCarrito();
      } catch (error) {
        console.error("Error al finalizar compra:", error);
        setModalMensajeTexto("Ocurrió un error al procesar la compra");
        setModalMensajeVisible(true);
      }
    }
  };
  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <TouchableOpacity
        onPress={() => route.push("/pedidos")}
        style={styles.botonPedidos}
      >
        <Text style={[styles.textoBoton, { marginTop: 0 }]}>Mis Pedidos</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Datos del Comprador</Text>
      {[
        {
          label: "Nombre",
          value: nombre,
          setter: setNombre,
          keyboardType: "default",
        },
        {
          label: "Teléfono",
          value: telefono,
          setter: setTelefono,
          keyboardType: "phone-pad",
        },
        {
          label: "Correo",
          value: correo,
          setter: setCorreo,
          keyboardType: "email-address",
        },
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

      <Text style={styles.titulo}>Dirección de Entrega</Text>

      {[
        {
          label: "Calle Principal",
          value: callePrincipal,
          setter: setCallePrincipal,
        },
        {
          label: "Calle Secundaria",
          value: calleSecundaria,
          setter: setCalleSecundaria,
        },
        { label: "Numeración", value: numeracion, setter: setNumeracion },
        { label: "Referencia", value: referencia, setter: setReferencia },
        { label: "Provincia", value: provincia, setter: setProvincia },
        { label: "Ciudad", value: ciudad, setter: setCiudad },
      ].map(({ label, value, setter }) => (
        <TextInput
          key={label}
          style={styles.input}
          placeholder={label}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={setter}
        />
      ))}

      {envioProvincia && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Número de Cédula"
            placeholderTextColor="#aaa"
            value={cedula}
            onChangeText={setCedula}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre y Apellidos de la persona que recibe"
            placeholderTextColor="#aaa"
            value={nombreRecibe}
            onChangeText={setNombreRecibe}
            keyboardType="default"
          />
        </>
      )}

      {productos.map((producto, index) => (
        <View key={producto.id} style={styles.filaTabla}>
          <Text style={[styles.celda, styles.celdaNombre]}>
            {producto.nombre}
          </Text>

          <View
            style={[
              styles.celda,
              { flexDirection: "row", alignItems: "center" },
            ]}
          >
            <TouchableOpacity
              onPress={() => actualizarCantidad(index, producto.cantidad - 1)}
              style={{ marginRight: 5 }}
            >
              <Text style={{ color: "#FFD700", fontWeight: "bold" }}>-</Text>
            </TouchableOpacity>
            <Text style={{ color: "#fff" }}>{producto.cantidad}</Text>
            <TouchableOpacity
              onPress={() => actualizarCantidad(index, producto.cantidad + 1)}
              style={{ marginLeft: 5 }}
            >
              <Text style={{ color: "#FFD700", fontWeight: "bold" }}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.celda}>${producto.precio.toFixed(2)}</Text>

          <TouchableOpacity onPress={() => eliminarProducto(producto.id)}>
            <Text style={{ color: "red", fontWeight: "bold" }}>X</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.subtotal}>Subtotal: ${subtotal.toFixed(2)}</Text>

      <Text style={styles.titulo}>Envío</Text>

      {/* OPCIÓN QUITO */}
      <View style={styles.checkboxFila}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            setEnvioQuito(true);
            setEnvioProvincia(false);
            setZonaSurServientre(false);
            setZonaOtra(false);
            setFormaPago("");
          }}
        >
          <View
            style={[
              styles.cuadroCheck,
              envioQuito && styles.cuadroCheckSeleccionado,
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.checkboxTexto}>Quito</Text>
      </View>

      {/* OPCIONES DENTRO DE QUITO */}
      {envioQuito && (
        <View style={styles.seccionInterna}>
          <View style={styles.checkboxFila}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => {
                setZonaSurServientre(!zonaSurServientre);
                if (!zonaSurServientre) {
                  setZonaOtra(false);
                  setFormaPago("");
                }
              }}
            >
              <View
                style={[
                  styles.cuadroCheck,
                  zonaSurServientre && styles.cuadroCheckSeleccionado,
                ]}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxTexto}>Servientrega (Sur) +$3.50</Text>
          </View>

          <View style={styles.checkboxFila}>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => {
                setZonaOtra(!zonaOtra);
                if (!zonaOtra) {
                  setZonaSurServientre(false);
                  setFormaPago("");
                }
              }}
            >
              <View
                style={[
                  styles.cuadroCheck,
                  zonaOtra && styles.cuadroCheckSeleccionado,
                ]}
              />
            </TouchableOpacity>
            <Text style={styles.checkboxTexto}>Encuentro en lugar público</Text>
          </View>

          {zonaSurServientre && (
            <View style={styles.comprobanteContainer}>
              <Text style={styles.label}>Subir Comprobante de Pago</Text>
              <TouchableOpacity style={styles.botonSubir} onPress={seleccionarImagen}>
                <Text style={styles.textoBoton}>Seleccionar archivo</Text>
              </TouchableOpacity>
            </View>
          )}

          {zonaOtra && (
            <>
              <Text style={styles.titulo}>Forma de Pago</Text>

              <View style={styles.checkboxFila}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() =>
                    setFormaPago(formaPago === "efectivo" ? "" : "efectivo")
                  }
                >
                  <View
                    style={[
                      styles.cuadroCheck,
                      formaPago === "efectivo" &&
                        styles.cuadroCheckSeleccionado,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.checkboxTexto}>Efectivo</Text>
              </View>

              <View style={styles.checkboxFila}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() =>
                    setFormaPago(
                      formaPago === "transferencia" ? "" : "transferencia"
                    )
                  }
                >
                  <View
                    style={[
                      styles.cuadroCheck,
                      formaPago === "transferencia" &&
                        styles.cuadroCheckSeleccionado,
                    ]}
                  />
                </TouchableOpacity>
                <Text style={styles.checkboxTexto}>Transferencia</Text>
              </View>

              {formaPago === "transferencia" && (
                <View style={styles.comprobanteContainer}>
                  <Text style={styles.label}>Subir Comprobante</Text>
                  <TouchableOpacity style={styles.botonSubir} onPress={seleccionarImagen}>
                    <Text style={styles.textoBoton}>Seleccionar archivo</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      )}

      {/* OPCIÓN PROVINCIA */}
      <View style={styles.checkboxFila}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => {
            setEnvioProvincia(true);
            setEnvioQuito(false);
            setZonaSurServientre(false);
            setZonaOtra(false);
            setFormaPago("");
          }}
        >
          <View
            style={[
              styles.cuadroCheck,
              envioProvincia && styles.cuadroCheckSeleccionado,
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.checkboxTexto}>Provincia + $6</Text>
      </View>

      {envioProvincia && (
        <View style={styles.comprobanteContainer}>
          <Text style={styles.label}>Subir Comprobante de Pago</Text>
          <TouchableOpacity style={styles.botonSubir} onPress={seleccionarImagen}>
            <Text style={styles.textoBoton}>Seleccionar archivo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TOTAL GENERAL */}
      <View style={styles.totalContainer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      </View>
      <br />
      <TouchableOpacity
        onPress={() => setProductos([])}
        style={[styles.botonPedidos, { backgroundColor: "red" }]}
      >
        <Text style={[styles.textoBoton, { color: "#fff" }]}>
          Vaciar Carrito
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={finalizarCompra} style={styles.botonComprar}>
        <Text style={[styles.textoBoton, { marginTop: 0 }]}>
          Finalizar Compra
        </Text>
      </TouchableOpacity>

      {/* Modal para mostrar errores */}

      <ModalMensaje
        visible={modalMensajeVisible}
        tipo={modalMensajeTipo}
        mensaje={modalMensajeTexto}
        onClose={() => setModalMensajeVisible(false)}
      />

      {/* Modal para mostrar éxito */}
      <CompraExitosaModal
        visible={modalCompraExitosaVisible}
        onClose={handleCloseModal}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  botonPedidos: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  textoBoton: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#000",
  },
  titulo: {
    fontSize: 20,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#1a1a1a",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444",
  },
  tabla: {
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 8,
    marginBottom: 12,
  },
  filaTabla: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filaHeader: {
    backgroundColor: "#222",
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
  },
  subtotal: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  checkboxFila: {
    flexDirection: "row",
    alignItems: "center",
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
    borderColor: "#FFD700",
  },
  cuadroCheckSeleccionado: {
    backgroundColor: "#FFD700",
  },
  checkboxTexto: {
    color: "#fff",
    fontSize: 16,
  },
  total: {
    fontSize: 18,
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 20,
  },
  comprobanteContainer: {
    marginTop: 10,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
  },
  botonSubir: {
    backgroundColor: "#FFD700",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  botonComprar: {
    backgroundColor: "#FFD700",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  totalContainer: {
  marginTop: 20,
  padding: 15,
  backgroundColor: "#1a1a1a", // fondo negro elegante
  borderRadius: 10,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  borderColor: "#FFD700", // dorado brillante
},

seccionInterna: {
  paddingLeft: 20,
  marginTop: 10,
  marginBottom: 10,
  borderLeftWidth: 2,
  borderColor: "#FFD700", // dorado como marcador
},
});

