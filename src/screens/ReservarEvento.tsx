import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-date-picker';
import RNPickerSelect from 'react-native-picker-select';
import { useAuthStore } from '../store/authStore';
import { checkReservationExists, enviarCotizacion } from '../services/auth';

export default function ReservarEvento() {
  const token = useAuthStore((state) => state.token || 'FAKE_TOKEN_PARA_PRUEBAS');
  const isHydrated = useAuthStore((state) => state.isHydrated); // NUEVO

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState({ callePrincipal: '', calleSecundaria: '', numeroCasa: '', referencia: '' });
  const [eventType, setEventType] = useState('');
  const [customEvent, setCustomEvent] = useState('');
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [comments, setComments] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [openTime, setOpenTime] = useState(false);
  const [contractHours, setContractHours] = useState('');

  const serviceOptions = [
    { label: 'Luces', value: 'luces' },
    { label: 'Parlantes', value: 'parlantes' },
    { label: 'Pantallas LED', value: 'pantallas' },
    { label: 'DJ Adicional', value: 'dj_adicional' },
  ];

  const eventOptions = [
    { label: 'Boda', value: 'boda' },
    { label: 'Cumpleaños', value: 'cumpleaños' },
    { label: 'Graduación', value: 'graduacion' },
    { label: 'Otro', value: 'otro' },
  ];

  if (!isHydrated) {
    return <Text>Cargando datos de sesión...</Text>;
  }

  const handleSubmit = async () => {
    if (!token) {
      Alert.alert('Error de sesión', 'No se encontró el token. Por favor inicia sesión nuevamente.');
      return;
    }

    Alert.alert(
      'Confirmar Cotización',
      '¿Estás seguro de enviar esta solicitud de cotización?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, enviar',
          onPress: async () => {
            try {
              const cotizacionData = {
                name,
                email,
                phone,
                address,
                eventType: eventType === 'otro' ? customEvent : eventType,
                additionalServices,
                contactName,
                contactPhone,
                comments,
                eventDate: eventDate.toISOString(),
                startTime: startTime.toISOString(),
                contractHours,
              };

              console.log('Enviando datos al backend:', cotizacionData);
              const isoDate = eventDate.toISOString().split('T')[0];
              const isoTime = startTime.toISOString().substring(11, 16);

              const exists = await checkReservationExists(isoDate, isoTime, token);
              if (exists) {
                Alert.alert(
                  'Ya existe una reservación',
                  'Hay una reserva en la misma fecha y hora que has seleccionado.'
                );
                return;
              }

              const response = await enviarCotizacion(cotizacionData, token);

              if (response.status === 201 || response.status === 200) {
                Alert.alert(
                  'Cotización enviada',
                  'Tu cotización ha sido enviada. Recibirás una notificación cuando el administrador actualice el precio.'
                );
              } else {
                Alert.alert('Error', 'Hubo un problema al enviar tu cotización.');
              }
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Ocurrió un error al enviar la cotización. Intenta nuevamente.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Reservar Evento</Text>

      <Text>Nombre:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text>Teléfono:</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Text>Calle Principal:</Text>
      <TextInput style={styles.input} value={address.callePrincipal} onChangeText={(text) => setAddress({ ...address, callePrincipal: text })} />

      <Text>Calle Secundaria:</Text>
      <TextInput style={styles.input} value={address.calleSecundaria} onChangeText={(text) => setAddress({ ...address, calleSecundaria: text })} />

      <Text>Número de Casa:</Text>
      <TextInput style={styles.input} value={address.numeroCasa} onChangeText={(text) => setAddress({ ...address, numeroCasa: text })} />

      <Text>Referencia:</Text>
      <TextInput style={styles.input} value={address.referencia} onChangeText={(text) => setAddress({ ...address, referencia: text })} />

      <Text>Fecha del Evento:</Text>
      {Platform.OS !== 'web' ? (
        <>
          <Button title="Seleccionar Fecha" onPress={() => setOpenDate(true)} />
          <DatePicker
            modal
            open={openDate}
            date={eventDate}
            mode="date"
            onConfirm={(date) => {
              setOpenDate(false);
              setEventDate(date);
            }}
            onCancel={() => setOpenDate(false)}
            
          />
        </>
      ) : (
        <input
          type="date"
          value={eventDate.toISOString().substring(0, 10)}
          onChange={(e) => setEventDate(new Date(e.target.value))}
        />
      )}

      <Text>Hora de Inicio:</Text>
      {Platform.OS !== 'web' ? (
        <>
          <Button title="Seleccionar Hora" onPress={() => setOpenTime(true)} />
          <DatePicker
            modal
            open={openTime}
            date={startTime}
            mode="time"
            onConfirm={(date) => {
              setOpenTime(false);
              setStartTime(date);
            }}
            onCancel={() => setOpenTime(false)}
          />
        </>
      ) : (
        <input
          type="time"
          value={startTime.toISOString().substring(11, 16)}
          onChange={(e) => {
            const [hours, minutes] = e.target.value.split(':').map(Number);
            const newDate = new Date(startTime);
            newDate.setHours(hours, minutes);
            setStartTime(newDate);
          }}
        />
      )}

      <Text>Número de Horas de Contrato:</Text>
      <TextInput
        style={styles.input}
        value={contractHours}
        onChangeText={setContractHours}
        keyboardType="numeric"
      />

      <Text>Tipo de Evento:</Text>
      <RNPickerSelect
        onValueChange={(value) => setEventType(value)}
        items={eventOptions}
        placeholder={{ label: 'Selecciona un tipo de evento...', value: null }}
      />

      {eventType === 'otro' && (
        <TextInput
          style={styles.input}
          placeholder="Especifica el tipo de evento"
          value={customEvent}
          onChangeText={setCustomEvent}
        />
      )}

      <Text>Servicios Adicionales:</Text>
      <RNPickerSelect
        onValueChange={(value) => setAdditionalServices([value])}
        items={serviceOptions}
        placeholder={{ label: 'Selecciona un servicio...', value: null }}
      />

      <Text>Nombre Contacto Adicional:</Text>
      <TextInput style={styles.input} value={contactName} onChangeText={setContactName} />

      <Text>Teléfono Contacto Adicional:</Text>
      <TextInput style={styles.input} value={contactPhone} onChangeText={setContactPhone} keyboardType="phone-pad" />

      <Text>Comentarios:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        numberOfLines={4}
        value={comments}
        onChangeText={setComments}
      />

      <Button title="Enviar Solicitud de Cotización" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});