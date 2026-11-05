
import { Calculations } from "../utils/calculations.js";

export function renderCalculators() {
  return `
    <div class="section-intro">
      <h1>Engineering Calculator Centre</h1>
      <p>Choose a calculation and enter your values.</p>
    </div>

    <div class="calculator-panel">
      <label for="calculation-type">Calculation type</label>

      <select id="calculation-type">
        <option value="ohms">Ohm's Law: Resistance</option>
        <option value="power">Electrical Power</option>
        <option value="force">Force</option>
        <option value="density">Density</option>
        <option value="pressure">Pressure</option>
      </select>

      <div class="calculator-fields">
        <div>
          <label id="label-one" for="value-one">Voltage (V)</label>
          <input id="value-one" type="number" step="any" placeholder="Enter value">
        </div>

        <div>
          <label id="label-two" for="value-two">Current (A)</label>
          <input id="value-two" type="number" step="any" placeholder="Enter value">
        </div>
      </div>

      <button class="primary-button" id="calculate">Calculate</button>

      <div id="calculation-result" class="calculation-result">
        Your result will appear here.
      </div>
    </div>
  `;
}

export function calculateSelected() {
  const type = document.querySelector("#calculation-type").value;
  const first = Number(document.querySelector("#value-one").value);
  const second = Number(document.querySelector("#value-two").value);
  const result = document.querySelector("#calculation-result");

  if (
    document.querySelector("#value-one").value === "" ||
    document.querySelector("#value-two").value === "" ||
    !Number.isFinite(first) ||
    !Number.isFinite(second)
  ) {
    result.textContent = "Please enter both numerical values.";
    return;
  }

  try {
    let answer;

    switch (type) {
      case "ohms":
        answer = Calculations.ohmsLaw(first, second);
        break;
      case "power":
        answer = Calculations.electricalPower(first, second);
        break;
      case "force":
        answer = Calculations.force(first, second);
        break;
      case "density":
        answer = Calculations.density(first, second);
        break;
      case "pressure":
        answer = Calculations.pressure(first, second);
        break;
    }

    const value = Object.values(answer).find(
      item => typeof item === "number"
    );

    result.innerHTML = `
      <span class="section-tag">CALCULATION RESULT</span>
      <h2>${value} ${answer.unit}</h2>
      <p><strong>Formula:</strong> ${answer.formula}</p>
    `;
  } catch (error) {
    result.textContent = error.message;
  }
}
