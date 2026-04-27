import { jsPDF } from "jspdf";

export function generatePDF() {
  const doc = new jsPDF();

  // Colores originales
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

  // --- CONFIGURACIÓN DE CUERPO UNIFICADO (Tamaño 11) ---
  const fontSizeCuerpo = 11;
  const colLeftX = 20;
  const colRightX = 110;
  const colWidth = 80;

  let yLeft = 60;
  let yRight = 60;

  // --- COLUMNA IZQUIERDA: 1. Nº PERSONAS ---
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

  // --- COLUMNA IZQUIERDA: 2. DATOS GENERALES ---
  yLeft += 20;
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Datos generales", colLeftX, yLeft);

  yLeft += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  const dias = document.getElementById("dias").value;
  const noches = dias > 0 ? dias - 1 : 0;

  const strDiasNoches =
    document.getElementById("tipoCoste").value === "noche" ? "noches" : "días";

  const datosGen = [
    ["Nº días", dias],
    ["Nº noches", noches.toString()],
    [
      "Coste " + strDiasNoches + "/niño",
      document.getElementById("costeDia").value + "€",
    ],
    ["Precio comida/día", document.getElementById("precioComida").value + "€"],
    ["Margen por niño", document.getElementById("margen").value + "€"],
  ];

  datosGen.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label + ":", colLeftX + 5, yLeft);
    doc.setTextColor(...accentColor);
    doc.text(value, colLeftX + colWidth, yLeft, { align: "right" });
    yLeft += 8;
  });

  // --- COLUMNA DERECHA: COSTES TOTALES (Intercambiado) ---
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Costes Totales", colRightX, yRight);

  yRight += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  const costesTotales = [
    ["Estancia Total", document.getElementById("estanciaTotal").textContent],
    ["Comida Total", document.getElementById("comidaTotal").textContent],
    ["Autobús", document.getElementById("autobus").value + "€"],
    ["Furgoneta", parseFloat(document.getElementById("furgoneta").value) + "€"],
    ["Gasolina", parseFloat(document.getElementById("gasolina").value) + "€"],
    ["Material Total", document.getElementById("materialTotal").textContent],
    ["Margen Total", document.getElementById("margenTotal").textContent],
  ];

  costesTotales.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label + ":", colRightX + 5, yRight);
    doc.setTextColor(...accentColor);
    doc.text(value, colRightX + colWidth, yRight, { align: "right" });
    yRight += 8;
  });

  doc.setDrawColor(...primaryColor);
  doc.line(colRightX + 5, yRight - 2, colRightX + colWidth, yRight - 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL PRESUPUESTO:", colRightX + 5, yRight + 5);
  doc.text(
    document.getElementById("presupuestoTotal").textContent,
    colRightX + colWidth,
    yRight + 5,
    { align: "right" },
  );

  // --- SECCIÓN INFERIOR: PAGOS PERSONAL (Izquierda) vs RESUMEN NIÑO (Derecha) ---
  const ySeccionFinal = Math.max(yLeft, yRight) + 20;
  yLeft = ySeccionFinal;
  yRight = ySeccionFinal;

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

  // --- PIE DE PÁGINA CON LINK ---
  const footerY = 280;
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  const textoFooter = "Generado con Calculadora de Presupuestos Juniors";
  doc.text(textoFooter, 105, footerY, { align: "center" });

  const textWidth = doc.getTextWidth(textoFooter);
  doc.link(105 - textWidth / 2, footerY - 5, textWidth, 10, {
    url: "https://pardalaco.github.io/Juniors-Presupuestos/",
  });

  doc.save(`${nombreArchivo}.pdf`);
}

const btn = document.getElementById("generatePDF");
if (btn) {
  btn.addEventListener("click", generatePDF);
}
