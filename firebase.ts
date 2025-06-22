import Constants from 'expo-constants';
import firebase from '@react-native-firebase/app';
import perf from '@react-native-firebase/perf';

const firebaseEnv = Constants.expoConfig?.extra?.firebase || {};

if (!firebase.apps.length) {
    firebase.initializeApp({
        apiKey: firebaseEnv.apiKey,
        authDomain: firebaseEnv.authDomain,
        projectId: firebaseEnv.projectId,
        storageBucket: firebaseEnv.storageBucket,
        messagingSenderId: firebaseEnv.messagingSenderId,
        appId: firebaseEnv.appId,
    });
}

export { perf };
