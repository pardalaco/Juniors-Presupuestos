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
  function addSection(title, items, newColumn = false) {
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
    doc.line(xPosition, yPosition, xPosition + 80, yPosition); // Línea horizontal más corta
    yPosition += 10;

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

    yPosition += 10; // Espacio entre secciones
  }

  // Configuración General (columna izquierda)
  addSection("Configuración General", [
    ["Número de niños", document.getElementById("ninos").value],
  ]);

  // Personal (columna izquierda)
  addSection("Participantes y Pagos del Personal", [
    [
      "Educadores",
      `${document.getElementById("educadores").value} (Pagan: ${document.getElementById("pagoEducadores").value}€)`,
    ],
    [
      "Preeducadores",
      `${document.getElementById("preeducadores").value} (Pagan: ${document.getElementById("pagoPreeducadores").value}€)`,
    ],
    [
      "Otros",
      `${document.getElementById("otros").value} (Pagan: ${document.getElementById("pagoOtros").value}€)`,
    ],
  ]);

  // Gastos y Actividades (columna derecha)
  const activities = window.activities || [];

  const activityItems = activities.map((activity) => [
    activity.name,
    `${activity.price}€ (${activity.mode})`,
  ]);

  addSection("Gastos y Actividades", activityItems, true);

  // Resultados (columna derecha, continuar)
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resultados del Cálculo", xPosition, yPosition);
  yPosition += 10;

  doc.setDrawColor(...primaryColor);
  doc.line(xPosition, yPosition, xPosition + 80, yPosition);
  yPosition += 10;

  // Crear tabla simple de resultados
  const results = [
    ["Coste servicios", document.getElementById("gastosTotal").textContent],
    ["Aporte personal", document.getElementById("aportePersonal").textContent],
    ["Total grupo", document.getElementById("totalGrupo").textContent],
    ["Precio por niño", document.getElementById("precioPorNino").textContent],
    ["Total personas", document.getElementById("totalPersonas").textContent],
  ];

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  results.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label + ":", xPosition + 5, yPosition);
    doc.setTextColor(...accentColor);
    doc.text(value, xPosition + 75, yPosition, { align: "right" });
    yPosition += 7;
  });

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.text("Generado con Calculadora de Presupuestos Juniors", 105, 280, {
    align: "center",
  });

  // Guardar el PDF
  doc.save("presupuesto_excursion.pdf");
}
