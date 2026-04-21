import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // Mantenemos tu ruta base para GitHub Pages o similares
  base: "/Juniors-Presupuestos/",

  // Forzamos a Vite a que procese jspdf correctamente
  optimizeDeps: {
    include: ["jspdf"],
  },

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        campamento: resolve(__dirname, "calculadora_campamento.html"),
        excursiones: resolve(__dirname, "calculadora_excursiones.html"),
      },
    },
  },
});
