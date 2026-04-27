import { jsPDF } from "jspdf";

export function generatePDF() {
  const doc = new jsPDF();

  // Configuración de colores
  const primaryColor = [0, 102, 204]; // Azul
  const secondaryColor = [100, 100, 100]; // Gris
  const accentColor = [255, 87, 34]; // Naranja

  // --- ENCABEZADO ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");

  const nombreCampamento = document
    .getElementById("nombreCampamento")
    .value.trim();
  const titulo = nombreCampamento
    ? `Presupuesto ${nombreCampamento}`
    : "Presupuesto Campamento";
  const nombreArchivo = nombreCampamento
    ? `presupuesto-${nombreCampamento.replace(/\s+/g, "_")}`
    : "presupuesto-campamento";
  doc.text(titulo, 105, 20, { align: "center" });

  // Fecha
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  const today = new Date().toLocaleDateString("es-ES");
  doc.text(`Generado el: ${today}`, 20, 40);

  // --- CONFIGURACIÓN DE CUERPO UNIFICADO ---
  const fontSizeCuerpo = 11;
  const colLeftX = 20;
  const colRightX = 110;
  const colWidth = 80;

  let yLeft = 60;
  let yRight = 60;

  // --- BLOQUE 1: Nº PERSONAS (Izquierda) vs DATOS GENERALES (Derecha) ---
  // Izquierda: Nº Personas
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Nº Personas", colLeftX, yLeft);

  yLeft += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  const personas = [
    ["Niños", document.getElementById("ninos").value],
    ["Educadores", document.getElementById("educadores").value],
    ["Preeducadores", document.getElementById("preeducadores").value],
    ["Cocina y otros", document.getElementById("cocina").value],
  ];

  personas.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label + ":", colLeftX + 5, yLeft);
    doc.setTextColor(...accentColor);
    doc.text(value, colLeftX + colWidth, yLeft, { align: "right" });
    yLeft += 8;
  });

  doc.setDrawColor(...primaryColor);
  doc.line(colLeftX + 5, yLeft - 2, colLeftX + colWidth, yLeft - 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Total Personas:", colLeftX + 5, yLeft + 5);
  doc.text(
    document.getElementById("totalPersonas").textContent,
    colLeftX + colWidth,
    yLeft + 5,
    { align: "right" },
  );

  // Derecha: Datos Generales
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Datos generales", colRightX, yRight);

  yRight += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  const datosGen = [
    ["Nº días", document.getElementById("dias").value],
    ["Precio comida/día", document.getElementById("precioComida").value + "€"],
    ["Margen por niño", document.getElementById("margen").value + "€"],
  ];

  datosGen.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label + ":", colRightX + 5, yRight);
    doc.setTextColor(...accentColor);
    doc.text(value, colRightX + colWidth, yRight, { align: "right" });
    yRight += 8;
  });

  // --- BLOQUE 2: ALINEACIÓN DE PAGOS PERSONAL Y RESUMEN COSTES NIÑO ---
  // Calculamos una posición Y común para que ambos títulos estén alineados
  const ySeccion2 = Math.max(yLeft, yRight) + 20;
  yLeft = ySeccion2;
  yRight = ySeccion2;

  // Izquierda: Pagos Personal
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Pagos del Personal", colLeftX, yLeft);

  yLeft += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  const personalData = [
    [
      "Educadores",
      `${document.getElementById("precioEducador").value}€/p`,
      `x${document.getElementById("educadores").value}`,
      `${document.getElementById("precioEducador").value * document.getElementById("educadores").value}€`,
    ],
    [
      "Preeducadores",
      `${document.getElementById("precioPreeducador").value}€/p`,
      `x${document.getElementById("preeducadores").value}`,
      `${document.getElementById("precioPreeducador").value * document.getElementById("preeducadores").value}€`,
    ],
    [
      "Cocina/Otros",
      `0€/p`,
      `x${document.getElementById("cocina").value}`,
      `0€`,
    ],
  ];

  personalData.forEach(([label, price, qty, total]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label, colLeftX + 5, yLeft);
    doc.setFontSize(9);
    doc.setTextColor(...secondaryColor);
    doc.text(`${price} ${qty}`, colLeftX + 38, yLeft);
    doc.setFontSize(fontSizeCuerpo);
    doc.setTextColor(...accentColor);
    doc.text(total, colLeftX + colWidth, yLeft, { align: "right" });
    yLeft += 8;
  });

  // Derecha: Resumen Costes Niño
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen costes niño", colRightX, yRight);

  yRight += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  const resumenNino = [
    [
      "Estancia + comida",
      document.getElementById("estanciaComida").textContent,
    ],
    ["Autobús/niño", document.getElementById("costAutobus").textContent],
    ["Material/niño", document.getElementById("costMaterial").textContent],
    ["Furgoneta/niño", document.getElementById("costFurgoneta").textContent],
    ["Personal/niño", document.getElementById("costEducadores").textContent],
    ["Margen", document.getElementById("costMargen").textContent],
  ];

  resumenNino.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label + ":", colRightX + 5, yRight);
    doc.setTextColor(...accentColor);
    doc.text(value, colRightX + colWidth, yRight, { align: "right" });
    yRight += 8;
  });

  // Total Niño (Estilo igual a Total Personas)
  doc.setDrawColor(...primaryColor);
  doc.line(colRightX + 5, yRight - 2, colRightX + colWidth, yRight - 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Total Precio Niño:", colRightX + 5, yRight + 5);
  doc.text(
    document.getElementById("precioTotal").textContent,
    colRightX + colWidth,
    yRight + 5,
    { align: "right" },
  );

  // --- BLOQUE 3: COSTES TOTALES ---
  const ySeccion3 = Math.max(yLeft, yRight) + 20;
  yLeft = ySeccion3;

  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Costes Totales del Campamento", colLeftX, yLeft);

  yLeft += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  const costesTotales = [
    ["Estancia Total", document.getElementById("estanciaTotal").textContent],
    ["Comida Total", document.getElementById("comidaTotal").textContent],
    ["Autobús", document.getElementById("autobus").value + "€"],
    [
      "Furgoneta + Gasolina",
      parseFloat(document.getElementById("furgoneta").value) +
        parseFloat(document.getElementById("gasolina").value) +
        "€",
    ],
    ["Material Total", document.getElementById("materialTotal").textContent],
    ["Margen Total", document.getElementById("margenTotal").textContent],
  ];

  costesTotales.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label + ":", colLeftX + 5, yLeft);
    doc.setTextColor(...accentColor);
    doc.text(value, colLeftX + colWidth, yLeft, { align: "right" });
    yLeft += 8;
  });

  // Total Presupuesto (Estilo igual a Total Personas)
  doc.setDrawColor(...primaryColor);
  doc.line(colLeftX + 5, yLeft - 2, colLeftX + colWidth, yLeft - 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL PRESUPUESTO:", colLeftX + 5, yLeft + 5);
  doc.text(
    document.getElementById("presupuestoTotal").textContent,
    colLeftX + colWidth,
    yLeft + 5,
    { align: "right" },
  );

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.text("Generado con Calculadora de Presupuestos Juniors", 105, 280, {
    align: "center",
  });

  doc.save(`${nombreArchivo}.pdf`);
}

const btn = document.getElementById("generatePDF");
if (btn) {
  btn.addEventListener("click", generatePDF);
}
