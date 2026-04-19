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
  const nombreCampamento = document
    .getElementById("nombreCampamento")
    .value.trim();
  const titulo = nombreCampamento
    ? `Presupuesto ${nombreCampamento}`
    : "Presupuesto Campamento";
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
    doc.setFontSize(16);
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
    ["Número de días", document.getElementById("dias").value],
    ["Número de niños", document.getElementById("ninos").value],
    ["Coste noche/persona", document.getElementById("costeNoche").value + "€"],
    [
      "Precio comida/persona",
      document.getElementById("precioComida").value + "€",
    ],
    ["Margen por niño", document.getElementById("margen").value + "€"],
  ]);

  // Personal (columna izquierda)
  addSection("Personal del Campamento", [
    [
      "Educadores",
      `${document.getElementById("educadores").value} (Pagan: ${document.getElementById("precioEducador").value}€)`,
    ],
    [
      "Preeducadores",
      `${document.getElementById("preeducadores").value} (Pagan: ${document.getElementById("precioPreeducador").value}€)`,
    ],
    [
      "Cocina y otros",
      `${document.getElementById("cocina").value} (Pagan: ${document.getElementById("precioCocina").value}€)`,
    ],
  ]);

  // Costes de Transporte y Material (columna derecha)
  addSection(
    "Costes de Transporte y Material",
    [
      ["Precio autobús", document.getElementById("autobus").value + "€"],
      ["Presupuesto Material", document.getElementById("material").value + "€"],
      [
        "Presupuesto Furgoneta",
        document.getElementById("furgoneta").value + "€",
      ],
      ["Gasolina Campamento", document.getElementById("gasolina").value + "€"],
    ],
    true,
  ); // newColumn = true

  // Resultados en tabla (columna derecha)
  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Resultados del Cálculo", xPosition, yPosition);
  yPosition += 10;

  doc.setDrawColor(...primaryColor);
  doc.line(xPosition, yPosition, xPosition + 80, yPosition);
  yPosition += 10;

  // Crear tabla simple
  const results = [
    [
      "Coste persona/día",
      document.getElementById("costoPersonaDia").textContent,
    ],
    [
      "Estancia + comida total / persona",
      document.getElementById("estanciaComida").textContent,
    ],
    ["Autobús/niño", document.getElementById("costAutobus").textContent],
    ["Material/niño", document.getElementById("costMaterial").textContent],
    ["Furgoneta/niño", document.getElementById("costFurgoneta").textContent],
    [
      "Coste personal/niño",
      document.getElementById("costEducadores").textContent,
    ],
    ["Margen", document.getElementById("costMargen").textContent],
    ["Total personas", document.getElementById("totalPersonas").textContent],
    [
      "Precio total por niño",
      document.getElementById("precioTotal").textContent,
    ],
    [
      "Presupuesto Total",
      document.getElementById("presupuestoTotal").textContent,
    ],
  ];

  doc.setFontSize(11); // Fuente más pequeña
  doc.setFont("helvetica", "normal");
  results.forEach(([label, value]) => {
    doc.setTextColor(0, 0, 0);
    doc.text(label + ":", xPosition + 5, yPosition);
    doc.setTextColor(...accentColor);
    doc.text(value, xPosition + 75, yPosition, { align: "right" });
    yPosition += 7; // Espaciado más pequeño
  });

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);
  doc.text("Generado con Calculadora de Presupuestos Juniors", 105, 280, {
    align: "center",
  });

  // Guardar el PDF
  doc.save("presupuesto_campamento.pdf");
}
