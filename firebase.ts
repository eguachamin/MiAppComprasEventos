import { config } from 'dotenv';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/auth';
import perf from '@react-native-firebase/perf';

// Cargar variables de entorno
config();

// Inicializa Firebase solo si no se ha inicializado antes
if (!firebase.apps.length) {
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID
    };

    firebase.initializeApp(firebaseConfig);
}

export { firebase, perf };