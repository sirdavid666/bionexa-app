
import { Calculations } from "../utils/calculations.js";

const calculatorOptions = {
  ohms: {
    title: "Ohm's Law",
    labels: ["Voltage (V)", "Current (A)"],
    placeholders: ["e.g. 12", "e.g. 2"],
    calculate: values => Calculations.ohmsLaw(values[0], values[1])
  },
  power: {
    title: "Electrical Power",
    labels: ["Voltage (V)", "Current (A)"],
    placeholders: ["e.g. 12", "e.g. 2"],
    calculate: values => Calculations.electricalPower(values[0], values[1])
  },
  force: {
    title: "Force",
    labels: ["Mass (kg)", "Acceleration (m/s²)"],
    placeholders: ["e.g. 5", "e.g. 9.8"],
    calculate: values => Calculations.force(values[0], values[1])
  },
  density: {
    title: "Density",
    labels: ["Mass (kg)", "Volume (m³)"],
    placeholders: ["e.g. 10", "e.g. 2"],
    calculate: values => Calculations.density(values[0], values[1])
  },
  pressure: {
    title: "Pressure",
    labels: ["Force (N)", "Area (m²)"],
    placeholders: ["e.g. 100", "e.g. 2"],
    calculate: values => Calculations.pressure(values[0], values[1])
  }
};

export function renderCalculators() {
  return `
    <div class="page-intro">
      <span class="eyebrow">ENGINEERING TOOLS</span>
      <h2>Calculation workspace</h2>
      <p>Choose a calculation, enter the values and solve.</p>
    </div>

    <section class="calculator-panel">
      <label for="calculation-type">Calculation</label>
      <select id="calculation-type">
        <option value="ohms">Ohm's Law</option>
        <option value="power">Electrical Power</option>
        <option value="force">Force</option>
        <option value="density">Density</option>
        <option value="pressure">Pressure</option>
      </select>

      <div class="calculator-inputs">
        <div>
          <label id="input-label-1" for="calc-input-1">Voltage (V)</label>
          <input id="calc-input-1" type="number" step="any" placeholder="e.g. 12">
        </div>
        <div>
          <label id="input-label-2" for="calc-input-2">Current (A)</label>
          <input id="calc-input-2" type="number" step="any" placeholder="e.g. 2">
        </div>
      </div>

      <button class="primary-button" id="calculate-button">Calculate result</button>
      <div id="calculation-result" class="calculation-result" aria-live="polite">
        Your result will appear here.
      </div>
    </section>
  `;
}

export function calculateSelected() {
  const type = document.querySelector("#calculation-type")?.value;
  const config = calculatorOptions[type];
  const first = Number(document.querySelector("#calc-input-1")?.value);
  const second = Number(document.querySelector("#calc-input-2")?.value);
  const output = document.querySelector("#calculation-result");

  if (!config || !output) return;

  if (
    document.querySelector("#calc-input-1").value.trim() === "" ||
    document.querySelector("#calc-input-2").value.trim() === "" ||
    !Number.isFinite(first) ||
    !Number.isFinite(second)
  ) {
    output.textContent = "Please enter both valid numbers.";
    return;
  }

  if (type === "density" && second === 0) {
    output.textContent = "Volume cannot be zero.";
    return;
  }

  if (type === "pressure" && second === 0) {
    output.textContent = "Area cannot be zero.";
    return;
  }

  if (type === "ohms" && second === 0) {
    output.textContent = "Current cannot be zero when calculating resistance.";
    return;
  }

  const result = config.calculate([first, second]);
  const values = Object.values(result || {}).filter(value => typeof value === "number");
  const number = values[0];

  if (!Number.isFinite(number)) {
    output.textContent = "Unable to calculate. Check your values.";
    return;
  }

  output.innerHTML = `
    <span class="eyebrow">${config.title.toUpperCase()}</span>
    <h3>${number.toLocaleString(undefined, { maximumFractionDigits: 6 })} ${result.unit || ""}</h3>
    <p>${result.formula || "Calculation completed."}</p>
  `;
}

export function bindCalculatorControls() {
  const select = document.querySelector("#calculation-type");

  select?.addEventListener("change", () => {
    const config = calculatorOptions[select.value];
    if (!config) return;

    document.querySelector("#input-label-1").textContent = config.labels[0];
    document.querySelector("#input-label-2").textContent = config.labels[1];
    document.querySelector("#calc-input-1").placeholder = config.placeholders[0];
    document.querySelector("#calc-input-2").placeholder = config.placeholders[1];
    document.querySelector("#calculation-result").textContent = "Enter values for your new calculation.";
  });
}
