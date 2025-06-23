// app.config.ts
import type { ExpoConfig } from 'expo/config';
import 'dotenv/config';

type CustomExpoConfig = ExpoConfig & {
    projectId?: string;
};

const config: CustomExpoConfig = {
    name: "Vinilos Edwin DJ",
    slug: "tesiseguachaminapp",
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
        package: "com.tatiana97.tesiseguachaminapp",
        googleServicesFile: "./firebase/google-services.json",
        adaptiveIcon: {
            foregroundImage: "./src/assets/images/imagenapk.png",
            backgroundColor: "#FFFFFF"
        },
        permissions: [
            "INTERNET",
            "POST_NOTIFICATIONS"
            
        ]
    },
    web: {
        favicon: "./src/assets/images/favicon.png"
    },
    extra: {
        eas: {
            projectId: "179f9a10-a566-4fe3-b9a8-4abb4e35f04f"
        }
    },
    plugins: [
        "expo-web-browser",
        [
        "expo-build-properties",
            {
                android: {
                    googleServicesFile: "./firebase/google-services.json"
                }
            }
        ]
    ]
};

export default config;

