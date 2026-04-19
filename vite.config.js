import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync } from "fs";

// Función para obtener todos los archivos .html automáticamente
const getHtmlInputs = () => {
  const files = readdirSync(__dirname);
  const inputs = {};

  files.forEach((file) => {
    if (file.endsWith(".html")) {
      // Nombre de la propiedad (sin .html) : Ruta completa
      const name = file.replace(".html", "");
      inputs[name] = resolve(__dirname, file);
    }
  });

  return inputs;
};

export default defineConfig({
  base: "/Juniors-Presupuestos/",
  build: {
    rollupOptions: {
      input: getHtmlInputs(), // <--- Aquí llamamos a la función
    },
  },
});
