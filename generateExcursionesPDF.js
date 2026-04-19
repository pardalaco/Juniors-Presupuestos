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

  // Segunda página: Detalles de cálculos
  doc.addPage();
  let detailY = 25;
  const detailX = 20;

  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Detalles de Cálculos", 105, detailY, { align: "center" });
  detailY += 8;
  doc.setDrawColor(...primaryColor);
  doc.line(detailX, detailY, 190, detailY);
  detailY += 12;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const ninos = parseInt(document.getElementById("ninos").value, 10) || 0;
  const educadores =
    parseInt(document.getElementById("educadores").value, 10) || 0;
  const preeducadores =
    parseInt(document.getElementById("preeducadores").value, 10) || 0;
  const otros = parseInt(document.getElementById("otros").value, 10) || 0;
  const pagoEducadores =
    parseFloat(document.getElementById("pagoEducadores").value) || 0;
  const pagoPreeducadores =
    parseFloat(document.getElementById("pagoPreeducadores").value) || 0;
  const pagoOtros = parseFloat(document.getElementById("pagoOtros").value) || 0;

  const pagoEducadoresTotal = pagoEducadores * educadores;
  const pagoPreeducadoresTotal = pagoPreeducadores * preeducadores;
  const pagoOtrosTotal = pagoOtros * otros;
  const totalPersonas = ninos + educadores + preeducadores + otros;

  const actualActivities = window.activities || [];

  const activityDetails = actualActivities.map((activity) => {
    const amount =
      activity.mode === "porPersona"
        ? activity.price * totalPersonas
        : activity.mode === "porNino"
          ? activity.price * ninos
          : activity.price;
    return {
      label: activity.name,
      mode: activity.mode,
      unit: activity.price,
      amount,
    };
  });

  const gastosTotal = activityDetails.reduce(
    (sum, item) => sum + item.amount,
    0,
  );
  const aportePersonal =
    pagoEducadoresTotal + pagoPreeducadoresTotal + pagoOtrosTotal;
  const precioPorNino =
    ninos > 0 ? Math.max(0, gastosTotal - aportePersonal) / ninos : 0;

  function formatCurrency(value) {
    return `${Math.round(value * 100) / 100}€`;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Resumen de entradas:", detailX, detailY);
  detailY += 8;
  doc.setFont("helvetica", "normal");
  doc.text(`Niños: ${ninos}`, detailX, detailY);
  detailY += 7;
  doc.text(
    `Educadores: ${educadores} @ ${formatCurrency(pagoEducadores)}`,
    detailX,
    detailY,
  );
  detailY += 7;
  doc.text(
    `Preeducadores: ${preeducadores} @ ${formatCurrency(pagoPreeducadores)}`,
    detailX,
    detailY,
  );
  detailY += 7;
  doc.text(`Otros: ${otros} @ ${formatCurrency(pagoOtros)}`, detailX, detailY);
  detailY += 7;
  doc.text(`Total personas: ${totalPersonas}`, detailX, detailY);
  detailY += 12;

  doc.setFont("helvetica", "bold");
  doc.text("Detalle de gastos y actividades:", detailX, detailY);
  detailY += 8;
  doc.setFont("helvetica", "normal");

  activityDetails.forEach((item) => {
    const modeLabel =
      item.mode === "porPersona"
        ? "por persona"
        : item.mode === "porNino"
          ? "por niño"
          : "total";
    doc.text(
      `${item.label}: ${formatCurrency(item.unit)} (${modeLabel}) = ${formatCurrency(item.amount)}`,
      detailX,
      detailY,
    );
    detailY += 7;
  });
  detailY += 6;

  doc.setFont("helvetica", "bold");
  doc.text("Cálculos finales:", detailX, detailY);
  detailY += 8;
  doc.setFont("helvetica", "normal");

  doc.text(`Gastos totales: ${formatCurrency(gastosTotal)}`, detailX, detailY);
  detailY += 7;
  doc.text(
    `Aporte personal: ${formatCurrency(aportePersonal)}`,
    detailX,
    detailY,
  );
  detailY += 7;
  doc.text(`Total grupo: ${formatCurrency(gastosTotal)}`, detailX, detailY);
  detailY += 7;
  doc.text(
    `Precio por niño: (${formatCurrency(gastosTotal)} - ${formatCurrency(aportePersonal)}) / ${ninos} = ${formatCurrency(precioPorNino)}`,
    detailX,
    detailY,
  );
  detailY += 12;

  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.text("Generado con Calculadora de Presupuestos Juniors", 105, 280, {
    align: "center",
  });

  // Guardar el PDF
  doc.save("presupuesto_excursion.pdf");
}
