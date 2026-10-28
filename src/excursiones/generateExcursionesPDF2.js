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

  const nombreExcursion = document
    .getElementById("nombreExcursion")
    .value.trim();
  const titulo = nombreExcursion
    ? `Presupuesto ${nombreExcursion}`
    : "Presupuesto Campamento";
  const nombreArchivo = nombreExcursion
    ? `presupuesto-${nombreExcursion.replace(/\s+/g, "_")}`
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

  // --- NÚMERO DE PERSONAS ---
  const numNinos = Number(document.getElementById("ninos").value) || 0;
  const numEducadores =
    Number(document.getElementById("educadores").value) || 0;
  const numPreeducadores =
    Number(document.getElementById("preeducadores").value) || 0;
  const numOtros = Number(document.getElementById("otros").value) || 0;

  const numTotalPersonas = String(
    numNinos + numEducadores + numPreeducadores + numOtros,
  );

  // --- COLUMNA IZQUIERDA: 1. Nº PERSONAS ---
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Nº Personas", colLeftX, yLeft);

  yLeft += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  let personas = [
    ["Niños", String(numNinos)],
    ["Educadores", String(numEducadores)],
    ["Preeducadores", String(numPreeducadores)],
    ["Cocina y otros", String(numOtros)],
  ];

  personas = personas.filter((p) => Number(p[1]) > 0);

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
  doc.text(numTotalPersonas, colLeftX + colWidth, yLeft + 5, {
    align: "right",
  });

  // --- COLUMNA DERECHA: COSTES TOTALES ---
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Costes Totales", colRightX, yRight);

  yRight += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  const filas = document.querySelectorAll("#activityBody tr");
  const actividades = [];

  filas.forEach((fila) => {
    const inputName = fila.querySelector('input[type="text"]');
    const inputPrice = fila.querySelector('input[type="number"]');
    const selectMode = fila.querySelector("select");

    if (inputName && inputPrice && selectMode) {
      actividades.push({
        name: inputName.value,
        price: parseFloat(inputPrice.value) || 0,
        mode: selectMode.value,
      });
    }
  });

  actividades.forEach((actividad) => {
    doc.setTextColor(0, 0, 0);
    doc.text(actividad.name + ":", colRightX + 5, yRight);
    doc.setFontSize(9);

    if (actividad.mode === "total") {
      doc.setFontSize(fontSizeCuerpo);
      doc.setTextColor(...accentColor);
      doc.text(String(actividad.price) + "€", colRightX + colWidth, yRight, {
        align: "right",
      });
    } else if (actividad.mode === "porPersona") {
      doc.setTextColor(...secondaryColor);
      doc.text(
        `${actividad.price}€ x ${numTotalPersonas}p`,
        colRightX + 38,
        yRight,
      );

      doc.setFontSize(fontSizeCuerpo);
      const precioTotal = String(actividad.price * Number(numTotalPersonas));

      doc.setTextColor(...accentColor);
      doc.text(precioTotal + "€", colRightX + colWidth, yRight, {
        align: "right",
      });
    } else if (actividad.mode === "porNino") {
      doc.setTextColor(...secondaryColor);
      doc.text(`${actividad.price}€ x ${numNinos}n`, colRightX + 38, yRight);

      doc.setFontSize(fontSizeCuerpo);
      const precioTotal = String(actividad.price * numNinos);

      doc.setTextColor(...accentColor);
      doc.text(precioTotal + "€", colRightX + colWidth, yRight, {
        align: "right",
      });
    }

    yRight += 8;
  });

  doc.setDrawColor(...primaryColor);
  doc.line(colRightX + 5, yRight - 2, colRightX + colWidth, yRight - 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Total Presupuesto:", colRightX + 5, yRight + 5);
  doc.text(
    document.getElementById("totalGrupo").textContent,
    colRightX + colWidth,
    yRight + 5,
    { align: "right" },
  );

  // --- SECCIÓN INFERIOR: PAGOS PERSONAL (Izquierda) vs RESUMEN NIÑO (Derecha) ---

  let personalData = [
    [
      "Educadores",
      parseFloat(document.getElementById("pagoEducadores").value) || 0,
      numEducadores,
      (parseFloat(document.getElementById("pagoEducadores").value) || 0) *
        numEducadores,
    ],
    [
      "Preeducadores",
      parseFloat(document.getElementById("pagoPreeducadores").value) || 0,
      numPreeducadores,
      (parseFloat(document.getElementById("pagoPreeducadores").value) || 0) *
        numPreeducadores,
    ],
    [
      "Cocina/Otros",
      parseFloat(document.getElementById("pagoOtros").value) || 0,
      numOtros,
      (parseFloat(document.getElementById("pagoOtros").value) || 0) * numOtros,
    ],
  ];

  personalData = personalData.filter((tipoPersonal) => tipoPersonal[2] > 0);

  const ySeccionFinal = Math.max(yLeft, yRight) + 20;
  yLeft = ySeccionFinal;
  yRight = ySeccionFinal;

  if (personalData.length) {
    // Izquierda: Pagos Personal
    doc.setTextColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Pagos del Personal", colLeftX, yLeft);

    yLeft += 10;
    doc.setFontSize(fontSizeCuerpo);
    doc.setFont("helvetica", "normal");

    personalData.forEach(([label, price, qty, total]) => {
      doc.setTextColor(0, 0, 0);
      doc.text(label, colLeftX + 5, yLeft);
      doc.setFontSize(9);
      doc.setTextColor(...secondaryColor);
      doc.text(`${price}€ x ${qty}p`, colLeftX + 38, yLeft);
      doc.setFontSize(fontSizeCuerpo);
      doc.setTextColor(...accentColor);
      doc.text(total + "€", colLeftX + colWidth, yLeft, { align: "right" });
      yLeft += 8;
    });
  }

  // --- DERECHA: Pago por niño (Alineado y separado a la derecha) ---
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Pago por niño", colRightX, yRight);

  yRight += 10;
  doc.setFontSize(fontSizeCuerpo);
  doc.setFont("helvetica", "normal");

  let acumuladoCosteNino = 0;
  // Posición X alineada a la derecha para los cálculos intermedios (dejando espacio antes del precio total)
  const xCalculosIntermedios = colRightX + colWidth - 22;

  // 1. Actividades para el niño
  actividades.forEach((actividad) => {
    doc.setTextColor(0, 0, 0);
    doc.text(actividad.name + ":", colRightX + 5, yRight);
    doc.setFontSize(9);

    let costePorNinoActividad = 0;
    if (numNinos > 0) {
      if (actividad.mode === "total") {
        costePorNinoActividad = actividad.price / numNinos;
        doc.setTextColor(...secondaryColor);
        doc.text(
          `${actividad.price}€ / ${numNinos}n`,
          xCalculosIntermedios,
          yRight,
          { align: "right" },
        );
      } else if (actividad.mode === "porPersona") {
        costePorNinoActividad =
          (actividad.price * Number(numTotalPersonas)) / numNinos;
        doc.setTextColor(...secondaryColor);
        doc.text(
          `${actividad.price}€ x ${numTotalPersonas}p / ${numNinos}n`,
          xCalculosIntermedios,
          yRight,
          { align: "right" },
        );
      } else if (actividad.mode === "porNino") {
        costePorNinoActividad = actividad.price;
      }
    }

    acumuladoCosteNino += costePorNinoActividad;

    doc.setFontSize(fontSizeCuerpo);
    doc.setTextColor(...accentColor);
    doc.text(
      costePorNinoActividad.toFixed(2) + "€",
      colRightX + colWidth,
      yRight,
      {
        align: "right",
      },
    );

    yRight += 8;
  });

  // 2. Personal para el niño
  let costeTotalPersonal = 0;
  personalData.forEach(([label, price, qty, total]) => {
    costeTotalPersonal += total;
  });

  let costePersonalPorNino = 0;
  if (numNinos > 0) {
    costePersonalPorNino = costeTotalPersonal / numNinos;
  }
  acumuladoCosteNino += costePersonalPorNino;

  if (personalData.length > 0) {
    doc.setTextColor(0, 0, 0);
    doc.text("Precio Personal:", colRightX + 5, yRight);
    doc.setFontSize(9);
    doc.setTextColor(...secondaryColor);
    doc.text(
      `${costeTotalPersonal.toFixed(2)}€ / ${numNinos}n`,
      xCalculosIntermedios,
      yRight,
      { align: "right" },
    );

    doc.setFontSize(fontSizeCuerpo);
    doc.setTextColor(...accentColor);
    doc.text(
      costePersonalPorNino.toFixed(2) + "€",
      colRightX + colWidth,
      yRight,
      {
        align: "right",
      },
    );

    yRight += 8;
  }

  doc.setDrawColor(...primaryColor);
  doc.line(colRightX + 5, yRight - 2, colRightX + colWidth, yRight - 2);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Total Precio Niño:", colRightX + 5, yRight + 5);
  doc.text(
    acumuladoCosteNino.toFixed(2) + "€",
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
