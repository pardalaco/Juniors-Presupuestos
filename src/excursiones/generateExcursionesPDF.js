import { jsPDF } from "jspdf";

export function generatePDF() {
  const doc = new jsPDF();

  // Configurar colores y fuentes
  const primaryColor = [0, 102, 204]; // Azul
  const secondaryColor = [100, 100, 100]; // Gris
  const accentColor = [255, 87, 34]; // Naranja rojizo

  // Encabezado
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 30, "F"); // Rectángulo azul en la parte superior
  doc.setTextColor(255, 255, 255); // Texto blanco
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  const nombreExcursion = document
    .getElementById("nombreExcursion")
    .value.trim();
  const nombreArchivo = nombreExcursion
    ? `presupuesto-${nombreExcursion.replace(/\s+/g, "_")}`
    : "presupuesto-excursion";
  const titulo = nombreExcursion
    ? `Presupuesto ${nombreExcursion}`
    : "Presupuesto Excursión";
  doc.text(titulo, 105, 20, { align: "center" });

  // Fecha
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  const today = new Date().toLocaleDateString("es-ES");
  doc.text(`Generado el: ${today}`, 20, 40);

  let yPosition = 60;
  let xPosition = 20; // Columna izquierda

  // Función auxiliar para secciones
  function addSection(title, items, newColumn = false, total = []) {
    if (newColumn) {
      xPosition = 110; // Cambiar a columna derecha
      yPosition = 60; // Resetear yPosition para la nueva columna
    }

    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, xPosition, yPosition);
    yPosition += 10;

    doc.setDrawColor(...primaryColor);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11); // Fuente un poco más pequeña para ahorrar espacio
    doc.setFont("helvetica", "normal");

    items.forEach(([label, value]) => {
      doc.setTextColor(0, 0, 0);
      doc.text(label + ":", xPosition + 5, yPosition);
      doc.setTextColor(...accentColor);
      doc.text(value, xPosition + 75, yPosition, { align: "right" });
      yPosition += 7; // Espaciado más pequeño
    });

    if (total.length) {
      doc.setDrawColor(...primaryColor);
      doc.line(xPosition + 75, yPosition, xPosition + 5, yPosition);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      yPosition += 10;

      // Total
      doc.text(total[0], xPosition + 5, yPosition);
      doc.text(total[1], xPosition + 75, yPosition, { align: "right" });
    }

    yPosition += 15; // Espacio entre secciones
  }

  // Configuración General (columna izquierda)
  addSection("Configuración General", [
    ["Número de niños", document.getElementById("ninos").value],
  ]);

  // Personal (columna izquierda)

  let personal = [];

  if (document.getElementById("educadores").value != 0) {
    personal.push([
      "Educadores",
      `${document.getElementById("educadores").value} (Pagan: ${document.getElementById("pagoEducadores").value}€)`,
    ]);
  }

  if (document.getElementById("preeducadores").value != 0) {
    personal.push([
      "Preeducadores",
      `${document.getElementById("preeducadores").value} (Pagan: ${document.getElementById("pagoPreeducadores").value}€)`,
    ]);
  }
  if (document.getElementById("otros").value != 0) {
    personal.push([
      "Otros",
      `${document.getElementById("otros").value} (Pagan: ${document.getElementById("pagoOtros").value}€)`,
    ]);
  }

  addSection("Participantes y Pagos del Personal", personal);

  // Gastos y Actividades (columna derecha)
  const activities = window.activities || [];

  const activityItems = activities.map((activity) => [
    activity.name || "Nueva actividad",
    `${activity.price}€ (${activity.mode})`,
  ]);

  addSection("Gastos totales y Actividades", activityItems, true, [
    "Total presupuesto:",
    document.getElementById("totalGrupo").textContent,
  ]);

  // Resultados (columna derecha, continuar)
  const results = [
    ["Coste servicios", document.getElementById("gastosTotal").textContent],
    ["Aporte personal", document.getElementById("aportePersonal").textContent],
    ["Total personas", document.getElementById("totalPersonas").textContent],
  ];

  addSection("Resultados del Cálculo", results, false, [
    "Precio por niño",
    document.getElementById("precioPorNino").textContent,
  ]);

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  const texto_footer = "Generado con Calculadora de Presupuestos Juniors";
  const x = 105;
  const y = 280;

  // 1. Dibujamos el texto normalmente
  doc.text(texto_footer, x, y, { align: "center" });

  // 2. Calculamos el ancho del texto para definir el área del clic
  // 'center' alinea respecto a X, así que restamos la mitad del ancho para el inicio
  const textWidth = doc.getTextWidth(texto_footer);
  const startX = x - textWidth / 2;

  // 3. Añadimos el enlace sobre el área del texto
  // Parámetros: x, y, ancho, alto, url
  doc.link(startX, y - 5, textWidth, 10, {
    url: "https://pardalaco.github.io/Juniors-Presupuestos/",
  });

  // Guardar el PDF
  doc.save(nombreArchivo + ".pdf");
}

const btn = document.getElementById("generatePDF");
if (btn) {
  btn.addEventListener("click", generatePDF);
}
