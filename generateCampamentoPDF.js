import { jsPDF } from "jspdf";

export function generatePDF() {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(20);
  doc.text("Presupuesto Campamento", 20, 30);

  // Configuración General
  doc.setFontSize(16);
  doc.text("Configuración General", 20, 50);
  doc.setFontSize(12);
  doc.text(`Número de días: ${document.getElementById("dias").value}`, 20, 65);
  doc.text(
    `Número de niños: ${document.getElementById("ninos").value}`,
    20,
    75,
  );
  doc.text(
    `Coste noche/persona: ${document.getElementById("costeNoche").value}€`,
    20,
    85,
  );
  doc.text(
    `Precio comida/persona: ${document.getElementById("precioComida").value}€`,
    20,
    95,
  );
  doc.text(
    `Margen por niño: ${document.getElementById("margen").value}€`,
    20,
    105,
  );

  // Personal
  doc.setFontSize(16);
  doc.text("Personal del Campamento", 20, 125);
  doc.setFontSize(12);
  doc.text(
    `Educadores: ${document.getElementById("educadores").value} (Pagan: ${document.getElementById("precioEducador").value}€)`,
    20,
    140,
  );
  doc.text(
    `Preeducadores: ${document.getElementById("preeducadores").value} (Pagan: ${document.getElementById("precioPreeducador").value}€)`,
    20,
    150,
  );
  doc.text(
    `Cocina y otros: ${document.getElementById("cocina").value} (Pagan: ${document.getElementById("precioCocina").value}€)`,
    20,
    160,
  );

  // Costes de Transporte y Material
  doc.setFontSize(16);
  doc.text("Costes de Transporte y Material", 20, 180);
  doc.setFontSize(12);
  doc.text(
    `Precio autobús: ${document.getElementById("autobus").value}€`,
    20,
    195,
  );
  doc.text(
    `Presupuesto Material: ${document.getElementById("material").value}€`,
    20,
    205,
  );
  doc.text(
    `Presupuesto Furgoneta: ${document.getElementById("furgoneta").value}€`,
    20,
    215,
  );
  doc.text(
    `Gasolina Campamento: ${document.getElementById("gasolina").value}€`,
    20,
    225,
  );

  // Resultados
  doc.setFontSize(16);
  doc.text("Resultados del Cálculo", 20, 245);
  doc.setFontSize(12);
  doc.text(
    `Coste persona/día: ${document.getElementById("costoPersonaDia").textContent}`,
    20,
    260,
  );
  doc.text(
    `Estancia + comida total / persona: ${document.getElementById("estanciaComida").textContent}`,
    20,
    270,
  );
  doc.text(
    `Autobús/niño: ${document.getElementById("costAutobus").textContent}`,
    20,
    280,
  );
  doc.text(
    `Material/niño: ${document.getElementById("costMaterial").textContent}`,
    20,
    290,
  );
  doc.text(
    `Furgoneta/niño: ${document.getElementById("costFurgoneta").textContent}`,
    20,
    300,
  );
  doc.text(
    `Coste personal: ${document.getElementById("costEducadores").textContent}`,
    20,
    310,
  );
  doc.text(
    `Margen: ${document.getElementById("costMargen").textContent}`,
    20,
    320,
  );
  doc.text(
    `Total personas: ${document.getElementById("totalPersonas").textContent}`,
    20,
    330,
  );
  doc.text(
    `Precio total por niño: ${document.getElementById("precioTotal").textContent}`,
    20,
    340,
  );
  doc.text(
    `Presupuesto Total del Campamento: ${document.getElementById("presupuestoTotal").textContent}`,
    20,
    350,
  );

  // Guardar el PDF
  doc.save("presupuesto_campamento.pdf");
}
