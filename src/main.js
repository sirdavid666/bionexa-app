
import "./style.css";

import { renderTutor, sendTutorQuestion, clearTutorHistory } from "./features/tutor.js";
import { renderCalculators, calculateSelected, bindCalculatorControls } from "./features/calculators.js";
import { subjects } from "./data/subjects.js";
import { renderNotes, saveNote, deleteNote } from "./features/notes.js";
import { renderPlanner, addTask, toggleTask, deleteTask } from "./features/planner.js";
import { renderFormulaLibrary, bindFormulaSearch } from "./features/formula-library.js";
import { renderQuiz, bindQuiz } from "./features/quiz.js";
import { renderFlashcards, bindFlashcards } from "./features/flashcards.js";
import { renderLectureRecorder, bindLectureRecorder } from "./features/lecture-recorder.js";
import { renderPracticeHistory, bindPracticeHistory } from "./features/practice-history.js";
import { renderProgress } from "./features/progress.js";

const pages = [
  { id: "home", label: "Dashboard", icon: "⌂" },
  { id: "tutor", label: "AI Tutor", icon: "✦" },
  { id: "library", label: "Subjects", icon: "▤" },
  { id: "tools", label: "Calculators", icon: "⌗" },
  { id: "formulas", label: "Formulas", icon: "ƒ" },
  { id: "quiz", label: "AI Quiz", icon: "✓" },
  { id: "flashcards", label: "AI Flashcards", icon: "▣" },
  { id: "history", label: "Practice History", icon: "◷" },
  { id: "progress", label: "Progress", icon: "↗" },
  { id: "planner", label: "Study Planner", icon: "▦" },
  { id: "recorder", label: "Lecture Recorder", icon: "◉" },
  { id: "notes", label: "My Notes", icon: "✎" }
];

let activePage = "home";
const app = document.querySelector("#app");

function getDateLabel() {
  return new Date().toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function renderShell() {
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">B</div>
          <div>
            <strong>BioNexa</strong>
            <small>Biomedical Engineering</small>
          </div>
        </div>

        <div class="sidebar-label">WORKSPACE</div>
        <nav class="navigation">
          ${pages.map(page => `
            <button class="nav-item ${activePage === page.id ? "active" : ""}"
              data-page="${page.id}">
              <span class="nav-icon">${page.icon}</span>
              <span>${page.label}</span>
            </button>
          `).join("")}
        </nav>

        <div class="sidebar-bottom">
          <div class="sidebar-tip">
            <span>✦</span>
            <strong>Keep learning.</strong>
            <p>Small steps build strong engineers.</p>
          </div>
          <button class="theme-toggle" id="theme-toggle">☼ Switch appearance</button>
        </div>
      </aside>

      <main class="main-area">
        <header class="topbar">
          <div>
            <span class="topbar-caption">YOUR LEARNING SPACE</span>
            <h2>${pages.find(page => page.id === activePage)?.label || "Dashboard"}</h2>
          </div>
          <div class="topbar-date">${getDateLabel()}</div>
        </header>
        <section class="page-content" id="page-content"></section>
      </main>
    </div>
  `;

  app.querySelectorAll("[data-page]").forEach(button => {
    button.addEventListener("click", () => {
      activePage = button.dataset.page;
      renderApp();
    });
  });

  document.querySelector("#theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
  });
}

function renderHome() {
  return `
    <section class="hero-card">
      <div class="hero-copy">
        <span class="eyebrow">WELCOME TO BIONEXA</span>
        <h1>Learn with purpose.<br>Build with knowledge.</h1>
        <p>Your academic companion for Biomedical Engineering.</p>
        <button class="primary-button" data-go="tutor">Continue to AI Tutor →</button>
      </div>
      <div class="hero-symbol">＋</div>
    </section>

    <div class="section-heading">
      <div>
        <span class="eyebrow">YOUR WORKSPACE</span>
        <h3>Learning tools</h3>
      </div>
    </div>

    <div class="feature-grid">
      ${[
        ["tutor", "✦", "AI Tutor", "Learn concepts and ask questions."],
        ["library", "▤", "Subject Library", "Explore your course subjects."],
        ["tools", "⌗", "Calculators", "Solve engineering calculations."],
        ["formulas", "ƒ", "Formula Library", "Review important formulas."],
        ["quiz", "✓", "AI Quiz", "Generate fresh practice questions."],
        ["flashcards", "▣", "AI Flashcards", "Create topic-based revision cards."],
        ["history", "◷", "Practice History", "Review completed quiz attempts."],
        ["progress", "↗", "Progress", "Identify topics to revise."],
        ["planner", "▦", "Study Planner", "Organise academic tasks."],
        ["recorder", "◉", "Lecture Recorder", "Record lectures on supported devices."],
        ["notes", "✎", "My Notes", "Keep personal study notes."]
      ].map(([id, icon, title, description]) => `
        <button class="feature-card" data-go="${id}">
          <span class="feature-icon">${icon}</span>
          <strong>${title}</strong>
          <p>${description}</p>
          <span class="card-arrow">Open →</span>
        </button>
      `).join("")}
    </div>

    <div class="welcome-card">
      <span class="eyebrow">YOUR STUDY FOUNDATION</span>
      <h3>Consistency matters more than speed.</h3>
      <p>Learn concepts, practise calculations and organise your studies one step at a time.</p>
    </div>
  `;
}

function renderLibrary() {
  return `
    <div class="page-intro">
      <span class="eyebrow">ACADEMIC LIBRARY</span>
      <h2>Biomedical Engineering subjects</h2>
      <p>Explore the core areas of your course.</p>
    </div>
    <div class="subject-grid">
      ${subjects.map(subject => `
        <article class="subject-card">
          <h3>${subject.name}</h3>
          <p>${subject.topics.join(" · ")}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderPage() {
  const content = document.querySelector("#page-content");

  const renderers = {
    home: renderHome,
    tutor: renderTutor,
    library: renderLibrary,
    tools: renderCalculators,
    formulas: renderFormulaLibrary,
    quiz: renderQuiz,
    flashcards: renderFlashcards,
    history: renderPracticeHistory,
    progress: renderProgress,
    planner: renderPlanner,
    recorder: renderLectureRecorder,
    notes: renderNotes
  };

  content.innerHTML = (renderers[activePage] || renderHome)();
  bindPageFeatures(content);
}

function bindPageFeatures(content) {
  content.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => {
      activePage = button.dataset.go;
      renderApp();
    });
  });

  if (activePage === "tutor") {
    const send = () => sendTutorQuestion();

    content.querySelector("#send-question")?.addEventListener("click", send);

    content.querySelector("#tutor-input")?.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        send();
      }
    });

    content.querySelectorAll("[data-prompt]").forEach(button => {
      button.addEventListener("click", () => {
        const input = content.querySelector("#tutor-input");
        input.value = button.dataset.prompt;
        send();
      });
    });

    content.querySelector("#clear-chat")?.addEventListener("click", () => {
      clearTutorHistory();
      renderApp();
    });
  }

  if (activePage === "tools") {
    bindCalculatorControls();
    content.querySelector("#calculate-button")?.addEventListener("click", calculateSelected);
  }

  if (activePage === "notes") {
    content.querySelector("#save-note")?.addEventListener("click", () => {
      saveNote();
      renderApp();
    });

    content.querySelectorAll("[data-delete-note]").forEach(button => {
      button.addEventListener("click", () => {
        deleteNote(button.dataset.deleteNote);
        renderApp();
      });
    });
  }

  if (activePage === "planner") {
    content.querySelector("#add-task")?.addEventListener("click", () => {
      addTask();
      renderApp();
    });

    content.querySelectorAll("[data-toggle-task]").forEach(button => {
      button.addEventListener("click", () => {
        toggleTask(button.dataset.toggleTask);
        renderApp();
      });
    });

    content.querySelectorAll("[data-delete-task]").forEach(button => {
      button.addEventListener("click", () => {
        deleteTask(button.dataset.deleteTask);
        renderApp();
      });
    });
  }

  if (activePage === "formulas") bindFormulaSearch();
  if (activePage === "quiz") bindQuiz();
  if (activePage === "flashcards") bindFlashcards();
  if (activePage === "history") bindPracticeHistory();
  if (activePage === "recorder") bindLectureRecorder();
}

function renderApp() {
  renderShell();
  renderPage();
}

renderApp();
