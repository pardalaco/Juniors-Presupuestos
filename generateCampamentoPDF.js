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
  const nombreArchivo = nombreCampamento
    ? `presupuesto-${nombreCampamento.replace(/\s+/g, "_")}`
    : "presupuesto-campamento";
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
    ["Número de días", document.getElementById("dias").value],
    ["Número de niños", document.getElementById("ninos").value],
    ["Coste día/persona", document.getElementById("costeDia").value + "€"],
    [
      "Precio comida/persona",
      document.getElementById("precioComida").value + "€",
    ],
    ["Margen por niño", document.getElementById("margen").value + "€"],
    ["Total personas", document.getElementById("totalPersonas").textContent],
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

  // Costes de Transporte y Material (columna izquierda, después de Personal)
  addSection("Costes de Transporte y Material", [
    ["Estancia Total", document.getElementById("estanciaTotal").textContent],
    ["Comida Total", document.getElementById("comidaTotal").textContent],
    [
      "Transporte Total",
      document.getElementById("transporteTotal").textContent,
    ],
    ["Material Total", document.getElementById("materialTotal").textContent],
    ["Margen Total", document.getElementById("margenTotal").textContent],
  ]); // newColumn = false (por defecto)

  // Añadir espacio extra antes
  yPosition += 5;

  // Fondo verde más grande
  doc.setFillColor(34, 139, 34); // Verde
  doc.roundedRect(xPosition - 5, yPosition - 5, 90, 14, 2, 2, "F");

  // Texto más grande y blanco
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Presupuesto Total" + ":", xPosition + 5, yPosition + 3);
  doc.text(
    document.getElementById("presupuestoTotal").textContent,
    xPosition + 75,
    yPosition + 3,
    { align: "right" },
  );

  yPosition = 60; // Espacio entre secciones

  // Cambiar a columna derecha para Resumen de Costes y Resultados
  xPosition = 110;

  // Resumen de Costes (mismo formato que las demás secciones)
  addSection("Resumen de Costes", [
    [
      "Estancia + comida",
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
  ]);

  // Resultados en tabla (columna derecha)
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");

  // Fondo azul más grande
  doc.setFillColor(0, 102, 204); // Azul
  doc.roundedRect(xPosition - 5, yPosition - 5, 90, 14, 2, 2, "F");

  // Texto más grande y blanco
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Precio total por niño" + ":", xPosition + 5, yPosition + 3);
  doc.text(
    document.getElementById("precioTotal").textContent,
    xPosition + 75,
    yPosition + 3,
    { align: "right" },
  );

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

  // Segunda página: Detalles de cálculos
  doc.addPage();

  let yPos = 20;
  const xPos = 20;

  // Título de la sección
  doc.setTextColor(...primaryColor);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Detalles de Cálculos", 105, yPos, { align: "center" });
  yPos += 5;

  doc.setDrawColor(...primaryColor);
  doc.line(20, yPos, 190, yPos);
  yPos += 15;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  // Extraer valores
  const dias = parseInt(document.getElementById("dias").value);
  const ninos = parseInt(document.getElementById("ninos").value);
  const educadores = parseInt(document.getElementById("educadores").value);
  const preeducadores = parseInt(
    document.getElementById("preeducadores").value,
  );
  const cocina = parseInt(document.getElementById("cocina").value);
  const costeDia = parseFloat(document.getElementById("costeDia").value);
  const precioComida = parseFloat(
    document.getElementById("precioComida").value,
  );
  const margen = parseFloat(document.getElementById("margen").value);
  const autobus = parseFloat(document.getElementById("autobus").value);
  const material = parseFloat(document.getElementById("material").value);
  const furgoneta = parseFloat(document.getElementById("furgoneta").value);
  const gasolina = parseFloat(document.getElementById("gasolina").value);
  const precioEducador = parseFloat(
    document.getElementById("precioEducador").value,
  );
  const precioPreeducador = parseFloat(
    document.getElementById("precioPreeducador").value,
  );
  const precioCocina = parseFloat(
    document.getElementById("precioCocina").value,
  );

  const costoPersonaDia = Math.round((costeDia + precioComida) * 100) / 100;
  const estanciaComidaTotalNiño =
    Math.round(costoPersonaDia * dias * 100) / 100;
  const costAutobus = autobus / ninos;
  const costMaterial = material / ninos;
  const costFurgoneta = (furgoneta + gasolina) / ninos;
  const costeRealPersonal = Math.round(costoPersonaDia * dias * 100) / 100;
  const subvencionEducadores =
    (costeRealPersonal - precioEducador) * educadores;
  const subvencionPreeducadores =
    (costeRealPersonal - precioPreeducador) * preeducadores;
  const subvencionCocina = (costeRealPersonal - precioCocina) * cocina;
  const costoPersonalAsumidoNinos =
    (subvencionEducadores + subvencionPreeducadores + subvencionCocina) / ninos;
  const precioTotal =
    Math.round(
      (estanciaComidaTotalNiño +
        costAutobus +
        costMaterial +
        costFurgoneta +
        costoPersonalAsumidoNinos +
        margen) *
        100,
    ) / 100;

  const calcLines = [
    `Coste por persona/día: ${costeDia}€ (noche) + ${precioComida}€ (comida) = ${costoPersonaDia}€`,
    `Estancia + comida total por niño: ${costoPersonaDia}€ x ${dias} días = ${estanciaComidaTotalNiño}€`,
    `Autobús por niño: ${autobus}€ / ${ninos} niños = ${costAutobus.toFixed(2)}€`,
    `Material por niño: ${material}€ / ${ninos} niños = ${costMaterial.toFixed(2)}€`,
    `Furgoneta por niño: (${furgoneta}€ + ${gasolina}€) / ${ninos} niños = ${costFurgoneta.toFixed(2)}€`,
    `Coste real personal por persona: ${costoPersonaDia}€ x ${dias} días = ${costeRealPersonal}€`,
    `Subvención educadores: (${costeRealPersonal}€ - ${precioEducador}€) x ${educadores} = ${subvencionEducadores.toFixed(2)}€`,
    `Subvención preeducadores: (${costeRealPersonal}€ - ${precioPreeducador}€) x ${preeducadores} = ${subvencionPreeducadores.toFixed(2)}€`,
    `Subvención cocina: (${costeRealPersonal}€ - ${precioCocina}€) x ${cocina} = ${subvencionCocina.toFixed(2)}€`,
    `Coste personal asumido por niños: (${subvencionEducadores.toFixed(2)} + ${subvencionPreeducadores.toFixed(2)} + ${subvencionCocina.toFixed(2)}) / ${ninos} = ${costoPersonalAsumidoNinos.toFixed(2)}€`,
    `Precio total por niño: ${estanciaComidaTotalNiño}€ + ${costAutobus.toFixed(2)}€ + ${costMaterial.toFixed(2)}€ + ${costFurgoneta.toFixed(2)}€ + ${costoPersonalAsumidoNinos.toFixed(2)}€ + ${margen}€ = ${precioTotal}€`,
  ];

  calcLines.forEach((line) => {
    doc.text(line, xPos, yPos);
    yPos += 10;
    if (yPos > 270) {
      doc.addPage();
      // Repetir encabezado en nueva página
      doc.setFillColor(...primaryColor);
      doc.rect(0, 0, 210, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(titulo, 105, 20, { align: "center" });
      yPos = 50;
    }
  });

  // Pie de página en segunda página
  doc.setFontSize(10);
  doc.setTextColor(...secondaryColor);

  doc.text(texto_footer, x, y, { align: "center" });
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
