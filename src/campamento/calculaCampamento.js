// El resto del código JavaScript existente
function calculate() {
  const dias = parseInt(document.getElementById("dias").value);
  const ninos = parseInt(document.getElementById("ninos").value);
  const educadores = parseInt(document.getElementById("educadores").value);
  const preeducadores = parseInt(
    document.getElementById("preeducadores").value,
  );
  const cocina = parseInt(document.getElementById("cocina").value);

  const costeDia = parseFloat(document.getElementById("costeDia").value);
  const tipoCoste = document.getElementById("tipoCoste").value;
  const precioComida = parseFloat(
    document.getElementById("precioComida").value,
  );
  const margen = parseFloat(document.getElementById("margen").value) || 0;

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

  // Ajuste según tipo de coste (día o noche)
  // Si es por noche, se resta 1 día porque la última noche no tiene coste de estancia
  const diasEstancia = tipoCoste === "noche" ? Math.max(0, dias - 1) : dias;

  const strDiasNoches = tipoCoste === "noche" ? "noche" : "dias";

  document.getElementById("labelCosteDia").innerHTML =
    `Coste ${strDiasNoches}/persona (€)`;

  const estanciaComidaTotalNiño = costeDia * diasEstancia + precioComida * dias;

  const costoPersonaDia = estanciaComidaTotalNiño / dias;

  const costAutobus = autobus / ninos;
  const costMaterial = material / ninos;
  const costFurgoneta = (furgoneta + gasolina) / ninos;

  // El coste real de cada personal es el mismo que el de un niño (estancia + comida)
  const costeRealPersonal = costoPersonaDia * dias;

  // Lo que los niños tienen que "subvencionar" es la diferencia entre el coste real y lo que paga el personal
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

  const totalPersonas = ninos + educadores + preeducadores + cocina;

  document.getElementById("costoPersonaDia").textContent =
    Math.round(costoPersonaDia * 100) / 100 + "€";
  document.getElementById("estanciaComida").textContent =
    Math.round(estanciaComidaTotalNiño * 100) / 100 + "€";
  document.getElementById("costAutobus").textContent =
    Math.round(costAutobus * 100) / 100 + "€";
  document.getElementById("costMaterial").textContent =
    Math.round(costMaterial * 100) / 100 + "€";
  document.getElementById("costFurgoneta").textContent =
    Math.round(costFurgoneta * 100) / 100 + "€";
  document.getElementById("costEducadores").textContent =
    Math.round(costoPersonalAsumidoNinos * 100) / 100 + "€";
  document.getElementById("costMargen").textContent =
    Math.round(margen * 100) / 100 + "€";
  document.getElementById("totalPersonas").textContent = totalPersonas;
  document.getElementById("precioTotal").textContent = precioTotal + "€";

  // Cálculo del presupuesto total del campamento (lo que pagan niños + lo que paga el personal)
  const totalPagadoNinos = precioTotal * ninos;
  const totalPagadoEducadores = precioEducador * educadores;
  const totalPagadoPreeducadores = precioPreeducador * preeducadores;
  const totalPagadoCocina = precioCocina * cocina;

  const presupuestoTotal =
    Math.round(
      (totalPagadoNinos +
        totalPagadoEducadores +
        totalPagadoPreeducadores +
        totalPagadoCocina) *
        100,
    ) / 100;

  document.getElementById("presupuestoTotal").textContent =
    presupuestoTotal.toLocaleString("es-ES") + "€";

  // Cálculo para la tabla resumen (qué porcentaje del coste real de cada grupo cubren ellos mismos)
  const costeRealPersonalTotal = costoPersonaDia * diasEstancia;
  const porcPagaEducador = (precioEducador / costeRealPersonalTotal) * 100;
  const porcPagaPreeducador =
    (precioPreeducador / costeRealPersonalTotal) * 100;
  const porcPagaCocina = (precioCocina / costeRealPersonalTotal) * 100;

  const estanciaTotal = costeDia * diasEstancia * totalPersonas;
  const comidaTotal = precioComida * dias * totalPersonas;

  const summary = [
    {
      concepto: "Estancia Total",
      calculo: `${costeDia}€ x ${diasEstancia} ${strDiasNoches} x ${totalPersonas} personas`,
      total: Math.round(estanciaTotal * 100) / 100,
      id: "estanciaTotal",
    },
    {
      concepto: "Comida Total",
      calculo: `${precioComida}€ x ${dias} días x ${totalPersonas} personas`,
      total: Math.round(comidaTotal * 100) / 100,
      id: "comidaTotal",
    },
    {
      concepto: "Transporte (Autobús + Furgoneta + Gasolina)",
      calculo: `${autobus}€ + ${furgoneta}€ + ${gasolina}€`,
      total: Math.round((autobus + furgoneta + gasolina) * 100) / 100,
      id: "transporteTotal",
    },
    {
      concepto: "Material",
      calculo: `${material}€`,
      total: Math.round(material * 100) / 100,
      id: "materialTotal",
    },
    {
      concepto: "Margen Total",
      calculo: `${margen}€ x ${ninos} niños`,
      total: Math.round(margen * ninos * 100) / 100,
      id: "margenTotal",
    },
  ];

  let html = "";
  summary.forEach((item) => {
    html += `<tr>
        <td>${item.concepto}</td>
        <td>${item.calculo}</td>
        <td style="text-align: right;" id="${item.id}">${item.total}€</td>
      </tr>`;
  });
  document.getElementById("summaryBody").innerHTML = html;
}

// Exponer la función calculate al scope global para que funcione con onchange
window.calculate = calculate;

function setTheme(theme) {
  const themeLabel = themeToggle?.querySelector("span:last-child");

  if (theme === "dark") {
    document.body.dataset.theme = "dark";
    if (themeLabel) themeLabel.textContent = "Modo claro";
  } else {
    document.body.removeAttribute("data-theme");
    if (themeLabel) themeLabel.textContent = "Modo oscuro";
  }
  localStorage.setItem("siteTheme", theme);
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("siteTheme");
  const preferredTheme = window.matchMedia?.("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
  setTheme(savedTheme || preferredTheme);
}

function toggleTheme() {
  const current = document.body.dataset.theme === "dark" ? "light" : "dark";
  setTheme(current);
}

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

initializeTheme();
calculate();
