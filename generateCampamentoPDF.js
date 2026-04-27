import { jsPDF } from "jspdf";

export function generatePDF() {
  const doc = new jsPDF();

  // Configuración de colores originales
  const primaryColor = [0, 102, 204]; // Azul
  const secondaryColor = [100, 100, 100]; // Gris
  const accentColor = [255, 87, 34]; // Naranja rojizo
  const successColor = [34, 139, 34]; // Verde

  // --- ENCABEZADO ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
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

  let yLeft = 60;
  let yRight = 60;
  const colLeftX = 20;
  const colRightX = 110;

  // --- COLUMNA IZQUIERDA: Nº Personas ---
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Nº Personas", colLeftX, yLeft);
  yLeft += 10;

  const personas = [
    ["Niños", document.getElementById("ninos").value],
    ["Educadores", document.getElementById("educadores").value],
    ["Preeducadores", document.getElementById("preeducadores").value],
    ["Cocina y otros", document.getElementById("cocina").value],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  personas.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label, colLeftX + 5, yLeft);
    doc.setTextColor(...accentColor);
    doc.text(value, colLeftX + 45, yLeft, { align: "right" });
    yLeft += 7;
  });

  doc.setDrawColor(...primaryColor);
  doc.line(colLeftX + 5, yLeft - 2, colLeftX + 45, yLeft - 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Total", colLeftX + 5, yLeft + 3);
  doc.text(
    document.getElementById("totalPersonas").textContent,
    colLeftX + 45,
    yLeft + 3,
    { align: "right" },
  );
  yLeft += 20;

  // --- COLUMNA DERECHA: Datos Generales ---
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Datos generales", colRightX, yRight);
  yRight += 10;

  const datosGen = [
    ["Nº días", document.getElementById("dias").value],
    ["Precio comida/día", document.getElementById("precioComida").value + "€"],
    ["Margen por niño", document.getElementById("margen").value + "€"],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  datosGen.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label, colRightX + 5, yRight);
    doc.setTextColor(...accentColor);
    doc.text(value, colRightX + 85, yRight, { align: "right" });
    yRight += 7;
  });

  // --- COLUMNA IZQUIERDA: Pagos del Personal ---
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Pagos del Personal", colLeftX, yLeft);
  yLeft += 10;
  doc.setFontSize(10);
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
      "Cocina y otros",
      `${document.getElementById("precioCocina").value}€/p`,
      `x${document.getElementById("cocina").value}`,
      `0€`,
    ],
  ];

  personalData.forEach(([label, price, qty, total]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label, colLeftX + 5, yLeft);
    doc.text(price, colLeftX + 35, yLeft);
    doc.text(qty, colLeftX + 55, yLeft);
    doc.setTextColor(...accentColor);
    doc.text(total, colLeftX + 85, yLeft, { align: "right" });
    yLeft += 7;
  });

  // --- COLUMNA DERECHA: Resumen Costes Niño ---
  yRight += 15;
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen costes niño", colRightX, yRight);
  yRight += 10;

  const resumenNino = [
    [
      "Estancia + comida",
      document.getElementById("estanciaComida").textContent,
    ],
    ["Autobús/niño", document.getElementById("costAutobus").textContent],
    ["Material/niño", document.getElementById("costMaterial").textContent],
    ["Transporte/niño", document.getElementById("costFurgoneta").textContent],
    ["Personal/niño", document.getElementById("costEducadores").textContent],
    ["Margen", document.getElementById("costMargen").textContent],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  resumenNino.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label, colRightX + 5, yRight);
    doc.setTextColor(...accentColor);
    doc.text(value, colRightX + 85, yRight, { align: "right" });
    yRight += 7;
  });

  // Cuadro Azul para Total Niño
  yRight += 5;
  doc.setFillColor(...primaryColor);
  doc.roundedRect(colRightX, yRight, 85, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Total", colRightX + 5, yRight + 8);
  doc.text(
    document.getElementById("precioTotal").textContent,
    colRightX + 80,
    yRight + 8,
    { align: "right" },
  );

  // --- COLUMNA IZQUIERDA: Costes Totales ---
  yLeft += 10;
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Costes", colLeftX, yLeft);
  yLeft += 10;

  const costesTotales = [
    ["Estancia", document.getElementById("estanciaTotal").textContent],
    ["Comida", document.getElementById("comidaTotal").textContent],
    ["Autobús", document.getElementById("autobus").value + "€"],
    ["Furgoneta", document.getElementById("furgoneta").value + "€"],
    ["Gasolina", document.getElementById("gasolina").value + "€"],
    ["Margen", document.getElementById("margenTotal").textContent],
    ["Material", document.getElementById("materialTotal").textContent],
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  costesTotales.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label, colLeftX + 5, yLeft);
    doc.setTextColor(...accentColor);
    doc.text(value, colLeftX + 85, yLeft, { align: "right" });
    yLeft += 7;
  });

  // Cuadro Verde para Presupuesto Total
  yLeft += 5;
  doc.setFillColor(...successColor);
  doc.roundedRect(colLeftX, yLeft, 85, 12, 2, 2, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.text("Total", colLeftX + 5, yLeft + 8);
  doc.text(
    document.getElementById("presupuestoTotal").textContent,
    colLeftX + 80,
    yLeft + 8,
    { align: "right" },
  );

  // Pie de página (con link)
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  const footerText = "Generado con Calculadora de Presupuestos Juniors";
  doc.text(footerText, 105, 280, { align: "center" });
  const textWidth = doc.getTextWidth(footerText);
  doc.link(105 - textWidth / 2, 275, textWidth, 10, {
    url: "https://pardalaco.github.io/Juniors-Presupuestos/",
  });

  // SEGUNDA PÁGINA: Detalles de cálculos (Mantenemos tu lógica original)
  doc.addPage();
  // ... (Aquí va el código de la página 2 que ya tenías)

  doc.save(`${nombreArchivo}.pdf`);
}

const btn = document.getElementById("generatePDF");
if (btn) {
  btn.addEventListener("click", generatePDF);
}
