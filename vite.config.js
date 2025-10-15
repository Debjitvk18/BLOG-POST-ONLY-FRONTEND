// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss({
      config: {
        theme: {
          extend: {
            colors: {
              primaryDark: "#18230F",
              secondaryDark: "#27391C",
              primary: "#255F38",
              secondary: "#1F7D53",
              rgbPrimaryDark: "rgb(24, 35, 15)",
              rgbSecondaryDark: "rgb(39, 57, 28)",
              rgbPrimary: "rgb(37, 95, 56)",
              rgbSecondary: "rgb(31, 125, 83)",
            },
          },
        },
      },
    }),
  ],
});
