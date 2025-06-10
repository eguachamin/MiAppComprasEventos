// app.config.ts
import type { ExpoConfig } from 'expo/config';

type CustomExpoConfig = ExpoConfig & {
    projectId?: string;
};

const config: CustomExpoConfig = {
    name: "miappcompraseventos",
    slug: "miappcompraseventos",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    splash: {
        image: "./assets/images/splash-icon.png",
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
        adaptiveIcon: {
            foregroundImage: "./assets/images/adaptive-icon.png",
            backgroundColor: "#FFFFFF"
        }
    },
    web: {
        favicon: "./assets/images/favicon.png"
    },
    projectId: "14dcf9bb-c544-4c6a-81ac-da6982929b55", // Ahora sí es válido
};

export default config;