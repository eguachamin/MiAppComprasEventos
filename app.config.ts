// app.config.ts
import type { ExpoConfig } from 'expo/config';
import 'dotenv/config';

type CustomExpoConfig = ExpoConfig & {
    projectId?: string;
};

const config: CustomExpoConfig = {
    name: "Vinilos Edwin DJ",
    slug: "miappcompraseventos",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/imagenapk.png",
    splash: {
        image: "./src/assets/images/imagenapk.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff"
    },
    updates: {
        fallbackToCacheTimeout: 0
    },
    
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true
    },
    android: {
        package: "com.evelyn97.miappcompraseventos",
        adaptiveIcon: {
            foregroundImage: "./src/assets/images/imagenapk.png",
            backgroundColor: "#FFFFFF"
        },

        permissions: [
            "INTERNET"
        ]
        
    },
    plugins: [
        [
        "expo-build-properties",
        
        {
            android: {
                googleServicesFile: "./google-services.json"
            }
        }
        ],
        "@react-native-firebase/app",
        "@react-native-firebase/perf",
    ],
    web: {
        favicon: "./src/assets/images/favicon.png"
    },
    extra: {
        eas: {
            projectId: "dc3c2932-9022-4cd7-83c6-469023f12004"
        },
        firebase: {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            }
    }
    
};

export default config;
