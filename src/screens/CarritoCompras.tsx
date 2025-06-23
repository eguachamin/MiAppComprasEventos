import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Platform,
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
  finalizarCompraEnBackend,
} from "@/services/carritoService";
import { validateCedulaOrRUC } from '../utils/validators'


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
  const [error, setError] = useState("");
  //Subir Documentos
  const [comprobante, setComprobante] = useState<string | null>(null);
  // Informacion del cliente
  const [nombre, setNombre] = useState("");
  const [idCliente, setIdCliente]=useState("")
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

  
const handleCedulaChange = (text: string) => {
  const soloNumeros = text.replace(/[^0-9]/g, "");

  if (soloNumeros.length <= 13) { // máximo para RUC
    setCedula(soloNumeros);
    const result = validateCedulaOrRUC(soloNumeros);
    if (result !== true) {
      setError(result);
    } else {
      setError("");
    }
  }
};

  const seleccionarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: false,
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

  const vaciarCarrito = async () => {
    try {
    if (!carrito || carrito.productos.length === 0) return;

    // Elimina uno a uno
    for (const item of carrito.productos) {
      try {
        await eliminarProductoDelCarrito(item.producto._id);
      } catch (error) {
        console.warn(`Error al eliminar producto ${item.producto._id}:`, error);
      }
    }

    // Recargar carrito desde el backend
    const updatedCarrito = await obtenerCarrito();
    setCarrito(updatedCarrito);

    // Actualizar productos simples
    const productosSimples = updatedCarrito.productos.map((p) => ({
      id: p.producto._id,
      nombre: p.producto.nombreDisco,
      cantidad: p.cantidad,
      precio: p.producto.precio,
    }));
    setProductos(productosSimples);

    // Mostrar mensaje de éxito
    setModalMensajeTexto("Carrito vaciado con éxito");
    setModalMensajeTipo("exito");
    setModalMensajeVisible(true);
    setTimeout(() => setModalMensajeVisible(false), 3000);
  } catch (error) {
    console.error("Error al vaciar el carrito:", error);
    setModalMensajeTexto("Error al vaciar el carrito");
    setModalMensajeTipo("error");
    setModalMensajeVisible(true);
    setTimeout(() => setModalMensajeVisible(false), 3000);
  }
  };
  const handleCloseModal = () => {
    setModalCompraExitosaVisible(false);
    route.push("/pedidos");
  };
  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };
  const finalizarCompra = async () => {
  const cedulaValida = validateCedulaOrRUC(cedula);

  // ✅ Validación: carrito vacío
  if (!carrito || !carrito.productos?.length) {
    setModalMensajeTexto("No hay productos en el carrito");
    setModalMensajeVisible(true);
    return;
  }

  // ✅ Validación: stock suficiente
  const hayStockSuficiente = carrito.productos.every(
    (item) => item.cantidad <= item.producto.stock
  );

  if (!hayStockSuficiente) {
    setModalMensajeTexto("Hay productos cuya cantidad excede el stock disponible");
    setModalMensajeVisible(true);
    return;
  }

  // ✅ Validación: opción de envío seleccionada
  if (envioProvincia === false && !zonaSurServientre && !zonaOtra) {
    setModalMensajeTexto("Debes seleccionar una opción de envío antes de continuar.");
    setModalMensajeVisible(true);
    return;
  }

  // ✅ Validaciones para provincia
  if (envioProvincia) {
    if (!cedula || !cedulaValida) {
      setModalMensajeTexto("Debe ingresar una cédula o RUC válido");
      setModalMensajeVisible(true);
      return;
    }
    if (!nombreRecibe) {
      setModalMensajeTexto("Debe ingresar el nombre y apellidos de la persona que recibe");
      setModalMensajeVisible(true);
      return;
    }
    if (!nombre) {
      setModalMensajeTexto("Debe ingresar el nombre del titular de la cuenta");
      setModalMensajeVisible(true);
      return;
    }
    if (formaPago === "transferencia" && !comprobante) {
      setModalMensajeTexto("Debe subir el comprobante de transferencia");
      setModalMensajeVisible(true);
      return;
    }
  }

  // ✅ Validaciones para Quito - zona sur (con Servientrega)
  if (!envioProvincia && zonaSurServientre) {
    if (!cedula || !cedulaValida) {
      setModalMensajeTexto("Debe ingresar una cédula o RUC válido");
      setModalMensajeVisible(true);
      return;
    }
    if (!nombreRecibe) {
      setModalMensajeTexto("Debe ingresar el nombre y apellidos de la persona que recibe");
      setModalMensajeVisible(true);
      return;
    }
    if (!nombre) {
      setModalMensajeTexto("Debe ingresar el nombre del titular de la cuenta");
      setModalMensajeVisible(true);
      return;
    }
    const direccionIncompleta = [
      callePrincipal,
      calleSecundaria,
      numeracion,
      referencia,
      provincia,
      ciudad,
    ].some((campo) => !campo);
    if (direccionIncompleta) {
      setModalMensajeTexto("Debe completar todos los campos de dirección");
      setModalMensajeVisible(true);
      return;
    }
    if (formaPago === "transferencia" && !comprobante) {
      setModalMensajeTexto("Debe subir el comprobante de transferencia");
      setModalMensajeVisible(true);
      return;
    }
  }

  // ✅ Validación adicional para comprobante en pago en efectivo
  if (formaPago === "efectivo" && comprobante) {
    setModalMensajeTexto("No debe subir comprobante si va a pagar en efectivo");
    setModalMensajeVisible(true);
    return;
  }

  const formaPagoFinal = envioProvincia || zonaSurServientre ? "transferencia" : "efectivo";
  const requiereDatosEnvio = envioProvincia || zonaSurServientre;
  const zonaEnvio = envioProvincia ? "provincia" : "quito";

  let metodoEnvio = "encuentro-publico";
  let costoEnvio = 0;

  if (envioProvincia) {
    metodoEnvio = "servientrega";
    costoEnvio = 6;
  } else if (zonaSurServientre) {
    metodoEnvio = "servientrega";
    costoEnvio = 3;
  }

  const pedido = {
    cliente: idCliente,
    productos: carrito.productos.map((item) => ({
      producto: item.producto._id,
      cantidad: item.cantidad,
      nombre: item.producto.nombreDisco,
      precio: item.producto.precio,
    })),
    direccion: requiereDatosEnvio
      ? {
          callePrincipal,
          calleSecundaria,
          numeracion,
          referencia,
          provincia,
          ciudad,
          cedula,
          nombreRecibe,
        }
      : null,
    zonaEnvio,
    metodoEnvio,
    costoEnvio,
    formaPago: formaPagoFinal,
    nombre,
    telefono,
    comprobantePago: comprobante || null,
    total: carrito.total,
  };

  const formData = new FormData();
  formData.append("zonaEnvio", pedido.zonaEnvio);
  formData.append("metodoEnvio", pedido.metodoEnvio);
  formData.append("formaPago", pedido.formaPago);

  if (pedido.direccion) {
    formData.append("direccionEnvio", JSON.stringify(pedido.direccion));
  }

  if (pedido.comprobantePago) {
    let file;
    if (pedido.comprobantePago.startsWith("data:image")) {
      file = dataURLtoFile(pedido.comprobantePago, "comprobante.jpg");
    } else {
      const uriParts = pedido.comprobantePago.split(".");
      const fileType = uriParts[uriParts.length - 1];
      file = {
        uri: pedido.comprobantePago,
        name: `comprobante.${fileType}`,
        type: `image/${fileType}`,
      };
    }
    formData.append("comprobantePago", file as any);
  }

  try {
    const resultado = await finalizarCompraEnBackend(formData);
    console.log("Compra exitosa:", resultado);
    setModalCompraExitosaVisible(true);

    // 🧹 Limpiar estados
    setCarrito({ ...carrito, productos: [], total: 0 });
    setProductos([]);
    setCedula("");
    setNombreRecibe("");
    setComprobante(null);
    setZonaSurServientre(false);
    setEnvioQuito(false);
    setEnvioProvincia(false);
    setZonaOtra(false);
    setFormaPago("");
  } catch (error: any) {
    console.error("Error al finalizar compra:", error);
    const msg = error?.response?.data?.msg || error?.message || "Ocurrió un error al procesar la compra";
    setModalMensajeTexto(msg);
    setModalMensajeVisible(true);
  }
};

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <Text style={styles.titulo}>Mi Carrito</Text>
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

      {envioProvincia && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Número de Cédula"
            placeholderTextColor="#aaa"
            value={cedula}
            onChangeText={handleCedulaChange}
            keyboardType="numeric"
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Nombre y Apellidos de la persona que recibe"
            placeholderTextColor="#aaa"
            value={nombreRecibe}
            onChangeText={setNombreRecibe}
            keyboardType="default"
          />
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
        </>
      )}

      {zonaSurServientre && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Número de Cédula"
            placeholderTextColor="#aaa"
            value={cedula}
            onChangeText={handleCedulaChange}
            keyboardType="numeric"
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Nombre y Apellidos de la persona que recibe"
            placeholderTextColor="#aaa"
            value={nombreRecibe}
            onChangeText={setNombreRecibe}
            keyboardType="default"
          />
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
          ))}{" "}
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
            <Text style={styles.checkboxTexto}>Servientrega +$3.50</Text>
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
              <TouchableOpacity
                style={styles.botonSubir}
                onPress={seleccionarImagen}
              >
                <Text style={styles.textoBoton}>Seleccionar archivo</Text>
              </TouchableOpacity>
              {comprobante && (
                <Image
                  source={{ uri: comprobante }}
                  style={{
                    width: 150,
                    height: 150,
                    borderRadius: 10,
                    marginTop: 10,
                  }}
                  resizeMode="contain"
                />
              )}
            </View>
          )}

          {zonaOtra && (
            <>
              <View style={styles.mensajeCoordinacionContainer}>
                <Text style={styles.mensajeCoordinacion}>
                  Al finalizar tu compra, te ayudaremos a coordinar
                  personalmente el día, la hora y el lugar para encontrarnos en
                  un espacio público seguro y conveniente para ambos.
                </Text>
              </View>
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
          <TouchableOpacity
            style={styles.botonSubir}
            onPress={seleccionarImagen}
          >
            <Text style={styles.textoBoton}>Seleccionar archivo</Text>
          </TouchableOpacity>
          {comprobante && (
            <Image
              source={{ uri: comprobante }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 10,
                marginTop: 10,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      )}

      {/* TOTAL GENERAL */}
      <View style={styles.totalContainer}>
        <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity
        onPress={() => setProductos([])}
        style={[styles.botonPedidos, { backgroundColor: "red" }]}
      >
        <Text
          style={[styles.textoBoton, { color: "#fff" }]}
          onPress={vaciarCarrito}
        >
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
  errorText: {
    color: "red",
    marginTop: 4,
  },
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
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
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
    margin:15,
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
    marginBottom: 20,
    padding: 10,
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
  mensajeCoordinacionContainer: {
    backgroundColor: "#1a1a1a", // fondo oscuro elegante como los inputs
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FFD700", // borde dorado
    marginBottom: 20,
  },

  mensajeCoordinacion: {
    color: "#FFD700", // texto dorado
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
  inputError: {
    borderColor: "red",
  },
});
