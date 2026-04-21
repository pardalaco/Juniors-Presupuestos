# Juniors Presupuestos

Esta colección de páginas HTML está diseñada para ayudar a calcular presupuestos de actividades escolares: campamentos y excursiones.

## Archivos

- `index.html`
  - Página de inicio que describe las herramientas disponibles y permite navegar entre las calculadoras.
- `calculadora_excursiones.html`
  - Calculadora de excursiones con control de niños, educadores, preeducadores, otros y gastos/actividades.
- `calculadora_campamento.html`
  - Calculadora de campamento con parámetros de días, niños, precios por noche, comida, transporte y pagos del personal.

## Cómo usar

1. Abre `index.html` en un navegador.
2. Haz clic en la calculadora que necesites.
3. Ajusta los valores en los campos del formulario.
4. Observa los resultados actualizados en tiempo real.

> Nota: estos archivos son páginas estáticas, no requieren servidor. Basta con abrirlos en el navegador.

## Despliegue de la aplicación

Esta aplicación es una colección de páginas web estáticas que pueden desplegarse en cualquier servidor web o plataforma de hosting estático. A continuación, se detallan las opciones más comunes:

### Opción 1: Despliegue local

Para desarrollo local:

1. Instala las dependencias: `npm install`
2. Ejecuta el servidor de desarrollo: `npm run dev`
3. Abre `http://localhost:5173` en tu navegador

### Opción 2: Build para producción

Para generar los archivos optimizados para producción:

1. Ejecuta: `npm run build`
2. Los archivos se generarán en la carpeta `dist/`
3. Sirve los archivos de la carpeta `dist/` en cualquier servidor web estático

### Opción 3: Despliegue en GitHub Pages

Si tienes el repositorio en GitHub:

1. Asegúrate de que el repositorio esté público o configura GitHub Pages para repositorios privados
2. Ejecuta: `npm run deploy`
3. Esto construirá la aplicación y la desplegará automáticamente en GitHub Pages
4. La aplicación estará disponible en `https://tu-usuario.github.io/Juniors-Presupuestos/`

### Otras plataformas de despliegue

Puedes desplegar fácilmente en:

- **Netlify**: Conecta tu repositorio y configura el directorio de build como `dist`
- **Vercel**: Similar a Netlify, conecta el repo y especifica `npm run build`
- **Surge**: Ejecuta `npm run build` y luego `surge dist/`
- **Firebase Hosting**: Usa `firebase deploy` después de configurar el proyecto

### Requisitos del servidor

- Soporte para archivos HTML, CSS y JavaScript
- No requiere base de datos ni backend
- Funciona con HTTPS (recomendado para producción)

## Calculadora de Excursiones

Características principales:

- Entrada de participantes:
  - Niños
  - Educadores
  - Preeducadores
  - Otros
- Pagos del personal vinculados a cada rol.
- Lista dinámica de gastos y actividades:
  - Nombre de gasto/actividad
  - Precio
  - Modo de cálculo (por persona, por niño, total)
- Botones de acción con iconos:
  - Inicio
  - Cambiar tema (modo oscuro)
- Resultados:
  - Coste total de servicios
  - Aporte del personal
  - Total grupo
  - Precio por niño
  - Total de personas
- Resumen de conceptos en tabla.

## Calculadora de Campamento

Características principales:

- Configuración general:
  - Número de días
  - Número de niños
  - Coste de noche por persona
  - Coste de comida por día
  - Coste de transporte
- Pagos del personal:
  - Educadores
  - Preeducadores
  - Otros
- Interfaz con botones superiores idénticos a la calculadora de excursiones.
- Resultados calculados dinámicamente al cambiar cualquier campo.

## Tema y estilo

- Cada calculadora incluye un conmutador de tema que cambia entre un esquema claro y oscuro.
- El diseño usa CSS moderno con tarjetas, rejillas y bordes suavizados para una experiencia limpia.
- Los botones superiores están alineados junto al título en la cabecera.

## Personalización

Puedes editar directamente cualquiera de los archivos HTML para:

- cambiar los valores iniciales
- agregar nuevas actividades o gastos
- ajustar etiquetas y textos
- adaptar las fórmulas a tus necesidades

## Despliegue de la aplicación

Esta aplicación es una colección de páginas web estáticas que pueden desplegarse en cualquier servidor web o plataforma de hosting estático. A continuación, se detallan las opciones más comunes:

### Opción 1: Despliegue local

Para desarrollo local:

1. Instala las dependencias: `npm install`
2. Ejecuta el servidor de desarrollo: `npm run dev`
3. Abre `http://localhost:5173` en tu navegador

### Opción 2: Build para producción

Para generar los archivos optimizados para producción:

1. Ejecuta: `npm run build`
2. Los archivos se generarán en la carpeta `dist/`
3. Sirve los archivos de la carpeta `dist/` en cualquier servidor web estático

### Opción 3: Despliegue en GitHub Pages

Si tienes el repositorio en GitHub:

1. Asegúrate de que el repositorio esté público o configura GitHub Pages para repositorios privados
2. Ejecuta: `npm run deploy`
3. Esto construirá la aplicación y la desplegará automáticamente en GitHub Pages
4. La aplicación estará disponible en `https://tu-usuario.github.io/Juniors-Presupuestos/`

### Otras plataformas de despliegue

Puedes desplegar fácilmente en:

- **Netlify**: Conecta tu repositorio y configura el directorio de build como `dist`
- **Vercel**: Similar a Netlify, conecta el repo y especifica `npm run build`
- **Surge**: Ejecuta `npm run build` y luego `surge dist/`
- **Firebase Hosting**: Usa `firebase deploy` después de configurar el proyecto

### Requisitos del servidor

- Soporte para archivos HTML, CSS y JavaScript
- No requiere base de datos ni backend
- Funciona con HTTPS (recomendado para producción)
