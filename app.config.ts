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
    icon: "../assets/images/icon.png",
    splash: {
        image: "../assets/images/splash-icon.png",
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
            foregroundImage: "../assets/images/adaptive-icon.png",
            backgroundColor: "#FFFFFF"
        }
    },
    web: {
        favicon: "../assets/images/favicon.png"
    },
    extra: {
        eas: {
            projectId: "dc3c2932-9022-4cd7-83c6-469023f12004"
        }
    }
};

export default config;
