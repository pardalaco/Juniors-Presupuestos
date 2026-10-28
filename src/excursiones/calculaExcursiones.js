// El resto del código JavaScript existente
const activities = [
  {
    name: "Transporte",
    price: 450,
    mode: "total",
  },
  {
    name: "Museo",
    price: 5,
    mode: "porPersona",
  },
];

// Exponer activities para el PDF
window.activities = activities;

function formatCurrency(value) {
  return Math.round(value * 100) / 100 + "€";
}

function addActivity() {
  activities.push({ name: "", price: 0, mode: "total" });
  renderActivities();
  calculate();
}

function removeActivity(index) {
  activities.splice(index, 1);
  renderActivities();
  calculate();
}

function updateActivity(index, field, value) {
  if (field === "name") {
    activities[index].name = value;
  } else if (field === "price") {
    activities[index].price = parseFloat(value) || 0;
  } else if (field === "mode") {
    activities[index].mode = value;
  }
  calculate();
}

function renderActivities() {
  const body = document.getElementById("activityBody");
  body.innerHTML = "";
  activities.forEach((activity, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td><input type="text" value="${activity.name}" placeholder="Nueva actividad" class="rol-input" onchange="updateActivity(${index}, 'name', this.value)" /></td>
            <td><input type="number" min="0" step="0.5" value="${activity.price}" class="rol-input" onchange="updateActivity(${index}, 'price', this.value)" /></td>
            <td>
              <select onchange="updateActivity(${index}, 'mode', this.value)">
                <option value="total" ${activity.mode === "total" ? "selected" : ""}>Total</option>
                <option value="porPersona" ${activity.mode === "porPersona" ? "selected" : ""}>Por persona</option>
                <option value="porNino" ${activity.mode === "porNino" ? "selected" : ""}>Por niño</option>
              </select>
            </td>
            <td><button type="button" class="button-secondary" onclick="removeActivity(${index})">Eliminar</button></td>
          `;
    body.appendChild(row);
  });
}

function calculate() {
  const ninos = parseInt(document.getElementById("ninos").value) || 0;
  const educadores = parseInt(document.getElementById("educadores").value) || 0;
  const preeducadores =
    parseInt(document.getElementById("preeducadores").value) || 0;
  const otros = parseInt(document.getElementById("otros").value) || 0;

  const pagoEducadores =
    parseFloat(document.getElementById("pagoEducadores").value) || 0;
  const pagoPreeducadores =
    parseFloat(document.getElementById("pagoPreeducadores").value) || 0;
  const pagoOtros = parseFloat(document.getElementById("pagoOtros").value) || 0;
  const pagoEducadoresTotal = pagoEducadores * educadores;
  const pagoPreeducadoresTotal = pagoPreeducadores * preeducadores;
  const pagoOtrosTotal = pagoOtros * otros;
  const totalPersonas = ninos + educadores + preeducadores + otros;

  const gastosTotal = activities.reduce((sum, activity) => {
    let base = activity.price;
    if (activity.mode === "porPersona") {
      base = activity.price * totalPersonas;
    } else if (activity.mode === "porNino") {
      base = activity.price * ninos;
    }
    return sum + base;
  }, 0);
  const aportePersonal =
    pagoEducadoresTotal + pagoPreeducadoresTotal + pagoOtrosTotal;
  const totalGrupo = gastosTotal;
  const costePorNino =
    ninos > 0 ? Math.max(0, totalGrupo - aportePersonal) / ninos : 0;

  document.getElementById("gastosTotal").textContent =
    formatCurrency(gastosTotal);
  document.getElementById("aportePersonal").textContent =
    formatCurrency(aportePersonal);
  document.getElementById("totalGrupo").textContent =
    formatCurrency(totalGrupo);
  document.getElementById("precioPorNino").textContent =
    formatCurrency(costePorNino);
  document.getElementById("totalPersonas").textContent = totalPersonas;

  const summary = [
    {
      concepto: "Gastos y actividades",
      total: gastosTotal,
      detalle: activities.length + " gasto(s)",
    },
    {
      concepto: "Pago educadores",
      total: pagoEducadoresTotal,
      detalle: `${educadores} x ${formatCurrency(pagoEducadores)}`,
    },
    {
      concepto: "Pago preeducadores",
      total: pagoPreeducadoresTotal,
      detalle: `${preeducadores} x ${formatCurrency(pagoPreeducadores)}`,
    },
    {
      concepto: "Pago otros",
      total: pagoOtrosTotal,
      detalle: `${otros} x ${formatCurrency(pagoOtros)}`,
    },
    {
      concepto: "Total grupo",
      total: totalGrupo,
      detalle: `${totalPersonas} personas`,
    },
  ];

  const summaryBody = document.getElementById("summaryBody");
  summaryBody.innerHTML = "";
  summary.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.concepto}</td>
            <td style="text-align: right">${formatCurrency(item.total)}</td>
            <td style="text-align: right">${item.detalle}</td>
          `;
    summaryBody.appendChild(row);
  });
}

const themeToggle = document.getElementById("themeToggle");

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

renderActivities();
initializeTheme();
calculate();

document.getElementById("ninos").addEventListener("change", calculate);
document.getElementById("educadores").addEventListener("change", calculate);
document.getElementById("pagoEducadores").addEventListener("change", calculate);
document.getElementById("preeducadores").addEventListener("change", calculate);
document
  .getElementById("pagoPreeducadores")
  .addEventListener("change", calculate);
document.getElementById("otros").addEventListener("change", calculate);
document.getElementById("pagoOtros").addEventListener("change", calculate);

document
  .getElementById("addActivityButton")
  .addEventListener("click", addActivity);

window.updateActivity = updateActivity;
window.removeActivity = removeActivity;
window.renderActivities = renderActivities;
