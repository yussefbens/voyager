import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "ma.jmaa",
  appName: "Jma'a",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    Keyboard: {
      resizeOnFullScreen: true,
    },
  },
};

export default config;
