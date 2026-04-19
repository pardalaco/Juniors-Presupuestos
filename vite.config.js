import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  // Añadimos el nombre de tu proyecto como ruta base
  base: "/Juniors-Presupuestos/",
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
