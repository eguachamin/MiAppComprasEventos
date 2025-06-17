// app.config.ts
import type { ExpoConfig } from 'expo/config';


type CustomExpoConfig = ExpoConfig & {
    projectId?: string;
};

const config: CustomExpoConfig = {
    name: "Vinilos Edwin DJ",
    slug: "miappcompraseventos",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    splash: {
        image: "./src/assets/images/splash-icon.png",
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
            foregroundImage: "./src/assets/images/adaptive-icon.png",
            backgroundColor: "#FFFFFF"
        }
    },
    web: {
        favicon: "./src/assets/images/favicon.png"
    },
    extra: {
        eas: {
            projectId: "dc3c2932-9022-4cd7-83c6-469023f12004"
        }
    }
};

export default config;
