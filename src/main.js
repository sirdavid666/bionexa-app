
import "./style.css";
import { renderTutor } from "./features/tutor.js";
import { renderCalculators } from "./features/calculators.js";
import { subjects } from "./data/subjects.js";
import { renderNotes } from "./features/notes.js";

const app = document.querySelector("#app");

const pages = [
  ["home", "⌂", "Dashboard"],
  ["tutor", "✧", "AI Tutor"],
  ["library", "▤", "Learning Library"],
  ["tools", "⌘", "Engineering Tools"],
  ["notes", "▧", "My Notes"]
];

let currentPage = "home";

function render() {
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">B</div>
          <div>
            <h1>BioNexa</h1>
            <span>LEARN. ENGINEER. INNOVATE.</span>
          </div>
        </div>

        <div class="nav-heading">WORKSPACE</div>

        <nav class="navigation">
          ${pages.map(([id, icon, label]) => `
            <button class="nav-item ${currentPage === id ? "active" : ""}"
              data-page="${id}">
              <span class="nav-icon">${icon}</span>${label}
            </button>
          `).join("")}
        </nav>

        <div class="sidebar-bottom">
          <div class="profile-avatar">D</div>
          <div class="profile-info">
            <strong>David</strong>
            <span>Biomedical Engineering</span>
          </div>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div>
            <span class="eyebrow">YOUR ACADEMIC COMPANION</span>
            <h2>${pages.find(page => page[0] === currentPage)[2]}</h2>
          </div>
          <button class="theme-button" id="theme-toggle">☼</button>
        </header>

        <section class="page-content">
          ${renderPage()}
        </section>

        <footer class="footer">
          BioNexa <span>•</span> Built for Biomedical Engineering
        </footer>
      </main>
    </div>
  `;

  bindNavigation();
  bindTheme();
  bindPageFeatures();
}

function renderPage() {
  switch (currentPage) {
    case "tutor":
      return renderTutor();

    case "tools":
      return renderCalculators();

    case "library":
      return `
        <div class="section-intro">
          <h1>Biomedical Engineering Library</h1>
          <p>Explore your academic subjects.</p>
        </div>

        <div class="feature-grid">
          ${subjects.map(subject => `
            <article class="feature-card">
              <span class="feature-icon">${subject.icon}</span>
              <strong>${subject.name}</strong>
              <p>${subject.description}</p>
              <span class="card-arrow">${subject.topics.length} topics</span>
              <details>
                <summary>Explore topics</summary>
                <ul>
                  ${subject.topics.map(topic => `<li>${topic}</li>`).join("")}
                </ul>
              </details>
            </article>
          `).join("")}
        </div>
      `;

    case "notes":
      return renderNotes();

    default:
      return `
        <div class="hero-card">
          <div>
            <span class="section-tag">WELCOME TO YOUR LEARNING SPACE</span>
            <h1>Welcome, David.</h1>
            <p>Your Biomedical Engineering learning environment
            is taking shape. Learn deeply, think critically
            and build confidently.</p>
            <button class="primary-button" data-page="tutor">
              Open AI Tutor →
            </button>
          </div>
          <div class="hero-symbol">B</div>
        </div>

        <div class="section-heading">
          <h2>Your workspace</h2>
          <p>Choose where you want to begin.</p>
        </div>

        <div class="feature-grid">
          ${homeCard("AI Academic Tutor", "Ask questions and learn with AI.", "✧", "tutor")}
          ${homeCard("Learning Library", "Explore Biomedical Engineering.", "▤", "library")}
          ${homeCard("Engineering Tools", "Calculate and solve problems.", "⌘", "tools")}
          ${homeCard("Personal Notes", "Organise your academic knowledge.", "▧", "notes")}
        </div>
      `;
  }
}

function homeCard(title, description, icon, page) {
  return `
    <button class="feature-card" data-page="${page}">
      <span class="feature-icon">${icon}</span>
      <strong>${title}</strong>
      <p>${description}</p>
      <span class="card-arrow">Open →</span>
    </button>
  `;
}

function bindNavigation() {
  document.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
      currentPage = button.dataset.page;
      render();
    });
  });
}

function bindTheme() {
  document.querySelector("#theme-toggle")?.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
}

function bindPageFeatures() {
  if (currentPage === "tutor") {
    document.querySelector("#send-question")?.addEventListener("click", async () => {
      const { sendTutorQuestion } = await import("./features/tutor.js");
      sendTutorQuestion();
    });

    document.querySelector("#question-input")?.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        document.querySelector("#send-question")?.click();
      }
    });

    document.querySelectorAll("[data-prompt]").forEach(button => {
      button.addEventListener("click", () => {
        const input = document.querySelector("#question-input");
        input.value = button.dataset.prompt;
        input.focus();
      });
    });
  }

  if (currentPage === "tools") {
    document.querySelector("#calculate")?.addEventListener("click", async () => {
      const { calculateSelected } = await import("./features/calculators.js");
      calculateSelected();
    });
  }

  if (currentPage === "notes") {
    document.querySelector("#save-note")?.addEventListener("click", async () => {
      const { saveNote } = await import("./features/notes.js");
      saveNote();
      render();
    });

    document.querySelectorAll("[data-delete-note]").forEach(button => {
      button.addEventListener("click", async () => {
        const { deleteNote } = await import("./features/notes.js");
        deleteNote(Number(button.dataset.deleteNote));
        render();
      });
    });
  }
}

render();
