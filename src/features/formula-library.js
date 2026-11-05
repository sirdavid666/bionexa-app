
import { formulas } from "../data/formulas.js";

export function renderFormulaLibrary() {
  return `
    <div class="section-intro">
      <h1>Formula Library</h1>
      <p>Explore important engineering equations and their applications.</p>
    </div>

    <div class="calculator-panel">
      <label for="formula-search">Search formulas</label>
      <input id="formula-search"
        placeholder="Search by name or subject...">
    </div>

    <div class="feature-grid" id="formula-results">
      ${formulaCards(formulas)}
    </div>
  `;
}

export function bindFormulaSearch() {
  const search = document.querySelector("#formula-search");
  const results = document.querySelector("#formula-results");

  if (!search || !results) return;

  search.addEventListener("input", () => {
    const query = search.value.toLowerCase();

    const filtered = formulas.filter(formula =>
      `${formula.name} ${formula.subject} ${formula.expression}`
        .toLowerCase()
        .includes(query)
    );

    results.innerHTML = formulaCards(filtered);
  });
}

function formulaCards(items) {
  if (!items.length) {
    return "<p>No matching formulas found.</p>";
  }

  return items.map(formula => `
    <article class="feature-card">
      <span class="section-tag">${formula.subject}</span>
      <h3>${formula.name}</h3>
      <div class="formula-expression">${formula.expression}</div>
      <p><strong>Variables:</strong> ${formula.variables}</p>
      <p><strong>Units:</strong> ${formula.unit}</p>
      <p>${formula.application}</p>
    </article>
  `).join("");
}
